from copy import copy
from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.history.services import history
from apps.projects.models import (
    ProjectStatuses,
    Project,
    ProjectWorkingHours,
    WorkLoadStatus
)
from apps.projects.serializers import (
    ProjectSerializer,
    ProjectWorkingHoursSimpleSerializer,
    WorkLoadStatusSerializer
)
from apps.users.models import BaseUser
from apps.users.serializers import UserSerializer
from core.utils import current_date
from core.mixins import GetUserMixin
from core.permissions import check_full_assessor_permission
from core.users import UserStatus
from .models import Assessor, Skill, AssessorCredentials, AssessorState
from .services import assessors_service


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CreateUpdateAssessorSerializer(GetUserMixin, serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER)
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        exclude = [
            'projects',
            'second_manager',
            'state',
            'date_of_registration',
        ]

    def validate(self, attrs: Dict) -> Dict:
        current_manager = self.get_user()
        manager = attrs.get('manager')
        if manager is None:
            if not self.instance:
                raise ValidationError(
                    {'manager': ['Укажите ответственного менеджера.']}
                )
        else:
            if self.instance and self.instance.manager is not None and self.instance.manager != manager:
                raise ValidationError(
                    {'manager': ['Невозможно поменять руководителя.']}
                )

            if manager.manager_profile.is_teamlead:
                raise ValidationError(
                    {'manager': ['Операционный менеджер не может быть ответственным менеджером '
                                 'исполнителя.']}
                )

            if current_manager.manager_profile.is_teamlead:
                if manager.manager_profile.teamlead != current_manager:
                    raise ValidationError(
                        {'manager': [f'Менеджер {manager.full_name} не в вашей команде.']}
                    )

        email = attrs.get('email')
        if email is not None:
            if Assessor.objects.filter(email=email).exists():
                raise ValidationError(
                    {'email': ['Данный адрес электронной почты уже используется.']}
                )

        return super().validate(attrs)

    def create(self, validated_data: Dict) -> Assessor:
        skills = validated_data.pop('skills', None)
        assessor = assessors_service.create_assessor(
            state=AssessorState.AVAILABLE,
            **validated_data
        )
        if skills is not None:
            assessors_service.set_skills(assessor, skills)

        history.new_assessor_history(
            assessor=assessor,
            user=self.get_user().full_name
        )
        return assessor

    def update(self, instance: Assessor, validated_data: Dict) -> Assessor:
        assessor = super().update(instance, validated_data)
        assessor = assessors_service.check_and_update_state(assessor)

        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name
        )
        return assessor


class AssessorProjectsSerializer(GetUserMixin, serializers.ModelSerializer):
    projects = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.exclude(status=ProjectStatuses.COMPLETED),
        many=True
    )
    reason = serializers.CharField(
        required=False,
        max_length=255
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.projects_before_update = [pr.pk for pr in instance.projects.all()]
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        fields = ['projects', 'reason']

    def update(self, instance: Assessor, validated_data: Dict) -> Assessor:
        assessor = super().update(instance, validated_data)
        manager = self.get_user()
        assessors_service.check_and_remove_second_managers(
            instance=assessor,
            manager=manager
        )
        assessors_service.check_and_update_state(assessor)
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            old_projects=self.projects_before_update,
            state_reason=validated_data.get('reason')
        )

        return assessor


class SimpleAssessorSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True)

    class Meta:
        model = Assessor
        exclude = ['projects', 'skills', 'second_manager']


class AssessorSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True)
    projects = ProjectSerializer(read_only=True, many=True)
    skills = SkillSerializer(read_only=True, many=True)
    second_manager = UserSerializer(read_only=True, many=True)
    working_hours = serializers.SerializerMethodField(method_name='get_working_hours')
    workload_status = serializers.SerializerMethodField(method_name='get_workload_status')

    class Meta:
        model = Assessor
        fields = '__all__'

    def get_working_hours(self, obj: Assessor) -> Dict:
        wh = ProjectWorkingHours.objects.filter(assessor=obj, project__in=obj.projects.all())
        serialized = ProjectWorkingHoursSimpleSerializer(wh, many=True)
        return serialized.data

    def get_workload_status(self, obj: Assessor) -> Dict:
        ws = WorkLoadStatus.objects.filter(assessor=obj, project__in=obj.projects.all())
        serialized = WorkLoadStatusSerializer(ws, many=True)
        return serialized.data


class CheckAssessorSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True)
    projects = ProjectSerializer(read_only=True, many=True)

    class Meta:
        model = Assessor
        fields = [
            'pk',
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'manager',
            'projects',
            'state'
        ]


