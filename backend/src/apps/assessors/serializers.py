from typing import List

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.users.models import Manager
from apps.users.serializers import ManagerSerializer
from apps.projects.serializers import ProjectSerializer
from .models import (Assessor,
                     AssessorStatus,
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
            'state',
            'date_of_registration',
        )

    def get_manager(self):
        return self.context.get('request').user.manager

    def validate(self, attrs):
        current_manager = self.get_manager()
        manager = attrs.get('manager')
        if manager is not None:
            if manager.is_operational_manager:
                raise ValidationError(
                    {'manager': ['Операционный менеджер не может быть ответственным менеджером '
                                 'исполнителя.']}
                )
            else:
                if current_manager.is_operational_manager and manager.operational_manager != current_manager:
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

    @staticmethod
    def _create_assessor_without_team(instance: Assessor) -> Assessor:
        instance.is_free_resource = True
        instance.free_resource_weekday_hours = None
        instance.free_resource_day_off_hours = None
        instance.status = AssessorStatus.FREE

        return instance

    def create(self, validated_data):
        skills = validated_data.pop('skills', None)
        projects = validated_data.pop('projects', None)
        assessor = Assessor(**validated_data)
        if assessor.manager is None:
            assessor = self._create_assessor_without_team(assessor)

        assessor.save()

        if skills is not None:
            assessor.skills.set(skills)
            assessor.save()

        if projects is not None and assessor.manager is not None:
            assessor.projects.set(projects)
            assessor.save()

        return assessor

    def update(self, instance, validated_data):
        validated_data = self._update_if_free_resource(validated_data, instance)
        assessor = super().update(instance, validated_data)
        if assessor.manager is None:
            assessor = self._create_assessor_without_team(assessor)
            assessor.save()

        return assessor


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


class AssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    projects = ProjectSerializer(read_only=True, many=True)
    skills = SkillSerializer(read_only=True, many=True)
    second_manager = ManagerSerializer(read_only=True, many=True)
    working_hours = SimpleWorkingHoursSerializer(read_only=True, source='workinghours')

    class Meta:
        model = Assessor
        fields = '__all__'


class CheckAssessorSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    projects = ProjectSerializer(read_only=True, many=True)

    class Meta:
        model = Assessor
        fields = (
            'pk',
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'manager',
            'projects',
            'is_free_resource',
            'state'
        )


class CreateUpdateWorkingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHours
        fields = '__all__'

    def validate_assessor(self, assessor):
        manager = self.context.get('request').user.manager
        if assessor.manager != manager and assessor.manager.operational_manager != manager:
            raise ValidationError('Вы не можете выбрать данного исполнителя.')

        return assessor


class UpdateFreeResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessor
        fields = ['second_manager', 'manager']

    def get_manager(self):
        return self.context.get('request').user.manager

    @staticmethod
    def _second_manager_validation_error(message: str):
        raise ValidationError(
            {'second_manager': [message]}
        )

    @staticmethod
    def _manager_validation_error(message: str):
        raise ValidationError(
            {'manager': [message]}
        )

    def _check_second_manager(self, second_managers: List[Manager]) -> None:
        current_manager = self.get_manager()
        for manager in second_managers:
            if self.instance.manager is None:
                self._second_manager_validation_error(f'Исполнитель {self.instance.full_name} находится '
                                                      f'без команды и ему не могут быть назначены доп. '
                                                      f'менеджеры.')
            elif manager.is_operational_manager:
                self._second_manager_validation_error(f'Операционный менеджер {manager.full_name} не может '
                                                      'быть менеджером свободного ресурса.')
            elif current_manager.is_operational_manager and manager.operational_manager != current_manager:
                self._second_manager_validation_error(f'Менеджер {manager.full_name} не из вашей команды.')
            elif self.instance.manager == manager:
                self._second_manager_validation_error('Вы не можете быть дополнительным менеджером '
                                                      'своего исполнителя.')

    def _check_manager(self, new_manager: Manager = None) -> None:
        current_manager = self.get_manager()
        if self.instance.manager and new_manager is not None:
            self._manager_validation_error(f'У исполнителя {self.instance.full_name} уже есть основной '
                                           f'менеджер. Вы можете выбрать его только в качестве свободного '
                                           f'ресурса.')
        elif self.instance.manager is None:
            if new_manager.is_operational_manager:
                self._manager_validation_error('Вы не можете быть менеджером исполнителя. Выберите менеджера '
                                               'из вашей команды.')
            elif current_manager.is_operational_manager and new_manager.operational_manager != current_manager:
                self._manager_validation_error('Выберите менеджера из вашей команды.')

    def validate(self, attrs):
        if self.instance.is_free_resource is False:
            self._second_manager_validation_error('Исполнитель не является свободным ресурсом.')

        manager = attrs.get('manager')
        if manager is not None:
            self._check_manager(manager)

        second_manager = attrs.get('second_manager')
        if second_manager is not None:
            self._check_second_manager(second_manager)

        return super().validate(attrs)

    def update(self, instance, validated_data):
        manager = validated_data.get('manager')
        if manager is not None:
            instance.manager = manager
            instance.is_free_resource = False
            instance.free_resource_weekday_hours = None
            instance.free_resource_day_off_hours = None
            instance.save()
            return instance
        else:
            return super().update(instance, validated_data)
