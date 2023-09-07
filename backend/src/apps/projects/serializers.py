from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.users.serializers import ManagerSerializer
from apps.users.models import Manager
from core.utils.common import current_date
from .models import ProjectTag, Project, ProjectStatuses


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = '__all__'


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def get_manager(self) -> Manager:
        return self.context.get('request').user.manager

    def _check_if_completed(self, project: Project) -> Project:
        date_of_completion = self.validated_data.get('date_of_completion')
        if project.status == ProjectStatuses.COMPLETED:
            if date_of_completion is None and project.date_of_completion is None:
                project.date_of_completion = current_date()
        else:
            project.date_of_completion = None

        project.save()
        return project

    def validate(self, attrs: Dict) -> Dict:
        asana_id = attrs.get('asana_id')
        if asana_id is None:
            raise ValidationError(
                {'asana_id': ['Это обязательное поле']}
            )
        owners = attrs.get('manager')
        if owners is None:
            raise ValidationError(
                {'manager': ['Укажите менеджера проекта.']}
            )

        manager = self.get_manager()
        for owner in owners:
            if owner.is_operational_manager:
                raise ValidationError(
                    {'manager': [f'Нельзя назначить операционного менеджера '
                                 f'{owner.full_name} на проект.']}
                )

            if manager.is_operational_manager and owner.operational_manager != manager:
                raise ValidationError(
                    {'manager': [f'Менеджер {owner.full_name} не в вашей команде.']}
                )

            if not manager.is_operational_manager and owner.operational_manager != manager.operational_manager:
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
        project = Project.objects.create(**validated_data)
        project.manager.set(project_manager)

        if tag:
            project.tag.set(tag)

        project = self._check_if_completed(project)

        return project

    def update(self, instance: Project, validated_data: Dict) -> Project:
        project = super().update(instance, validated_data)
        project = self._check_if_completed(project)

        return project


class ProjectSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True, many=True)
    assessors_count = serializers.SerializerMethodField(read_only=True)
    tag = ProjectTagSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_assessors_count(self, obj: Project) -> int:
        return obj.assessors.count()
