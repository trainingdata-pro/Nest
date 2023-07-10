from django_filters import rest_framework as filters

from .models import Project


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    owner = filters.NumberFilter()

    class Meta:
        model = Project
        fields = ('name', 'owner')
