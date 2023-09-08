from typing import List

from django.db.models import Count, QuerySet
from django_filters import rest_framework as filters

from apps.assessors.models import Assessor
from .models import Project


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    manager = filters.CharFilter(method='filter_manager')
    assessors_count = filters.NumberFilter(method='filter_assessors_count')
    assessor_id = filters.NumberFilter(method='filter_assessor_id')
    status = filters.CharFilter(method='filter_status')

    class Meta:
        model = Project
        fields = (
            'name',
            'manager',
            'assessors_count',
            'assessor_id',
            'status'
        )

    def filter_manager(self, queryset: QuerySet[Project], name: str, value: str) -> QuerySet[Project]:
        managers = self.get_id_for_filtering(value)
        return queryset.filter(manager__in=managers).distinct()

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

    @staticmethod
    def get_id_for_filtering(string: str) -> List[int]:
        return [int(val) for val in string.split(',') if val.isdigit()]

    @staticmethod
    def get_string_for_filtering(string: str) -> List[str]:
        return [val.strip() for val in string.split(',')]
