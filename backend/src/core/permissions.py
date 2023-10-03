from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from apps.assessors.models import Assessor
from apps.projects.models import Project, ProjectStatuses, ProjectWorkingHours
from apps.users.models import UserStatus, ManagerProfile, BaseUser


class UserPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: User) -> bool:
        return request.user.pk == obj.pk


class IsManager(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return request.user.status == UserStatus.MANAGER or request.user.is_superuser


class ProjectPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Project) -> bool:
        return (request.user in obj.manager.all() or
                request.user.manager_profile.is_tramlead)


class ProjectIsActive(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Project) -> bool:
        if obj.status == ProjectStatuses.COMPLETED and not request.user.manager_profile.is_tramlead:
            return False
        return True


class ProjectRelatedPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: ProjectWorkingHours) -> bool:
        return (request.user.pk == obj.assessor.manager.pk
                or request.user.pk == obj.assessor.manager.manager_profile.teamlead.pk
                or request.user.pk in obj.assessor.second_manager.values_list('pk', flat=True))


class AssessorPermission(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Assessor) -> bool:
        return (request.user.pk == obj.manager.pk
                or request.user.pk == obj.manager.manager_profile.teamlead.pk)


class AssessorPermissionExtended(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Assessor) -> bool:
        return (request.user.pk == obj.manager.pk
                or request.user.pk == obj.manager.manager_profile.teamlead.pk
                or request.user in obj.second_manager.all())


class IsCurrentManager(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: ManagerProfile) -> bool:
        return request.user.pk == obj.user.pk


def check_full_assessor_permission(manager: BaseUser, assessor: Assessor) -> None:
    if not any([manager.pk == assessor.manager.pk
                or manager.pk == assessor.manager.manager_profile.teamlead.pk
                or manager in assessor.second_manager.all()
                or manager.pk in assessor.second_manager.all().values_list('manager_profile__teamlead__pk',
                                                                           flat=True)]):
        raise ValidationError(
            {'assessor': ['Вы не можете выбрать данного исполнителя.']}
        )
