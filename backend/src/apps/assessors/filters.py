from django.db.models import QuerySet, Q, Count
from django_filters import rest_framework as filters

from core.mixins import SplitStringFilterMixin, FilterByNameMixin
from core.users import UserStatus
from apps.users.models import BaseUser
from .models import Assessor, Skill, AssessorCredentials


class SkillsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['title']


class AssessorFilter(SplitStringFilterMixin, FilterByNameMixin, filters.FilterSet):
    name = filters.CharFilter(method='filter_name')
    manager = filters.CharFilter(method='filter_managers')
    projects = filters.CharFilter(method='filter_projects')
    skills = filters.CharFilter(method='filter_skills')
    second_manager = filters.CharFilter(method='filter_second_manager')
    exclude_rented = filters.BooleanFilter(method='filter_rented')

    class Meta:
        model = Assessor
        fields = [
            'name',
            'manager',
            'projects',
            'skills',
            'second_manager',
            'exclude_rented'
        ]

    def filter_managers(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        managers = self.get_id_for_filtering(value)
        return queryset.filter(manager__in=managers)

    def filter_projects(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        projects = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_projects=Count('projects', filter=Q(projects__in=projects))
        ).filter(matching_projects__gte=len(projects))

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        skills = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_skills=Count('skills', filter=Q(skills__in=skills))
        ).filter(matching_skills__gte=len(skills))

    def filter_second_manager(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        managers = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_managers=Count('second_manager', filter=Q(second_manager__in=managers))
        ).filter(matching_managers__gte=len(managers))

    def filter_rented(self, queryset: QuerySet[Assessor], name: str, value: bool) -> QuerySet[Assessor]:
        user = self.request.user
        if user.is_superuser or user.status == UserStatus.ANALYST:
            return queryset

        if user.manager_profile.is_teamlead:
            team = BaseUser.objects.filter(status=UserStatus.MANAGER, manager_profile__teamlead=user)
            if value:
                return queryset.filter(manager__in=team)
            else:
                return queryset.filter(second_manager__in=team)
        else:
            if value:
                return queryset.filter(manager=user)
            else:
                return queryset.filter(second_manager__in=[user])


class AssessorCredentialsFilter(filters.FilterSet):
    class Meta:
        model = AssessorCredentials
        fields = ['assessor']


class FreeResourcesFilter(SplitStringFilterMixin, FilterByNameMixin, filters.FilterSet):
    name = filters.CharFilter(method='filter_name')
    skills = filters.CharFilter(method='filter_skills')

    class Meta:
        model = Assessor
        fields = [
            'name',
            'skills'
        ]

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str):
        skills = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_skills=Count('skills', filter=Q(skills__in=skills))
        ).filter(matching_skills__gte=len(skills))
