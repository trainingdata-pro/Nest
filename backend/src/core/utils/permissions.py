from django.contrib.auth.models import User
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.assessors.models import Assessor
from apps.projects.models import Project
from apps.users.models import Manager


class BaseUserPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: User) -> bool:
        return request.user.pk == obj.pk


class IsManager(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return hasattr(request.user, 'manager') or request.user.is_superuser


class ProjectPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Project) -> bool:
        return request.user.manager in obj.manager.all() or \
            request.user.manager.is_operational_manager


class AssessorPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Assessor) -> bool:
        return request.user.manager == obj.manager or \
            obj.manager.operational_manager == request.user.manager


class IsCurrentManager(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Manager) -> bool:
        return request.user.manager.pk == obj.pk
