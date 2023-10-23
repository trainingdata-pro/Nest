from django.db.models import QuerySet, Q
from django_filters import rest_framework as filters

from core.mixins import FilteringMixin
from .models import Assessor, Skill, AssessorCredentials


class SkillsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['title']


class AssessorFilter(FilteringMixin, filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    full_name = filters.CharFilter(method='filter_full_name')
    manager = filters.NumberFilter()
    projects = filters.CharFilter(method='filter_projects')
    skills = filters.CharFilter(method='filter_skills')
    second_manager = filters.CharFilter(method='filter_second_manager')

    class Meta:
        model = Assessor
        fields = [
            'username',
            'full_name',
            'manager',
            'projects',
            'skills',
            'second_manager'
        ]

    def filter_projects(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        projects = self.get_id_for_filtering(value)
        return queryset.filter(projects__in=projects).distinct()

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        skills = self.get_id_for_filtering(value)
        return queryset.filter(skills__in=skills).distinct()

    def filter_second_manager(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        managers = self.get_id_for_filtering(value)
        return queryset.filter(second_manager__in=managers).distinct()

    def filter_full_name(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        return queryset.filter(
            Q(last_name__icontains=value)
            | Q(first_name__icontains=value)
            | Q(middle_name__icontains=value)
        )


class AssessorCredentialsFilter(filters.FilterSet):
    class Meta:
        model = AssessorCredentials
        fields = ['assessor']


class FreeResourcesFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    full_name = filters.CharFilter(method='filter_full_name')

    class Meta:
        model = Assessor
        fields = [
            'username',
            'full_name'
        ]

    def filter_full_name(self, queryset: QuerySet, name: str, value: str) -> QuerySet:
        return queryset.filter(
            Q(last_name__icontains=value)
            | Q(first_name__icontains=value)
            | Q(middle_name__icontains=value)
        )
