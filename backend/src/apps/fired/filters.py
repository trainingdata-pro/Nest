from django_filters import rest_framework as filters

from .models import Reason


class ReasonFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Reason
        fields = ['title', 'blacklist_reason']
