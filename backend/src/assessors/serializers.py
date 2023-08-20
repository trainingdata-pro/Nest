from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from users.serializers import ManagerSerializer

# from blacklist.models import BlackListItem
from projects.serializers import ProjectSerializer
from .models import (Assessor,
                     Skill,
                     WorkingHours)
from .utils import check_project_permission


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CreateUpdateAssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessor
        exclude = (
            'second_manager',
            'date_of_registration',
            'blacklist'
        )
        extra_kwargs = {'manager': {'required': False}}

    def get_manager(self):
        return self.context.get('request').user.manager

    def validate(self, attrs):
        current_manager = self.get_manager()

        if current_manager.is_operational_manager:
            manager = attrs.get('manager')
            if manager is None and self.instance is None:
                raise ValidationError(
                    {'manager': ['Выберите ответственного менеджера.']}
                )

            if manager and manager.operational_manager.pk != current_manager.pk:
                raise ValidationError(
                    {'manager': [f'Менеджер {manager.full_name} не в вашей команде.']}
                )

        projects = attrs.get('projects')
        if projects:
            check_project_permission(projects, current_manager)

        is_free_resource = attrs.get('is_free_resource')
        if is_free_resource is True:
            free_resource_weekday_hours = attrs.get('free_resource_weekday_hours')
            if free_resource_weekday_hours is None:
                raise ValidationError(
                    {'free_resource_weekday_hours': ['Укажите время работы в рабочие дни.']}
                )
            free_resource_day_off_hours = attrs.get('free_resource_day_off_hours')
            if free_resource_day_off_hours is None:
                raise ValidationError(
                    {'free_resource_day_off_hours': ['Укажите время работы в выходные дни.']}
                )

        return super().validate(attrs)

    @staticmethod
    def _update_if_free_resource(validated_data, instance=None):
        if validated_data.get('is_free_resource') is False:
            if instance is not None and instance.second_manager.exists():
                raise ValidationError(
                    {'is_free_resource': ['Нельзя удалить исполнителя из свободных ресурсов, '
                                          'т.к. он работает у других менеджеров.']}
                )
            validated_data['free_resource_weekday_hours'] = None
            validated_data['free_resource_day_off_hours'] = None

        return validated_data

    def create(self, validated_data):
        manager = self.get_manager()
        validated_data = self._update_if_free_resource(validated_data)
        skills = validated_data.pop('skills', None)
        if manager.is_operational_manager:
            assessor = Assessor.objects.create(**validated_data)
        else:
            assessor = Assessor.objects.create(manager=manager, **validated_data)

        if skills is not None:
            assessor.skills.set(skills)
            assessor.save()

        return assessor

    def update(self, instance, validated_data):
        validated_data = self._update_if_free_resource(validated_data, instance)
        return super().update(instance, validated_data)


class SimpleAssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)

    class Meta:
        model = Assessor
        exclude = ('projects', 'skills', 'second_manager')


class WorkingHoursSerializer(serializers.ModelSerializer):
    assessor = SimpleAssessorSerializer(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = WorkingHours
        fields = '__all__'

    def get_total(self, obj) -> int:
        return obj.total


class SimpleWorkingHoursSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = WorkingHours
        exclude = ['assessor']

    def get_total(self, obj) -> int:
        return obj.total


# class CreateUpdateFreeResourceSerializer(serializers.ModelSerializer):
#     def get_manager(self):
#         return self.context.get('request').user.manager
#
#     class Meta:
#         model = FreeResourceSchedule
#         fields = '__all__'
#
#     def validate_assessor(self, assessor: Assessor):
#         manager = self.get_manager()
#         if assessor.manager != manager and assessor.manager.operational_manager != manager:
#             raise ValidationError('Вы не можете выбрать данного исполнителя.')
#
#         return assessor
#
#     def create(self, validated_data):
#         assessor = validated_data.get('assessor')
#         if assessor.is_free_resource:
#             raise ValidationError('Данный исполнитель уже находится в свободных ресурсах.')
#
#         obj = super().create(validated_data)
#         assessor.is_free_resource = True
#         assessor.save()
#
#         return obj


# class FreeResourceScheduleSimpleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FreeResourceSchedule
#         exclude = ['assessor']
#
#
# class FreeResourceScheduleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FreeResourceSchedule
#         fields = '__all__'


class AssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    projects = ProjectSerializer(read_only=True, many=True)
    skills = SkillSerializer(read_only=True, many=True)
    second_manager = ManagerSerializer(read_only=True, many=True)
    working_hours = SimpleWorkingHoursSerializer(read_only=True, source='workinghours')
    # free_resource_schedule = FreeResourceScheduleSimpleSerializer(read_only=True, source='freeresourceschedule')

    class Meta:
        model = Assessor
        fields = '__all__'


class CheckAssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)

    class Meta:
        model = Assessor
        fields = ('pk', 'username', 'manager')


class CreateUpdateWorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = '__all__'

    def validate_assessor(self, assessor):
        manager = self.context.get('request').user.manager
        if assessor.manager != manager and assessor.manager.operational_manager != manager:
            raise ValidationError('Вы не можете выбрать данного исполнителя.')

        return assessor


# class TakeFreeResourceSerializer(serializers.Serializer):
#     def validate_assessor(self):
#         assessor = self.instance
#         if not assessor.is_free_resource or assessor.max_count_of_second_managers == assessor.second_manager.count():
#             raise ValidationError(
#                 {'detail': ['Данный исполнитель больше недоступен как свободный ресурс.']}
#             )
#
#         manager = self.context.get('request').user.manager
#         if assessor.manager == manager:
#             raise ValidationError(
#                 {'detail': ['Вы не можете быть доп. менеджером данного исполнителя.']}
#             )
#         return assessor
#
#     def update(self, instance, validated_data):
#         manager = self.context.get('request').user.manager
#         instance = self.validate_assessor()
#         instance.second_manager.add(manager)
#         instance.save()
#
#         return instance
#
#
# class CancelFreeResourceSerializer(serializers.Serializer):
#     def validate_assessor(self, assessor_pk):
#         assessor = self.instance
#         manager = self.context.get('request').user.manager
#         if manager not in assessor.second_manager.all():
#             raise ValidationError(
#                 {'detail': ['Невозможно выполнить данный запрос.']}
#             )
#         return assessor_pk
#
#     @staticmethod
#     def remove_projects(assessor, manager):
#         projects = assessor.projects.filter(owner=manager)
#         if projects:
#             assessor.projects.remove(*projects)
#
#         if assessor.projects.exists():
#             assessor.is_busy = True
#         else:
#             assessor.is_busy = False
#
#         return assessor
#
#     def update(self, instance, validated_data):
#         manager = self.context.get('request').user.manager
#         instance = self.remove_projects(instance, manager)
#         instance.second_manager.remove(manager)
#         instance.save()
#
#         return instance
#
#
# class AddToTeamSerializer(serializers.Serializer):
#     @staticmethod
#     def add_to_team(instance, manager):
#         if instance.manager:
#             raise ValidationError(
#                 {'detail': ['Данный исполнитель больше недоступен как свободный ресурс.']}
#             )
#
#         instance.manager = manager
#         instance.is_free_resource = False
#         instance.max_count_of_second_managers = None
#
#         return instance
#
#     def update(self, instance, validated_data):
#         manager = self.context.get('request').user.manager
#         instance = self.add_to_team(instance, manager)
#         instance.save()
#
#         return instance


class RemoveAssessorSerializer(serializers.Serializer):
    blacklist = serializers.BooleanField(required=False)
    reason = serializers.CharField(max_length=255, required=False)

    @staticmethod
    def check_before_removing(instance):
        if instance.second_manager.exists():
            raise ValidationError(
                {'detail': [f'Исполнитель {instance.full_name} на текущий момент '
                            f'работает над проектами других менеджеров.']}
            )
        return instance

    @staticmethod
    def create_blacklist_item(instance, reason):
        pass
        # item_exists = BlackListItem.objects.filter(assessor=instance)
        # if item_exists:
        #     item_exists.delete()
        #
        # last_project = ', '.join(instance.projects.all().values_list('name', flat=True))
        # item = BlackListItem(
        #     assessor=instance,
        #     last_manager=instance.manager.full_name,
        #     last_project=last_project,
        #     reason=reason
        # )
        # item.save()
        #
        # return item

    def add_to_black_list(self, instance, reason):
        pass
        # if reason is None:
        #     raise ValidationError(
        #         {'reason': ['Укажите причину добавления в черный список.']}
        #     )
        #
        # self.create_blacklist_item(instance, reason)
        # instance.blacklist = True
        # instance.manager = None
        # instance.is_free_resource = False
        # instance.max_count_of_second_managers = None
        # instance.second_manager.clear()
        # instance.projects.clear()
        # instance.is_busy = False
        #
        # return instance

    @staticmethod
    def remove_from_team(instance):
        instance.manager = None
        instance.is_free_resource = True
        instance.max_count_of_second_managers = 1
        instance.second_manager.clear()
        instance.projects.clear()
        instance.is_busy = False

        return instance

    def update(self, instance, validated_data):
        pass
        # instance = self.check_before_removing(instance)
        # blacklist = validated_data.get('blacklist')
        # if blacklist is not None:
        #     instance = self.add_to_black_list(
        #         instance,
        #         reason=validated_data.get('reason')
        #     )
        # else:
        #     instance = self.remove_from_team(instance)
        #
        # instance.save()
        # return instance
