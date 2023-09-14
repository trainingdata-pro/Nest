from copy import copy
from typing import List, Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.history.utils import history
from apps.projects.models import ProjectStatuses, Project, ProjectWorkingHours
from apps.projects.serializers import ProjectSerializer, ProjectWorkingHoursSimpleSerializer
from apps.users.models import BaseUser, ManagerProfile
from apps.users.serializers import UserSerializer
from core.utils.common import current_date
from core.utils.mixins import GetUserMixin
from core.utils.permissions import check_full_assessor_permission
from core.utils.users import UserStatus
from .models import Assessor, Skill, AssessorCredentials, AssessorState
from .utils.common import check_project_permission


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CreateUpdateAssessorSerializer(GetUserMixin, serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER)
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
        exclude = [
            'second_manager',
            'state',
            'date_of_registration',
        ]

    def validate(self, attrs: Dict) -> Dict:
        current_manager = self.get_user()
        manager = attrs.get('manager')
        if manager is not None:
            if manager.manager_profile.is_teamlead:
                raise ValidationError(
                    {'manager': ['Операционный менеджер не может быть ответственным менеджером '
                                 'исполнителя.']}
                )
            else:
                if current_manager.manager_profile.is_teamlead:
                    if manager.teamlead != current_manager:
                        raise ValidationError(
                            {'manager': [f'Менеджер {manager.full_name} не в вашей команде.']}
                        )
                else:
                    if current_manager.pk != manager.pk:
                        raise ValidationError(
                            {'manager': ['Вы не можете выбрать другого менеджера.']}
                        )
        else:
            if (self.instance
                    and current_manager.pk == self.instance.manager.pk
                    and self.instance.second_manager.exists()):
                raise ValidationError(
                    {'manager': ['Невозможно убрать исполнителя из команды, т.к. он '
                                 'работает у других менеджеров как свободный ресурс.']}
                )

        projects = attrs.get('projects')
        if projects:
            check_project_permission(projects, current_manager)
            status = attrs.get('status')
            if self.instance:
                if self.instance.status is None and status is None:
                    raise ValidationError(
                        {'status': ['Укажите статус исполнителя.']}
                    )
            else:
                if status is None:
                    raise ValidationError(
                        {'status': ['Укажите статус исполнителя.']}
                    )

        # is_free_resource = attrs.get('is_free_resource')
        # if is_free_resource is True:
        #     free_resource_weekday_hours = attrs.get('free_resource_weekday_hours')
        #     if free_resource_weekday_hours is None:
        #         raise ValidationError(
        #             {'free_resource_weekday_hours': ['Укажите время работы в рабочие дни.']}
        #         )
        #     free_resource_day_off_hours = attrs.get('free_resource_day_off_hours')
        #     if free_resource_day_off_hours is None:
        #         raise ValidationError(
        #             {'free_resource_day_off_hours': ['Укажите время работы в выходные дни.']}
        #         )

        return super().validate(attrs)

    @staticmethod
    def _update_if_free_resource(validated_data: Dict, instance: Assessor = None) -> Dict:
        if validated_data.get('is_free_resource') is False:
            if instance is not None and instance.second_manager.exists():
                raise ValidationError(
                    {'is_free_resource': ['Нельзя удалить исполнителя из свободных ресурсов, '
                                          'т.к. он работает у других менеджеров.']}
                )
            validated_data['free_resource_weekday_hours'] = None
            validated_data['free_resource_day_off_hours'] = None

        return validated_data

    @staticmethod
    def _create_assessor_without_team(instance: Assessor) -> Assessor:
        raise ValidationError(
            'В спецификации не сказано, что делать с ассессором без менеджера, '
            'так что передай параметр manager.'
        )
        # instance.is_free_resource = True
        # instance.free_resource_weekday_hours = None
        # instance.free_resource_day_off_hours = None
        # instance.status = AssessorStatus.RESERVED
        #
        # return instance

    def create(self, validated_data: Dict) -> Assessor:
        skills = validated_data.pop('skills', None)
        projects = validated_data.pop('projects', None)
        assessor = Assessor(**validated_data)
        if assessor.manager is None:
            assessor = self._create_assessor_without_team(assessor)

        assessor.save()

        if skills is not None:
            assessor.skills.set(skills)

        if projects is not None and assessor.manager is not None:
            assessor.projects.set(projects)
            assessor.state = AssessorState.BUSY
        else:
            assessor.state = AssessorState.AVAILABLE

        assessor.save()
        history.new_assessor_history(assessor)
        return assessor

    def update(self, instance: Assessor, validated_data: Dict) -> Assessor:
        validated_data = self._update_if_free_resource(validated_data, instance)
        assessor = super().update(instance, validated_data)
        if assessor.manager is None:
            assessor = self._create_assessor_without_team(assessor)
            assessor.save()

        if assessor.projects.exists():
            assessor.state = AssessorState.BUSY
        else:
            assessor.state = AssessorState.AVAILABLE

        assessor.save()
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            updated_assessor=assessor,
            old_projects=set(self.projects_before_update),
            old_second_managers=set(self.second_managers_before_update)
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

    class Meta:
        model = Assessor
        fields = '__all__'

    def get_working_hours(self, obj: Assessor) -> Dict:
        wh = ProjectWorkingHours.objects.filter(assessor=obj, project__in=obj.projects.all())
        serialized = ProjectWorkingHoursSimpleSerializer(wh, many=True)
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


