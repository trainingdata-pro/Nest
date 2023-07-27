from django_filters import rest_framework as filters

from .models import Assessor, Skill


class SkillsFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Skill
        fields = ('title',)


class AssessorFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    last_name = filters.CharFilter(lookup_expr='icontains')
    first_name = filters.CharFilter(lookup_expr='icontains')
    middle_name = filters.CharFilter(lookup_expr='icontains')
    manager = filters.NumberFilter()
    projects = filters.CharFilter(method='filter_projects')
    status = filters.BooleanFilter(lookup_expr='iexact')
    skills = filters.CharFilter(method='filter_skills')
    is_free_resource = filters.BooleanFilter()
    second_manager = filters.CharFilter(method='filter_second_manager')

    class Meta:
        model = Assessor
        fields = (
            'username',
            'last_name',
            'first_name',
            'middle_name',
            'manager',
            'projects',
            'status',
            'skills',
            'is_free_resource',
            'second_manager'
        )

    def filter_projects(self, queryset, name, value):
        projects = self.get_filtered_values(value)
        return queryset.filter(projects__in=projects).distinct()

    def filter_skills(self, queryset, name, value):
        skills = self.get_filtered_values(value)
        return queryset.filter(skills__in=skills).distinct()

    def filter_second_manager(self, queryset, name, value):
        managers = self.get_filtered_values(value)
        return queryset.filter(second_manager__in=managers).distinct()

    @staticmethod
    def get_filtered_values(value):
        return [int(val) for val in value.split(',') if val.isdigit()]
