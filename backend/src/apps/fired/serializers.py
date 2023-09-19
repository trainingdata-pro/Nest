import datetime
from typing import Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.history.utils import history
from apps.assessors.models import Assessor, AssessorState
from apps.assessors.serializers import AssessorSerializer
from apps.users.models import BaseUser
from core.utils.common import current_date, str_date
from core.utils.mixins import GetUserMixin
from core.utils.users import UserStatus
from .models import Reason, Fired, BlackList


class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason
        fields = '__all__'


class FireAssessorSerializer(serializers.Serializer):
    date = serializers.DateField(required=False)
    reason = serializers.PrimaryKeyRelatedField(
        queryset=Reason.objects.all(),
        required=True
    )

    @staticmethod
    def _error(error: str) -> None:
        raise ValidationError(
            {'detail': [error]}
        )

    def validate(self, attrs: Dict) -> Dict:
        assessor = self.instance
        if assessor.projects.exists():
            self._error('У исполнителя есть активные проекты.')
        if assessor.state == AssessorState.FREE_RESOURCE:
            self._error('Исполнитель находится в свободных ресурсах.')
        if assessor.state == AssessorState.FIRED:
            self._error('Исполнитель уволен.')
        if assessor.state == AssessorState.BLACKLIST:
            self._error('Исполнитель в черном списке.')
        if assessor.state == AssessorState.VACATION:
            self._error('Исполнитель в отпуске.')
        if assessor.manager is None:
            self._error('У исполнителя нет руководителя.')

        reason = attrs.get('reason')
        if reason is None:
            raise ValidationError(
                {'reason': ['Это обязательное поле.']}
            )

        date = attrs.get('date')
        if date is not None:
            now = current_date()
            if date <= now:
                raise ValidationError(
                    {'date': ['Дата должна быть больше текущей.']}
                )

        return super().validate(attrs)

    @staticmethod
    def _fire(assessor: Assessor, reason: Reason) -> Fired:
        assessor.state = AssessorState.FIRED
        fired = Fired.objects.create(assessor=assessor, reason=reason)
        return fired

    @staticmethod
    def _blacklist(assessor: Assessor, reason: Reason) -> BlackList:
        assessor.state = AssessorState.BLACKLIST
        blacklist = BlackList.objects.create(assessor=assessor, reason=reason)
        return blacklist

    def _create(self, assessor: Assessor, reason: Reason, date: datetime.date = None) -> Assessor:
        to_blacklist = False
        if reason.blacklist_reason:
            to_blacklist = True
            item = self._blacklist(assessor, reason)
        else:
            item = self._fire(assessor, reason)

        if date is not None:
            date = str_date(date)

        history.fired_assessor_history(
            assessor=assessor,
            manager=assessor.manager,
            fired_item=item,
            blacklist=to_blacklist,
            date_to_return=date
        )

        assessor.manager = None
        assessor.status = None
        assessor.save()
        return assessor

    def save(self, **kwargs) -> Assessor:
        instance = self._create(
            assessor=self.instance,
            reason=self.validated_data.get('reason'),
            date=self.validated_data.get('date')
        )
        return instance


class FiredSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = ReasonSerializer(read_only=True)

    class Meta:
        model = Fired
        fields = '__all__'


class BackToTeamSerializer(GetUserMixin, serializers.Serializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER)
    )

    def validate(self, attrs: Dict) -> Dict:
        current_manager = self.get_user()
        manager = attrs.get('manager')
        if manager is None:
            if current_manager.manager_profile.is_teamlead:
                raise ValidationError(
                    {'manager': ['Выберите ответственного менеджера.']}
                )
        else:
            if manager.manager_profile.is_teamlead:
                raise ValidationError(
                    {'manager': ['Операционный менеджер не может быть '
                                 'ответственным менеджером исполнителя.']}
                )

            if (current_manager.manager_profile.is_teamlead
                    and manager.manager_profile.teamlead.pk != current_manager.pk):
                raise ValidationError(
                    {'manager': [f'Менеджер {manager.full_name} не в вашей команде.']}
                )

        return super().validate(attrs)

    def update(self, instance: Fired, validated_data: Dict) -> Assessor:
        assessor = instance.assessor
        manager = validated_data.get('manager')
        if manager is None:
            manager = self.get_user()
        assessor.manager = manager
        assessor.state = AssessorState.AVAILABLE
        assessor.save()
        instance.delete()

        history.returned_history(
            assessor=assessor,
            manager=manager
        )

        return assessor


class BlackListSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = ReasonSerializer(read_only=True)

    class Meta:
        model = BlackList
        fields = '__all__'
