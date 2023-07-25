from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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
            owner = attrs.get('manager')
            if owner is None:
                raise ValidationError(
                    {'manager': ['Укажите менеджера проекта.']}
                )
            else:
                if owner.operational_manager.pk != manager.pk:
                    raise ValidationError(
                        {'manager': [f'Менеджер {owner.full_name} не в вашей команде.']}
                    )

        return super().validate(attrs)

    def create(self, validated_data) -> Project:
        manager = self.get_manager()
        if manager.is_operational_manager:
            project = Project.objects.create(**validated_data)
        else:
            project = Project.objects.create(manager=manager, **validated_data)

        return project


class ProjectSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
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
