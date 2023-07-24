from rest_framework.permissions import BasePermission


class ProjectOwnerOrTeamLead(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk or \
            obj.owner.operational_manager.pk == request.user.manager.pk


class AssessorOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk


class OwnerOrSecondManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk or \
            obj.second_manager.filter(pk=request.user.manager.pk).exists()


class IsCurrentManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.pk


class IsOperationalManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.manager.is_operational_manager
