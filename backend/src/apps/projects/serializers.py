from copy import copy
from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.assessors.models import Assessor, AssessorState
from apps.history.services.history_service import history
from apps.users.models import BaseUser
from apps.users.serializers import UserSerializer
from core.utils.common import current_date
from core.utils.mixins import GetUserMixin
from core.utils.users import UserStatus
from .services.project_service import project_service
from .models import (
    ProjectTag,
    Project,
    ProjectStatuses,
    ProjectWorkingHours,
    WorkLoadStatus
)


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = '__all__'


class CreateUpdateProjectSerializer(GetUserMixin, serializers.ModelSerializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER),
        many=True
    )

    class Meta:
        model = Project
        fields = '__all__'

    def validate(self, attrs: Dict) -> Dict:
        owners = attrs.get('manager')
        if self.instance is None and owners is None:
            raise ValidationError(
                {'manager': ['Укажите менеджера проекта.']}
            )

        if owners is not None:
            manager = self.get_user()
            for owner in owners:
                if owner.manager_profile.is_teamlead:
                    raise ValidationError(
                        {'manager': [f'Нельзя назначить операционного менеджера '
                                     f'{owner.full_name} на проект.']}
                    )

                if manager.manager_profile.is_teamlead and owner.manager_profile.teamlead != manager:
                    raise ValidationError(
                        {'manager': [f'Менеджер {owner.full_name} не в вашей команде.']}
                    )

                if (not manager.manager_profile.is_teamlead and
                        owner.manager_profile.teamlead != manager.manager_profile.teamlead):
                    raise ValidationError(
                        {'manager': [f'Менеджер {owner.full_name} не в вашей команде.']}
                    )

        date_of_creation = attrs.get('date_of_creation')

        if date_of_creation and current_date() < date_of_creation:
            raise ValidationError(
                {'date_of_creation': 'Дата старта не может быть больше текущей даты.'}
            )

        date_of_completion = attrs.get('date_of_completion')
        if date_of_completion and current_date() < date_of_completion:
            raise ValidationError(
                {'date_of_completion': 'Дата завершения не может быть больше текущей даты.'}
            )
        return super().validate(attrs)

    def create(self, validated_data: Dict) -> Project:
        project_manager = validated_data.pop('manager')
        tag = validated_data.pop('tag', None)
        project = project_service.create_project(**validated_data)
        project = project_service.set_manager(project, project_manager)
        if tag:
            project = project_service.set_tag(instance=project, tag=tag)

        return self._check_if_completed(project)

    def update(self, instance: Project, validated_data: Dict) -> Project:
        project = super().update(instance, validated_data)
        return self._check_if_completed(project)

    def _check_if_completed(self, project: Project) -> Project:
        if project_service.is_completed(project):
            project = project_service.set_completion_date(
                instance=project,
                date=self.validated_data.get('date_of_completion')
            )
            self._remove_assessors_from_completed_project(project)
            project_service.remove_related(project)
        else:
            project = project_service.set_completion_date(
                instance=project,
                set_null=True
            )

        return project

    def _remove_assessors_from_completed_project(self, project: Project) -> None:
        managers = project.manager.all()
        assessors = project.assessors.all()
        if assessors:
            for instance in assessors:
                instance_before_update = copy(instance)
                projects_before_update = [pr.pk for pr in instance.projects.all()]
                instance.projects.remove(project)
                for manager in managers:
                    if (not instance.projects.filter(manager__in=[manager]).exists()
                            and manager in instance.second_manager.all()):
                        instance.second_manager.remove(manager)

                history.updated_assessor_history(
                    old_assessor=instance_before_update,
                    new_assessor=instance,
                    user=self.get_user().full_name,
                    old_projects=projects_before_update,
                    completed_project=True
                )


class ProjectSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True, many=True)
    assessors_count = serializers.SerializerMethodField(read_only=True)
    tag = ProjectTagSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_assessors_count(self, obj: Project) -> int:
        return obj.assessors.count()


class ProjectSimpleSerializer(serializers.ModelSerializer):
    manager = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'manager']


class CreateProjectWorkingHoursSerializer(GetUserMixin, serializers.ModelSerializer):
    assessor = serializers.PrimaryKeyRelatedField(
        queryset=Assessor.objects.filter(state__in=AssessorState.work_states())
    )
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.exclude(status=ProjectStatuses.COMPLETED)
    )

    class Meta:
        model = ProjectWorkingHours
        fields = '__all__'

    def validate(self, attrs: Dict) -> Dict:
        manager = self.get_user()
        assessor = attrs.get('assessor')
        project = attrs.get('project')
        self._check_assessor_permission(manager, assessor)
        self._check_project_permission(assessor, project)
        return super().validate(attrs)

    @staticmethod
    def _check_assessor_permission(manager: BaseUser, assessor: Assessor) -> None:
        if (assessor.manager.pk != manager.pk
                and assessor.manager.manager_profile.teamlead.pk != manager.pk
                and manager.pk not in assessor.second_manager.values_list('pk', flat=True)):
            raise ValidationError(
                {'assessor': ['Вы не можете выбрать данного исполнителя.']}
            )

    @staticmethod
    def _check_project_permission(assessor: Assessor, project: Project) -> None:
        if project not in assessor.projects.all():
            raise ValidationError(
                {'project': ['На текущий момент исполнитель не работает над данным проектом.']}
            )


class UpdateProjectWorkingHoursSerializer(GetUserMixin, serializers.ModelSerializer):
    class Meta:
        model = ProjectWorkingHours
        exclude = ['assessor', 'project']


class ProjectWorkingHoursSerializer(GetUserMixin, serializers.ModelSerializer):
    project = ProjectSimpleSerializer(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProjectWorkingHours
        fields = '__all__'

    def get_total(self, obj: ProjectWorkingHours) -> int:
        return obj.total


class ProjectWorkingHoursSimpleSerializer(ProjectWorkingHoursSerializer):
    class Meta:
        model = ProjectWorkingHours
        exclude = ['assessor']


class CreateWorkLoadStatusSerializer(CreateProjectWorkingHoursSerializer):
    class Meta:
        model = WorkLoadStatus
        fields = '__all__'


class UpdateWorkLoadStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkLoadStatus
        exclude = ['assessor', 'project']


class WorkLoadStatusSerializer(serializers.ModelSerializer):
    project = ProjectSimpleSerializer(read_only=True)

    class Meta:
        model = WorkLoadStatus
        fields = '__all__'


class ExportProjectsSerializer(serializers.Serializer):
    task_id = serializers.CharField(required=False, max_length=255)


class DownloadStatusSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=50, required=False)
    filename = serializers.CharField(max_length=50, allow_null=True, required=False)
