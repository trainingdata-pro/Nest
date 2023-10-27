from typing import Any

from django.db.models import QuerySet, Q, Count
from django_filters import rest_framework as filters

from core.mixins import SplitStringFilterMixin
from .models import Reason, Fired, BlackList


class ReasonFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Reason
        fields = ['title', 'blacklist_reason']


class FiredFilter(SplitStringFilterMixin, filters.FilterSet):
    name = filters.CharFilter(method='filter_name')
    skills = filters.CharFilter(method='filter_skills')

    class Meta:
        model = Fired
        fields = ['name', 'skills']

    def filter_name(self, queryset: QuerySet[Any], name: str, value: str) -> QuerySet[Any]:
        values = value.split(' ')
        q_objects = Q()
        for item in values:
            q_objects |= (Q(assessor__username__icontains=item)
                          | Q(assessor__last_name__icontains=item)
                          | Q(assessor__first_name__icontains=item)
                          | Q(assessor__middle_name__icontains=item))

        return queryset.filter(q_objects)

    def filter_skills(self, queryset: QuerySet[Any], name: str, value: str) -> QuerySet[Any]:
        skills = self.get_id_for_filtering(value)
        return queryset.annotate(
            matching_skills=Count('assessor__skills', filter=Q(assessor__skills__in=skills))
        ).filter(matching_skills__gte=len(skills))


class BlackListFilter(FiredFilter):
    class Meta:
        model = BlackList
        fields = ['name']
