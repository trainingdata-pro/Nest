from typing import List, Any

from django.db.models import QuerySet, Q
from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.serializers import Serializer

from apps.users.models import BaseUser


class GetSerializerClassMixin:
    def get_serializer_class(self) -> Serializer:
        return self.serializer_class[self.action]


class GetPermissionMixin:
    def get_permissions(self) -> List[bool]:
        action = self.action
        if action not in self.permission_classes:
            raise MethodNotAllowed(self.request.method)
        return [perm() for perm in self.permission_classes[action]]


class BaseAPIViewSet(GetSerializerClassMixin,
                     GetPermissionMixin,
                     viewsets.ModelViewSet):
    pass


class GetUserMixin:
    def get_user(self) -> BaseUser:
        return self.context.get('request').user


class SplitStringFilterMixin:
    @staticmethod
    def get_id_for_filtering(string: str) -> List[int]:
        return [int(val) for val in string.split(',') if val.strip().isdigit()]

    @staticmethod
    def get_string_for_filtering(string: str) -> List[str]:
        return [val.strip() for val in string.split(',')]


class FilterByFullNameMixin:
    def filter_full_name(self, queryset: QuerySet[Any], name: str, value: str) -> QuerySet[Any]:
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(last_name__icontains=item)
                          | Q(first_name__icontains=item)
                          | Q(middle_name__icontains=item))

        return queryset.filter(q_objects)
