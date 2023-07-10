from django.contrib.postgres.search import SearchVector
from django_filters import rest_framework as filters

from .models import Manager


class ManagerFilter(filters.FilterSet):
    full_name = filters.CharFilter(method='filter_by_full_name')
    is_operational_manager = filters.BooleanFilter()
    operational_manager = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Manager
        fields = (
            'full_name',
            'is_operational_manager',
            'operational_manager'
        )

    def filter_by_full_name(self, queryset, name, value):
        return queryset.annotate(search=SearchVector(
            'last_name', 'first_name', 'middle_name'
        )).filter(search__icontains=value)
