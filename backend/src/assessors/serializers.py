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
        if projects:
            instance.projects.add(*projects)
            instance.is_busy = True
            instance.save()

        return instance


class RemoveAssessorProjectSerializer(serializers.ModelSerializer):
    all = serializers.BooleanField(default=False)

    class Meta:
        model = Assessor
        fields = ('all', 'projects')

    def get_projects_to_remove(self, projects):
        manager = self.context.get('request').user.manager
        return [pr for pr in projects if pr.owner == manager]

    def update(self, instance, validated_data):
        remove_all = validated_data.get('all')
        manager = self.context.get('request').user.manager
        if remove_all:
            projects = instance.projects.filter(owner=manager)
            instance.projects.remove(*projects)
        else:
            projects = validated_data.get('projects')
            to_remove = self.get_projects_to_remove(projects)
            instance.projects.remove(*to_remove)

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


class CheckAsFreeResourceSerializer(serializers.Serializer):
    annotators = serializers.ListSerializer(child=serializers.IntegerField(), min_length=1)
    max_count_of_second_managers = serializers.IntegerField(min_value=1)

    def save(self, **kwargs):
        manager = self.context.get('request').user.manager
        pk = self.validated_data.get('annotators')
        assessors = Assessor.objects.filter(pk__in=pk, manager=manager)
        if not assessors:
            raise ValidationError(
                {'assessors': 'Передайте список ваших исполнителей.'}
            )

        max_count_of_second_managers = self.validated_data.get('max_count_of_second_managers')
        assessors.update(is_free_resource=True,
                         max_count_of_second_managers=max_count_of_second_managers)

        return assessors


class UncheckAsFreeResourceSerializer(serializers.Serializer):
    annotators = serializers.ListSerializer(child=serializers.IntegerField(), min_length=1)

    @staticmethod
    def check_projects(assessors):
        for user in assessors:
            if user.second_manager.exists():
                raise ValidationError(
                    {'assessors': f'Исполнитель {user.full_name} на текущий момент '
                                  f'работает над проектами других менеджеров.'}
                )

    def save(self, **kwargs):
        manager = self.context.get('request').user.manager
        pk = self.validated_data.get('annotators')
        assessors = Assessor.objects.filter(
            pk__in=pk,
            manager=manager,
            is_free_resource=True
        )
        if not assessors:
            raise ValidationError(
                {'assessors': 'Передайте список ваших исполнителей, '
                              'которые являются свободными ресурсами.'}
            )
        self.check_projects(assessors)
        to_response = [obj.pk for obj in assessors]
        assessors.update(is_free_resource=False, max_count_of_second_managers=None)

        return Assessor.objects.filter(pk__in=to_response)


class TakeFreeResourceSerializer(serializers.Serializer):
    def validate_assessor(self):
        assessor = self.instance
        if not assessor.is_free_resource or assessor.max_count_of_second_managers == assessor.second_manager.count():
            raise ValidationError(
                {'detail': ['Данный исполнитель больше недоступен как свободный ресурс.']}
            )

        manager = self.context.get('request').user.manager
        if assessor.manager == manager:
            raise ValidationError(
                {'detail': ['Вы не можете быть доп. менеджером данного исполнителя.']}
            )
        return assessor

    def update(self, instance, validated_data):
        manager = self.context.get('request').user.manager
        instance = self.validate_assessor()
        instance.second_manager.add(manager)
        instance.save()

        return instance


class PutAwayFreeResourceSerializer(serializers.Serializer):
    def validate_assessor(self, assessor_pk):
        assessor = self.instance
        manager = self.context.get('request').user.manager
        if manager not in assessor.second_manager.all():
            raise ValidationError(
                'Невозможно выполнить данный запрос.'
            )
        return assessor_pk

    @staticmethod
    def remove_projects(assessor, manager):
        projects = assessor.projects.filter(owner=manager)
        if projects:
            assessor.projects.remove(*projects)

        if assessor.projects.exists():
            assessor.is_busy = True
        else:
            assessor.is_busy = False

        return assessor

    def update(self, instance, validated_data):
        manager = self.context.get('request').user.manager
        instance = self.remove_projects(instance, manager)
        instance.second_manager.remove(manager)
        instance.save()

        return instance
