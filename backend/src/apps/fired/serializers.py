from rest_framework import serializers

from apps.assessors.models import Assessor, AssessorState
from apps.assessors.serializers import AssessorSerializer
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

    def create(self, validated_data):
        assessor = self.context.get('assessor')
        reason = validated_data.get('reason')
        fired_assessor = remove_assessor(assessor, state=AssessorState.FIRED)
        self.__create(fired_assessor, reason=reason)

        return fired_assessor


class FiredSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = FiredReasonSerializer(read_only=True)

    class Meta:
        model = Fired
        fields = '__all__'


class BlackListAssessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackList
        fields = ['reason']

    @staticmethod
    def __create(assessor: Assessor, reason: str) -> BlackList:
        bl = BlackList.objects.create(assessor=assessor, reason=reason)
        return bl

    def create(self, validated_data):
        assessor = self.context.get('assessor')
        reason = validated_data.get('reason')
        bl_assessor = remove_assessor(assessor, state=AssessorState.BLACKLIST)
        self.__create(bl_assessor, reason=reason)

        return bl_assessor


class BlackListSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = BlackListReasonSerializer(read_only=True)

    class Meta:
        model = BlackList
        fields = '__all__'