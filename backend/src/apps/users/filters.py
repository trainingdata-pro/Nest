from typing import List

from django.contrib.postgres.search import SearchVector
from django.db.models import QuerySet
from django_filters import rest_framework as filters

from .models import BaseUser, ManagerProfile


class UserFilter(filters.FilterSet):
    full_name = filters.CharFilter(method='filter_by_full_name')
    status = filters.CharFilter(method='filter_status')

    class Meta:
        model = BaseUser
        fields = ['full_name', 'status']

    def filter_by_full_name(self, queryset: QuerySet[ManagerProfile], name: str, value: str) -> QuerySet[BaseUser]:
        return queryset.annotate(search=SearchVector(
            'last_name', 'first_name', 'middle_name'
        )).filter(search__icontains=value)

    def filter_status(self, queryset: QuerySet[BaseUser], name: str, value: str) -> QuerySet[BaseUser]:
        statuses = self.get_string_for_filtering(value)
        return queryset.filter(status__in=statuses)

    @staticmethod
    def get_string_for_filtering(string: str) -> List[str]:
        return [val.strip() for val in string.split(',')]


class ManagerProfileFilter(filters.FilterSet):
    is_operational_manager = filters.BooleanFilter()
    teamlead = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = ManagerProfile
        fields = ['is_teamlead', 'teamlead']

    def filter_by_full_name(self, queryset: QuerySet[ManagerProfile], name: str, value: str):
        return queryset.annotate(search=SearchVector(
            'last_name', 'first_name', 'middle_name'
        )).filter(search__icontains=value)