class AssessorVacationSerializer(serializers.ModelSerializer):
    vacation = serializers.BooleanField()

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

            if assessor.is_free_resource:
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
        assessor = self.instance
        vacation = self.validated_data.get('vacation')
        if vacation:
            vacation_date = self.validated_data.get('vacation_date')
            assessor.state = AssessorState.VACATION
            assessor.vacation_date = vacation_date
        else:
            assessor.state = AssessorState.AVAILABLE
            assessor.vacation_date = None

        assessor.save()
        history.vacation_history(assessor, to_vacation=vacation)
        return assessor


class AssessorFreeResourceSerializer(serializers.ModelSerializer):
    # REASON = (
    #     ('free_time', 'Есть свободное время'),
    #     ('project_reduction', 'Сокращение проекта'),
    #     ('project_mismatch', 'Не подходит текущему проекту')
    # )
    REASON = {
        'free_time': 'Есть свободное время',
        'project_reduction': 'Сокращение проекта',
        'project_mismatch': 'Не подходит текущему проекту'
    }

    free_resource = serializers.BooleanField()
    reason = serializers.ChoiceField(choices=tuple(REASON.items()), required=False)

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
        assessor = self.instance
        free_resource = self.validated_data.get('free_resource')
        reason_key = self.validated_data.get('reason')
        reason = self.REASON.get(reason_key) if reason_key is not None else None
        if free_resource:
            weekday_hours = self.validated_data.get('free_resource_weekday_hours')
            day_off_hours = self.validated_data.get('free_resource_day_off_hours.')
            assessor.state = AssessorState.FREE_RESOURCE
            assessor.free_resource_weekday_hours = weekday_hours
            assessor.free_resource_day_off_hours = day_off_hours
        else:
            assessor.free_resource_weekday_hours = None
            assessor.free_resource_day_off_hours = None
            if assessor.projects.exists():
                assessor.state = AssessorState.BUSY
            else:
                assessor.state = AssessorState.AVAILABLE

        assessor.save()
        history.free_resource_history(assessor, free_resource=free_resource, reason=reason)
        return assessor


class UpdateFreeResourceSerializer(serializers.ModelSerializer):
    pass

    #     def __init__(self, instance=None, *args, **kwargs):
    #         super().__init__(instance=instance, *args, **kwargs)
    #         if instance:
    #             self.projects_before_update = [pr.pk for pr in instance.projects.all()]
    #             self.second_managers_before_update = [man.pk for man in instance.second_manager.all()]
    #             self.instance_before_update = copy(instance)
    #
    class Meta:
        model = Assessor
        fields = ['second_manager', 'manager']
#
#     def get_manager(self) -> ManagerProfile:
#         return self.context.get('request').user.manager
#
#     @staticmethod
#     def _second_manager_validation_error(message: str) -> None:
#         raise ValidationError(
#             {'second_manager': [message]}
#         )
#
#     @staticmethod
#     def _manager_validation_error(message: str) -> None:
#         raise ValidationError(
#             {'manager': [message]}
#         )
#
#     def _check_second_manager(self, second_managers: List[ManagerProfile]) -> None:
#         current_manager = self.get_manager()
#         for manager in second_managers:
#             if self.instance.manager is None:
#                 self._second_manager_validation_error(f'Исполнитель {self.instance.full_name} находится '
#                                                       f'без команды и ему не могут быть назначены доп. '
#                                                       f'менеджеры.')
#             elif manager.is_teamlead:
#                 self._second_manager_validation_error(f'Операционный менеджер {manager.full_name} не может '
#                                                       'быть менеджером свободного ресурса.')
#             elif current_manager.is_teamlead and manager.teamlead != current_manager:
#                 self._second_manager_validation_error(f'Менеджер {manager.full_name} не из вашей команды.')
#             elif self.instance.manager == manager:
#                 self._second_manager_validation_error('Вы не можете быть дополнительным менеджером '
#                                                       'своего исполнителя.')
#
#     def _check_manager(self, new_manager: ManagerProfile = None) -> None:
#         current_manager = self.get_manager()
#         if self.instance.manager and new_manager is not None:
#             self._manager_validation_error(f'У исполнителя {self.instance.full_name} уже есть основной '
#                                            f'менеджер. Вы можете выбрать его только в качестве свободного '
#                                            f'ресурса.')
#         elif self.instance.manager is None:
#             if new_manager.is_teamlead:
#                 self._manager_validation_error('Вы не можете быть менеджером исполнителя. Выберите менеджера '
#                                                'из вашей команды.')
#             elif current_manager.is_teamlead and new_manager.teamlead != current_manager:
#                 self._manager_validation_error('Выберите менеджера из вашей команды.')
#
#     def validate(self, attrs: Dict) -> Dict:
#         if self.instance.is_free_resource is False:
#             self._second_manager_validation_error('Исполнитель не является свободным ресурсом.')
#
#         manager = attrs.get('manager')
#         if manager is not None:
#             self._check_manager(manager)
#
#         second_manager = attrs.get('second_manager')
#         if second_manager is not None:
#             self._check_second_manager(second_manager)
#
#         return super().validate(attrs)
#
#     def update(self, instance: Assessor, validated_data: Dict) -> Assessor:
#         manager = validated_data.get('manager')
#         if manager is not None:
#             instance.manager = manager
#             instance.is_free_resource = False
#             instance.free_resource_weekday_hours = None
#             instance.free_resource_day_off_hours = None
#         else:
#             instance = super().update(instance, validated_data)
#
#         history.updated_assessor_history(
#             old_assessor=self.instance_before_update,
#             updated_assessor=instance,
#             old_projects=set(self.projects_before_update),
#             old_second_managers=set(self.second_managers_before_update)
#         )
#
#         return instance
