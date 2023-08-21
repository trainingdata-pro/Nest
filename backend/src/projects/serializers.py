from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.utils.common import current_date
from users.serializers import ManagerSerializer
from .models import ProjectTag, Project, ProjectStatuses


class ProjectTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTag
        fields = '__all__'


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {'manager': {'required': False}}

    def get_manager(self):
        return self.context.get('request').user.manager

    def _check_if_completed(self, obj):
        date_of_completion = self.validated_data.get('date_of_completion')
        if obj.status == ProjectStatuses.COMPLETED:
            if date_of_completion is None and obj.date_of_completion is None:
                obj.date_of_completion = current_date()
        else:
            obj.date_of_completion = None

        obj.save()
        return obj

    def validate(self, attrs):
        manager = self.get_manager()
        if manager.is_operational_manager:
            owners = attrs.get('manager')
            if not owners:
                raise ValidationError(
                    {'manager': ['Укажите менеджера проекта.']}
                )
            else:
                for owner in owners:
                    if owner.is_operational_manager:
                        raise ValidationError(
                            {'manager': [f'Нельзя назначить операционного менеджера '
                                         f'{owner.full_name} на проект.']}
                        )

                    elif owner.operational_manager and owner.operational_manager.pk != manager.pk:
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

    def create(self, validated_data) -> Project:
        current_manager = self.get_manager()
        project_manager = validated_data.pop('manager', None)
        if current_manager.is_operational_manager:
            project = Project.objects.create(**validated_data)
            project.manager.set(project_manager)

        else:
            project = Project.objects.create(**validated_data)
            project.manager.set([current_manager])

        project.save()
        project = self._check_if_completed(project)

        return project

    def update(self, instance, validated_data):
        project = super().update(instance, validated_data)
        project = self._check_if_completed(project)

        return project


class ProjectSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True, many=True)
    assessors_count = serializers.SerializerMethodField(read_only=True)
    backlog = serializers.SerializerMethodField(read_only=True)
    tag = ProjectTagSerializer(read_only=True, many=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_assessors_count(self, obj) -> int:
        return obj.assessors.count()

    def get_backlog(self, obj) -> str:
        return 'Тут пока не понятно, что это за поле, поэтому просто заглушка'

# class SimpleProjectSerializer(serializers.ModelSerializer):
#     assessors_count = serializers.SerializerMethodField(read_only=True)
#     tag = ProjectTagSerializer(read_only=True, many=True)
#
#     class Meta:
#         model = Project
#         exclude = ('manager',)
#
#     def get_assessors_count(self, obj) -> int:
#         return obj.assessors.count()
