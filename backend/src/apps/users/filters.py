from django.db.models import QuerySet, Q
from django_filters import rest_framework as filters

from core.mixins import SplitStringFilterMixin
from .models import BaseUser, ManagerProfile


class UserFilter(SplitStringFilterMixin, filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')
    full_name = filters.CharFilter(method='filter_full_name')
    status = filters.CharFilter(method='filter_status')

    class Meta:
        model = BaseUser
        fields = ['username', 'full_name', 'status']

    def filter_full_name(self, queryset: QuerySet[BaseUser], name: str, value: str) -> QuerySet[BaseUser]:
        """ Filter queryset by full name """
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(last_name__icontains=item)
                          | Q(first_name__icontains=item)
                          | Q(middle_name__icontains=item))

        return queryset.filter(q_objects)

    def filter_status(self, queryset: QuerySet[BaseUser], name: str, value: str) -> QuerySet[BaseUser]:
        statuses = self.get_string_for_filtering(value)
        return queryset.filter(status__in=statuses)


class ManagerProfileFilter(filters.FilterSet):
    is_teamlead = filters.BooleanFilter()
    teamlead = filters.NumberFilter()

    class Meta:
        model = ManagerProfile
        fields = ['is_teamlead', 'teamlead']
