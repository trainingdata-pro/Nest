from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.utils.common import current_date
from users.serializers import ManagerSerializer
from .models import Project


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {'manager': {'required': False}}

    def get_manager(self):
        return self.context.get('request').user.manager

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
        return project


class ProjectSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True, many=True)
    assessors_count = serializers.SerializerMethodField(read_only=True)
    backlog = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_assessors_count(self, obj) -> int:
        return obj.assessors.count()

    def get_backlog(self, obj) -> str:
        return 'Тут пока не понятно, что это за поле, поэтому просто заглушка'


class SimpleProjectSerializer(serializers.ModelSerializer):
    assessors_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        exclude = ('manager',)

    def get_assessors_count(self, obj) -> int:
        return obj.assessors.count()
