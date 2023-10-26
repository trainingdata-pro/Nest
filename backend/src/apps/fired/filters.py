from typing import Any

from django.db.models import QuerySet, Q
from django_filters import rest_framework as filters

from .models import Reason, Fired, BlackList


class ReasonFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Reason
        fields = ['title', 'blacklist_reason']


class FiredFilter(filters.FilterSet):
    name = filters.CharFilter(method='filter_name')

    class Meta:
        model = Fired
        fields = ['name']

    def filter_name(self, queryset: QuerySet[Any], name: str, value: str) -> QuerySet[Any]:
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(assessor__username__icontains=item)
                          | Q(assessor__last_name__icontains=item)
                          | Q(assessor__first_name__icontains=item)
                          | Q(assessor__middle_name__icontains=item))

        return queryset.filter(q_objects)


class BlackListFilter(FiredFilter):
    class Meta:
        model = BlackList
        fields = ['name']
