from django_filters import rest_framework as filters

from .models import History


class HistoryFilter(filters.FilterSet):
    event = filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = History
        fields = ['event']
