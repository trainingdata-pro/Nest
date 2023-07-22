from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed


class GetSerializerClassMixin:
    def get_serializer_class(self):
        return self.serializer_class[self.action]


class GetPermissionMixin:
    def get_permissions(self):
        action = self.action
        if action not in self.permission_classes:
            raise MethodNotAllowed(self.request.method)
        return [perm() for perm in self.permission_classes[action]]


class BaseAPIViewSet(GetSerializerClassMixin,
                     GetPermissionMixin,
                     viewsets.ModelViewSet):
    pass
