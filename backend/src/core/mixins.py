from typing import List, Any

from django.db.models import QuerySet, Q
from rest_framework import viewsets
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.request import Request
from rest_framework.serializers import Serializer

from apps.users.models import BaseUser


class BaseService:
    """ Base service class """
    model = None

    def create_instance(self, **kwargs) -> Any:
        """ Create a new instance """
        return self.model(**kwargs)

    @staticmethod
    def perform_save(instance: Any) -> Any:
        """ Save a specific instance """
        instance.save()
        return instance

    @staticmethod
    def perform_delete(instance: Any) -> None:
        """ Remove a specific instance """
        instance.delete()


class GetSerializerClassMixin:
    def get_serializer_class(self) -> Serializer:
        """ Get serializer for a specific action """
        return self.serializer_class[self.action]


class GetPermissionMixin:
    def get_permissions(self) -> List[bool]:
        """ Get permissions for a specific action """
        action = self.action
        if action not in self.permission_classes:
            raise MethodNotAllowed(self.request.method)
        return [perm() for perm in self.permission_classes[action]]


class UpdateObjectMixin:
    def update_obj(self, request: Request) -> Any:
        """ Update a specific object """
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return obj


class BaseAPIViewSet(GetSerializerClassMixin,
                     GetPermissionMixin,
                     UpdateObjectMixin,
                     viewsets.ModelViewSet):
    pass


class GetUserMixin:
    def get_user(self) -> BaseUser:
        """ Get user from serializer context """
        return self.context.get('request').user


class SplitStringFilterMixin:
    @staticmethod
    def get_id_for_filtering(string: str) -> List[int]:
        """ Convert comma separated string to a list of IDs """
        return [int(val) for val in string.split(',') if val.strip().isdigit()]

    @staticmethod
    def get_string_for_filtering(string: str) -> List[str]:
        """ Convert comma separated string to a list of values """
        return [val.strip() for val in string.split(',')]


class FilterByFullNameMixin:
    def filter_full_name(self, queryset: QuerySet[Any], name: str, value: str) -> QuerySet[Any]:
        """ Filter queryset by full name """
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(last_name__icontains=item)
                          | Q(first_name__icontains=item)
                          | Q(middle_name__icontains=item))

        return queryset.filter(q_objects)
