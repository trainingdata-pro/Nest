from django.db.models import Count
from django_filters import rest_framework as filters

from .models import Project


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='iexact')
    manager = filters.CharFilter(method='filter_manager')
    assessors_count = filters.NumberFilter(method='filter_assessors_count')
    status = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Project
        fields = (
            'name',
            'manager',
            'assessors_count',
            'status'
        )

    def filter_manager(self, queryset, name, value):
        managers = self.get_filtered_values(value)
        return queryset.filter(manager__in=managers).distinct()

    def filter_assessors_count(self, queryset, name, value):
        return queryset.annotate(assessors_count=Count('assessors')).filter(assessors_count=value)

    @staticmethod
    def get_filtered_values(value):
        return [int(val) for val in value.split(',') if val.isdigit()]