class CreateUpdateAssessorCredentialsSerializer(GetUserMixin, serializers.ModelSerializer):
    assessor = serializers.PrimaryKeyRelatedField(
        queryset=Assessor.objects.filter(state__in=AssessorState.work_states())
    )

    class Meta:
        model = AssessorCredentials
        fields = '__all__'

    def validate(self, attrs: Dict) -> Dict:
        manager = self.get_user()
        assessor = attrs.get('assessor')
        check_full_assessor_permission(manager, assessor)
        tool = attrs.get('tool')
        if AssessorCredentials.objects.filter(assessor=assessor, tool__iexact=tool).exists():
            raise ValidationError(
                {'tool': f'У исполнителя {assessor.full_name} уже есть '
                         f'учетные данные для инструмента {tool}.'}
            )

        return super().validate(attrs)


class AssessorCredentialsSerializer(serializers.ModelSerializer):
    assessor = SimpleAssessorSerializer(read_only=True)

    class Meta:
        model = AssessorCredentials
        fields = '__all__'


class AssessorVacationSerializer(GetUserMixin, serializers.ModelSerializer):
    vacation = serializers.BooleanField()

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        fields = ['vacation', 'vacation_date']

    def validate(self, attrs: Dict) -> Dict:
        assessor = self.instance
        if not assessor.manager:
            raise ValidationError(
                {'vacation': ['У исполнителя нет руководителя.']}
            )

        vacation = attrs.get('vacation')
        if vacation is None:
            raise ValidationError(
                {'vacation': ['Это обязательное поле.']}
            )

        if vacation:
            vacation_date = attrs.get('vacation_date')
            if vacation_date is None:
                raise ValidationError(
                    {'vacation_date': ['Это обязательное поле.']}
                )

            if current_date() > vacation_date:
                raise ValidationError(
                    {'vacation_date': ['Дата выхода из отпуска не может быть меньше текущей даты.']}
                )

            if assessor.state == AssessorState.VACATION:
                raise ValidationError(
                    {'vacation': ['Исполнитель уже находится в отпуске.']}
                )

            if assessor.projects.exists():
                raise ValidationError(
                    {'vacation': ['У исполнителя есть активные проекты.']}
                )

            if assessor.state == AssessorState.FREE_RESOURCE:
                raise ValidationError(
                    {'vacation': ['Исполнитель находится в свободных ресурсах.']}
                )

            if assessor.state == AssessorState.FIRED:
                raise ValidationError(
                    {'vacation': ['Исполнитель уволен.']}
                )

            if assessor.state == AssessorState.BLACKLIST:
                raise ValidationError(
                    {'vacation': ['Исполнитель в черном списке.']}
                )
        else:
            if assessor.state in AssessorState.work_states():
                raise ValidationError(
                    {'vacation': ['Исполнитель уже работает.']}
                )

        return super().validate(attrs)

    def save(self, **kwargs) -> Assessor:
        if self.validated_data.get('vacation'):
            assessor = assessors_service.to_vacation(
                self.instance,
                vacation_date=self.validated_data.get('vacation_date')
            )
        else:
            assessor = assessors_service.from_vacation(self.instance)

        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name
        )
        return assessor


class AssessorFreeResourceSerializer(GetUserMixin, serializers.ModelSerializer):
    REASON = {
        'free_time': 'Есть свободное время',
        'project_reduction': 'Сокращение проекта',
        'project_mismatch': 'Не подходит текущему проекту'
    }

    free_resource = serializers.BooleanField()
    reason = serializers.ChoiceField(choices=tuple(REASON.items()), required=False)

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        fields = [
            'free_resource',
            'reason',
            'free_resource_weekday_hours',
            'free_resource_day_off_hours'
        ]

    def validate(self, attrs: Dict) -> Dict:
        assessor = self.instance
        if not assessor.manager:
            raise ValidationError(
                {'vacation': ['У исполнителя нет руководителя.']}
            )

        if assessor.state == AssessorState.FIRED:
            raise ValidationError(
                {'free_resource': ['Исполнитель уволен.']}
            )

        if assessor.state == AssessorState.BLACKLIST:
            raise ValidationError(
                {'free_resource': ['Исполнитель в черном списке.']}
            )

        if assessor.state == AssessorState.VACATION:
            raise ValidationError(
                {'free_resource': ['Исполнитель в отпуске.']}
            )

        free_resource = attrs.get('free_resource')
        if free_resource is None:
            raise ValidationError(
                {'free_resource': ['Это обязательное поле.']}
            )

        if free_resource:
            if assessor.state == AssessorState.FREE_RESOURCE:
                raise ValidationError(
                    {'free_resource': ['Исполнитель уже находится в свободных ресурсах.']}
                )

            reason = attrs.get('reason')
            if reason is None:
                raise ValidationError(
                    {'reason': ['Укажите причину.']}
                )

            free_resource_weekday_hours = attrs.get('free_resource_weekday_hours')
            if not free_resource_weekday_hours:
                raise ValidationError(
                    {'free_resource_weekday_hours': ['Это обязательное поле.']}
                )

            free_resource_day_off_hours = attrs.get('free_resource_day_off_hours')
            if not free_resource_day_off_hours:
                raise ValidationError(
                    {'free_resource_day_off_hours': ['Это обязательное поле.']}
                )
        else:
            if assessor.state == AssessorState.AVAILABLE or assessor.state == AssessorState.BUSY:
                raise ValidationError(
                    {'free_resource': ['Исполнитель уже работает.']}
                )

        return super().validate(attrs)

    def save(self, **kwargs) -> Assessor:
        free_resource = self.validated_data.get('free_resource')
        if free_resource:
            assessor = assessors_service.to_free_resources(
                self.instance,
                weekday_hours=self.validated_data.get('free_resource_weekday_hours'),
                day_off_hours=self.validated_data.get('free_resource_day_off_hours')
            )
        else:
            assessor = assessors_service.from_free_resources(self.instance)

        reason_key = self.validated_data.get('reason')
        reason = self.REASON.get(reason_key) if reason_key is not None else None
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            state_reason=reason
        )
        return assessor


