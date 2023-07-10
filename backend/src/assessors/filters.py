from django_filters import rest_framework as filters

from .models import Assessor


class AssessorFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    last_name = filters.CharFilter(lookup_expr='icontains')
    first_name = filters.CharFilter(lookup_expr='icontains')
    middle_name = filters.CharFilter(lookup_expr='icontains')
    projects = filters.CharFilter(method='filter_projects')
    is_busy = filters.BooleanFilter()

    class Meta:
        model = Assessor
        fields = (
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'projects',
            'is_busy'
        )

    def filter_projects(self, queryset, name, value):
        projects = value.split(',')
        return queryset.filter(projects__in=projects).distinct()
