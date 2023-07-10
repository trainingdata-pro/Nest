from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from users.serializers import ManagerSerializer

from projects.serializers import SimpleProjectSerializer
from .models import Assessor


class CreateAssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessor
        exclude = ('manager', 'is_busy', 'date_of_registration', 'projects')

    def create(self, validated_data):
        manager = self.context.get('request').user.manager
        validated_data['manager'] = manager

        return super().create(validated_data)


class AddAssessorProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessor
        fields = ('projects',)

    def validate_projects(self, projects):
        manager_pk = self.context.get('request').user.manager.pk
        for pr in projects:
            if pr.owner.pk != manager_pk:
                raise ValidationError(
                    f'У вас нет прав, чтобы выбрать проект "{pr.name}". '
                    f'Проект создан другим менеджером.'
                )

        return projects

    def update(self, instance, validated_data):
        projects = validated_data.get('projects')
        instance.projects.add(*projects)
        instance.is_busy = True
        instance.save()

        return instance


class RemoveAssessorProjectSerializer(serializers.ModelSerializer):
    all = serializers.BooleanField(default=False)

    class Meta:
        model = Assessor
        fields = ('all', 'projects')

    def update(self, instance, validated_data):
        remove_all = validated_data.get('all')
        if remove_all:
            instance.projects.clear()
            instance.is_busy = False
            instance.save()

        else:
            projects = validated_data.get('projects')
            if projects:
                instance.projects.remove(*projects)
                if instance.projects.exists():
                    instance.is_busy = True
                else:
                    instance.is_busy = False

                instance.save()

        return instance


class AssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    projects = SimpleProjectSerializer(read_only=True, many=True)

    class Meta:
        model = Assessor
        fields = '__all__'


class CheckAssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)

    class Meta:
        model = Assessor
        fields = ('pk', 'username', 'manager')
