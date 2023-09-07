from django.contrib.postgres.search import SearchVector
from django.db.models import QuerySet
from django_filters import rest_framework as filters

from .models import ManagerProfile


class ManagerFilter(filters.FilterSet):
    full_name = filters.CharFilter(method='filter_by_full_name')
    is_operational_manager = filters.BooleanFilter()
    teamlead = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = ManagerProfile
        fields = (
            'full_name',
            'is_teamlead',
            'teamlead'
        )

    def filter_by_full_name(self, queryset: QuerySet[ManagerProfile], name: str, value: str):
        return queryset.annotate(search=SearchVector(
            'last_name', 'first_name', 'middle_name'
        )).filter(search__icontains=value)
