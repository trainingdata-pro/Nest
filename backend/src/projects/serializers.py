from rest_framework import serializers

from users.serializers import ManagerSerializer
from .models import Project


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('name',)

    def create(self, validated_data) -> Project:
        manager = self.context.get('request').user.manager
        project = Project.objects.create(owner=manager, **validated_data)

        return project


class ProjectSerializer(serializers.ModelSerializer):
    owner = ManagerSerializer(read_only=True)
    assessors_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'

    def get_assessors_count(self, obj) -> int:
        return obj.assessors.count()


class SimpleProjectSerializer(serializers.ModelSerializer):
    assessors_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        exclude = ('owner',)

    def get_assessors_count(self, obj) -> int:
        return obj.assessors.count()
