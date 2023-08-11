from rest_framework.permissions import BasePermission


class BaseUserPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_superuser or request.user.pk == obj.pk


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, 'manager') or request.user.is_superuser


class ProjectPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager in obj.manager.all() or \
            request.user.manager.is_operational_manager


class AssessorPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk or \
            obj.manager.operational_manager == request.user.manager


class AssessorProjectPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.manager.pk or \
            obj.manager.operational_manager == request.user.manager or \
            obj.second_manager.filter(pk=request.user.manager.pk).exists()


class WorkingHoursPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        pass


class IsCurrentManager(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.manager.pk == obj.pk


# class IsOperationalManagerOrAdmin(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_superuser or request.user.manager.is_operational_manager
