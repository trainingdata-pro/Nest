from rest_framework.permissions import BasePermission


class ProjectOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.owner.pk


class AssessorOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk


class IsCurrentManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.pk


class IsOperationalManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.manager.is_operational_manager
