from django.db.models import Count, QuerySet, Q
from django_filters import rest_framework as filters

from apps.assessors.models import Assessor
from core.mixins import SplitStringFilterMixin,FilterByNameMixin
from .models import Project, ProjectWorkingHours, WorkLoadStatus


class ProjectFilter(SplitStringFilterMixin, filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    manager = filters.CharFilter(method='filter_manager')
    assessors_count = filters.NumberFilter(method='filter_assessors_count')
    assessor_id = filters.NumberFilter(method='filter_assessor_id')
    status = filters.CharFilter(method='filter_status')
    exclude_for_assessor = filters.CharFilter(method='filter_exclude_for_assessor')
    for_assessor = filters.CharFilter(method='filter_for_assessor')

    class Meta:
        model = Project
        fields = [
            'name',
            'manager',
            'assessors_count',
            'assessor_id',
            'status',
            'exclude_for_assessor',
            'for_assessor'
        ]

    def filter_manager(self, queryset: QuerySet[Project], name: str, value: str) -> QuerySet[Project]:
        managers = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_managers=Count('manager', filter=Q(manager__in=managers))
        ).filter(matching_managers__gte=len(managers))

    def filter_assessors_count(self, queryset: QuerySet[Project], name: str, value: int) -> QuerySet[Project]:
        return queryset.annotate(assessors_count=Count('assessors')).filter(assessors_count=value)

    def filter_assessor_id(self, queryset: QuerySet[Project], name: str, value: int) -> QuerySet[Project]:
        assessor = Assessor.objects.filter(id=value).first()
        if assessor:
            return assessor.projects.all()

        return Project.objects.none()

    def filter_status(self, queryset: QuerySet[Project], name: str, value: str) -> QuerySet[Project]:
        statuses = self.get_string_for_filtering(value)
        return queryset.filter(status__in=statuses)

    def filter_exclude_for_assessor(self, queryset: QuerySet[Project], name: str, value: str) -> QuerySet[Project]:
        assessors = self.get_id_for_filtering(value)
        return queryset.exclude(assessors__in=assessors)

    def filter_for_assessor(self, queryset: QuerySet[Project], name: str, value: str) -> QuerySet[Project]:
        assessors = self.get_id_for_filtering(value)
        return queryset.filter(assessors__in=assessors)


class AllAssessorsForProjectFilter(SplitStringFilterMixin, FilterByNameMixin, filters.FilterSet):
    name = filters.CharFilter(method='filter_name')
    skills = filters.CharFilter(method='filter_skills')
    workload_status = filters.CharFilter(method='filter_workload_status')

    class Meta:
        model = Assessor
        fields = [
            'name',
            'skills',
            'workload_status'
        ]

    def filter_skills(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        skills = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_skills=Count('skills', filter=Q(skills__in=skills))
        ).filter(matching_skills__gte=len(skills))

    def filter_workload_status(self, queryset: QuerySet[Assessor], name: str, value: str) -> QuerySet[Assessor]:
        statuses = self.get_string_for_filtering(value)
        return queryset.filter(workload_status__status__in=statuses)


class ProjectWorkingHoursFilter(SplitStringFilterMixin, filters.FilterSet):
    assessor = filters.CharFilter(method='filter_assessor')
    project = filters.CharFilter(method='filter_project')

    class Meta:
        model = ProjectWorkingHours
        fields = ['assessor', 'project']

    def filter_assessor(self,
                        queryset: QuerySet[ProjectWorkingHours],
                        name: str, value: str) -> QuerySet[ProjectWorkingHours]:
        assessors = self.get_id_for_filtering(value)
        return queryset.filter(assessor__in=assessors)

    def filter_project(self,
                       queryset: QuerySet[ProjectWorkingHours],
                       name: str,
                       value: str) -> QuerySet[ProjectWorkingHours]:
        projects = self.get_id_for_filtering(value)
        return queryset.filter(project__in=projects)


class WorkLoadStatusFilter(ProjectWorkingHoursFilter):
    status = filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = WorkLoadStatus
        fields = ['assessor', 'project']