class UnpinAssessorSerializer(GetUserMixin, serializers.ModelSerializer):
    REASON = {
        'project': 'Не смог работать со спецификой проекта',
        'work': 'Не сработались',
        'transfer': 'Передача проекта другому менеджеру'
    }
    reason = serializers.ChoiceField(choices=tuple(REASON.items()))
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER),
        required=False
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        fields = ['reason', 'manager']

    @staticmethod
    def _error(error: str) -> None:
        raise ValidationError(
            {'detail': [error]}
        )

    def validate(self, attrs: Dict) -> Dict:
        if self.instance.state == AssessorState.FREE_RESOURCE:
            self._error('Исполнитель находится в свободных ресурсах.')
        if self.instance.state == AssessorState.VACATION:
            self._error('Исполнитель находится в отпуске.')
        if self.instance.state == AssessorState.FIRED:
            self._error('Исполнитель уволен.')
        if self.instance.projects.filter(manager=self.instance.manager).exists():
            self._error('У исполнителя есть активные проекты текущего менеджера.')
        if self.instance.manager is None:
            self._error('У исполнителя нет руководителя.')

        if attrs.get('reason') is None:
            raise ValidationError(
                {'reason': ['Укажите причину.']}
            )

        manager = attrs.get('manager')
        if manager and manager.manager_profile.is_teamlead:
            raise ValidationError(
                {'manager': ['Операционный менеджер не может быть ответственным менеджером '
                             'исполнителя.']}
            )

        return super().validate(attrs)

    def save(self, **kwargs) -> Assessor:
        new_manager = self.validated_data.get('manager')
        if new_manager is None:
            assessor = assessors_service.unpin(self.instance)
        else:
            assessor = assessors_service.to_new_team(
                self.instance,
                manager=new_manager
            )

        reason_key = self.validated_data.get('reason')
        reason = self.REASON.get(reason_key) if reason_key is not None else None
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            unpin_reason=reason
        )
        return assessor


class UpdateFreeResourceSerializer(GetUserMixin, serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER),
        required=False
    )
    second_manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER),
        required=False
    )
    projects = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.exclude(status=ProjectStatuses.COMPLETED),
        many=True,
        required=False
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.projects_before_update = [pr.pk for pr in instance.projects.all()]
            self.second_managers_before_update = [man.pk for man in instance.second_manager.all()]
            self.instance_before_update = copy(instance)

    class Meta:
        model = Assessor
        fields = ['second_manager', 'manager', 'projects']

    def validate(self, attrs: Dict) -> Dict:
        if self.instance.manager is None:
            manager = attrs.get('manager')
            if manager is None:
                raise ValidationError(
                    {'manager': ['Укажите ответственного менеджера, т.к. '
                                 'исполнитель находится без команды.']}
                )
            else:
                if manager.manager_profile.is_teamlead:
                    raise ValidationError(
                        {'manager': ['Операционный менеджер не может быть ответственным менеджером '
                                     'исполнителя.']}
                    )
        else:
            second_manager = attrs.get('second_manager')
            projects = attrs.get('projects')
            if second_manager is None:
                raise ValidationError(
                    {'second_manager': ['Укажите дополнительного менеджера.']}
                )
            if not projects:
                raise ValidationError(
                    {'projects': ['Укажите проекты.']}
                )
            if second_manager.manager_profile.is_teamlead:
                raise ValidationError(
                    {'second_manager': ['Операционный менеджер не может быть ответственным менеджером '
                                        'исполнителя.']}
                )

        return super().validate(attrs)

    def update(self, instance: Assessor, validated_data: Dict) -> Assessor:
        if instance.manager is None:
            assessor = assessors_service.to_new_team(
                instance,
                manager=validated_data.get('manager'),
                state=AssessorState.AVAILABLE
            )
        else:
            assessor = assessors_service.add_second_manager(
                instance,
                manager=validated_data.get('second_manager'),
                projects=validated_data.get('projects')
            )

        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            old_projects=self.projects_before_update,
            use_none_action_for_state=True
        )
        return assessor
