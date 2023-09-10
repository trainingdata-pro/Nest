from typing import List

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
