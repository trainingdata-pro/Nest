from django.db.models import QuerySet, Q
from django_filters import rest_framework as filters

from .models import Reason, Fired, BlackList


class ReasonFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Reason
        fields = ['title', 'blacklist_reason']


class FiredFilter(filters.FilterSet):
    username = filters.CharFilter(method='filter_username')
    full_name = filters.CharFilter(method='filter_full_name')

    class Meta:
        model = Fired
        fields = ['username', 'full_name']

    def filter_username(self, queryset: QuerySet, name: str, value: str) -> QuerySet:
        return queryset.filter(assessor__username__icontains=value)

    def filter_full_name(self, queryset: QuerySet, name: str, value: str) -> QuerySet:
        return queryset.filter(
            Q(assessor__last_name__icontains=value)
            | Q(assessor__first_name__icontains=value)
            | Q(assessor__middle_name__icontains=value)
        )


class BlackListFilter(FiredFilter):
    class Meta:
        model = BlackList
        fields = ['username', 'full_name']
