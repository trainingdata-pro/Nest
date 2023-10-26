from django.db.models import QuerySet, Q, Count
from django_filters import rest_framework as filters

from core.mixins import (SplitStringFilterMixin, FilterByFullNameMixin)
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
        return queryset.annotate(
            matching_skills=Count('skills', filter=Q(skills__in=skills))
        ).filter(matching_skills__gte=len(skills))

    def filter_second_manager(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        managers = self.get_id_for_filtering(value)
        return queryset.filter(second_manager__in=managers).distinct()


class AssessorCredentialsFilter(filters.FilterSet):
    class Meta:
        model = AssessorCredentials
        fields = ['assessor']


class FreeResourcesFilter(SplitStringFilterMixin, filters.FilterSet):
    name = filters.CharFilter(method='filter_name')
    skills = filters.CharFilter(method='filter_skills')

    class Meta:
        model = Assessor
        fields = [
            'name',
            'skills'
        ]

    def filter_name(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(username__icontains=item)
                          | Q(last_name__icontains=item)
                          | Q(first_name__icontains=item)
                          | Q(middle_name__icontains=item))

        return queryset.filter(q_objects)

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str):
        skills = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_skills=Count('skills', filter=Q(skills__in=skills))
        ).filter(matching_skills__gte=len(skills))
