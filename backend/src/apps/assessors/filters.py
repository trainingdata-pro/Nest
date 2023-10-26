from django.db.models import QuerySet
from django_filters import rest_framework as filters

from core.mixins import SplitStringFilterMixin, FilterByFullNameMixin
from .models import Assessor, Skill, AssessorCredentials


class SkillsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ['title']


class AssessorFilter(SplitStringFilterMixin, FilterByFullNameMixin, filters.FilterSet):
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


class AssessorCredentialsFilter(filters.FilterSet):
    class Meta:
        model = AssessorCredentials
        fields = ['assessor']


class FreeResourcesFilter(SplitStringFilterMixin, FilterByFullNameMixin, filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    full_name = filters.CharFilter(method='filter_full_name')
    skills = filters.CharFilter(method='filter_skills')

    class Meta:
        model = Assessor
        fields = [
            'username',
            'full_name'
        ]

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str):
        skills = self.get_id_for_filtering(value)
        return queryset.filter(skills__in=skills).distinct()
