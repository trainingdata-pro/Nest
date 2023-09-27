from django_filters import rest_framework as filters

from .models import History


class HistoryFilter(filters.FilterSet):
    action = filters.CharFilter(lookup_expr='iexact')
    attribute = filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = History
        fields = ['action', 'attribute']
