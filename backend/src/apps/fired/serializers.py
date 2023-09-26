import datetime
from copy import copy
from typing import Dict, Optional

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.history.services import history
from apps.assessors.models import Assessor, AssessorState
from apps.assessors.serializers import AssessorSerializer
from apps.users.models import BaseUser
from core.utils.common import current_date
from core.utils.mixins import GetUserMixin
from core.utils.users import UserStatus
from .models import Reason, Fired, BlackList


class ReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reason
        fields = '__all__'


class FireAssessorSerializer(GetUserMixin, serializers.Serializer):
    date = serializers.DateField(required=False)
    reason = serializers.PrimaryKeyRelatedField(
        queryset=Reason.objects.all(),
        required=True
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance)

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
    def _fire(assessor: Assessor, reason: Reason, possible_return_date: Optional[datetime.date] = None) -> Fired:
        assessor.state = AssessorState.FIRED
        fired = Fired.objects.create(
            assessor=assessor,
            reason=reason,
            possible_return_date=possible_return_date
        )
        return fired

    @staticmethod
    def _blacklist(assessor: Assessor, reason: Reason) -> BlackList:
        assessor.state = AssessorState.BLACKLIST
        blacklist = BlackList.objects.create(
            assessor=assessor,
            reason=reason
        )
        return blacklist

    def _create(self,
                assessor: Assessor,
                reason: Reason,
                possible_return_date: Optional[datetime.date] = None) -> Assessor:
        if reason.blacklist_reason:
            self._blacklist(
                assessor=assessor,
                reason=reason
            )
        else:
            self._fire(
                assessor=assessor,
                reason=reason,
                possible_return_date=possible_return_date
            )
        assessor.manager = None
        assessor.status = None
        assessor.save()
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            unpin_reason=reason.title,
            use_none_action_for_state=True
        )
        return assessor

    def save(self, **kwargs) -> Assessor:
        instance = self._create(
            assessor=self.instance,
            reason=self.validated_data.get('reason'),
            possible_return_date=self.validated_data.get('date')
        )
        return instance


class FiredSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = ReasonSerializer(read_only=True)

    class Meta:
        model = Fired
        fields = '__all__'


class BlackListSerializer(serializers.ModelSerializer):
    assessor = AssessorSerializer(read_only=True)
    reason = ReasonSerializer(read_only=True)

    class Meta:
        model = BlackList
        fields = '__all__'


class BackToTeamSerializer(GetUserMixin, serializers.Serializer):
    manager = serializers.PrimaryKeyRelatedField(
        queryset=BaseUser.objects.filter(status=UserStatus.MANAGER),
        required=True
    )

    def __init__(self, instance=None, *args, **kwargs):
        super().__init__(instance=instance, *args, **kwargs)
        if instance:
            self.instance_before_update = copy(instance.assessor)

    @staticmethod
    def _error(error: str) -> None:
        raise ValidationError(
            {'manager': [error]}
        )

    @staticmethod
    def _back_to_team(fired: Fired, manager: BaseUser) -> Assessor:
        assessor = fired.assessor
        assessor.manager = manager
        assessor.state = AssessorState.AVAILABLE
        assessor.save()
        fired.delete()
        return assessor

    def validate(self, attrs: Dict) -> Dict:
        manager = attrs.get('manager')
        if manager is None:
            self._error('Укажите ответственного менеджера.')
        else:
            if manager.manager_profile.is_teamlead:
                self._error('Операционный менеджер не может быть '
                            'ответственным менеджером исполнителя.')

            current_user = self.get_user()
            if current_user.manager_profile.is_teamlead and manager.manager_profile.teamlead.pk != current_user.pk:
                self._error(f'Менеджер {manager.full_name} не в вашей команде.')

        return super().validate(attrs)

    def update(self, instance: Fired, validated_data: Dict) -> Assessor:
        assessor = self._back_to_team(fired=instance, manager=validated_data.get('manager'))
        history.updated_assessor_history(
            old_assessor=self.instance_before_update,
            new_assessor=assessor,
            user=self.get_user().full_name,
            use_none_action_for_state=True
        )
        return assessor
