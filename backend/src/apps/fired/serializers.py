from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.history.utils import history
from apps.assessors.models import Assessor, AssessorState
from apps.assessors.serializers import AssessorSerializer
from apps.users.models import Manager
from .models import FiredReason, BlackListReason, Fired, BlackList
from .utils import remove_assessor


class FiredReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiredReason
        fields = '__all__'


class BlackListReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackListReason
        fields = '__all__'


class FireAssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fired
        fields = ['reason']

    @staticmethod
    def __create(assessor: Assessor, reason: str) -> Fired:
        fired = Fired.objects.create(assessor=assessor, reason=reason)
        return fired

    def create(self, validated_data: Dict):
        assessor = self.context.get('assessor')
        manager = assessor.manager
        reason = validated_data.get('reason')
        fired_assessor = remove_assessor(assessor, state=AssessorState.FIRED)
        fired_item = self.__create(fired_assessor, reason=reason)

        history.fired_assessor_history(
            assessor=fired_assessor,
            manager=manager,
            fired_item=fired_item
        )

        return fired_assessor


class FiredSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = FiredReasonSerializer(read_only=True)

    class Meta:
        model = Fired
        fields = '__all__'


class BackToTeamSerializer(serializers.Serializer):
    manager = serializers.PrimaryKeyRelatedField(queryset=Manager.objects.all())

    def get_manager(self) -> Manager:
        return self.context.get('request').user.manager

    def validate(self, attrs: Dict) -> Dict:
        current_manager = self.get_manager()
        manager = attrs.get('manager')
        if manager is None:
            if current_manager.is_operational_manager:
                raise ValidationError(
                    {'manager': ['Выберите ответственного менеджера.']}
                )
        else:
            if manager.is_operational_manager:
                raise ValidationError(
                    {'manager': ['Операционный менеджер не может быть '
                                 'ответственным менеджером исполнителя.']}
                )

            if current_manager.is_operational_manager and manager.operational_manager != current_manager:
                raise ValidationError(
                    {'manager': [f'Менеджер {manager.full_name} не в вашей команде.']}
                )

        return super().validate(attrs)

    def update(self, instance: Fired, validated_data: Dict) -> Assessor:
        assessor = instance.assessor
        manager = validated_data.get('manager')
        if manager is None:
            manager = self.get_manager()
        assessor.manager = manager
        assessor.state = AssessorState.WORK
        assessor.save()
        instance.delete()

        history.returned_history(
            assessor=assessor,
            manager=manager
        )

        return assessor


class BlackListAssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackList
        fields = ['reason']

    @staticmethod
    def __create(assessor: Assessor, reason: str) -> BlackList:
        bl = BlackList.objects.create(assessor=assessor, reason=reason)
        return bl

    def create(self, validated_data: Dict):
        assessor = self.context.get('assessor')
        manager = assessor.manager
        reason = validated_data.get('reason')
        bl_assessor = remove_assessor(assessor, state=AssessorState.BLACKLIST)
        fired_item = self.__create(bl_assessor, reason=reason)

        history.fired_assessor_history(
            assessor=bl_assessor,
            manager=manager,
            fired_item=fired_item,
            blacklist=True
        )

        return bl_assessor


class BlackListSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = BlackListReasonSerializer(read_only=True)

    class Meta:
        model = BlackList
        fields = '__all__'
