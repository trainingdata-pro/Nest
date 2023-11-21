from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .filters import HistoryFilter
from .models import History
from .schemas import history_schema
from .serializers import HistorySerializer
from .services import history


@method_decorator(name='get', decorator=history_schema.get())
class HistoryAPIView(generics.ListAPIView):
    """ Get a specific assessor history """
    permission_classes = (IsAuthenticated,)
    serializer_class = HistorySerializer
    filterset_class = HistoryFilter
    ordering_fields = ['action', 'attribute', 'timestamp']

    def get_queryset(self) -> QuerySet[History]:
        assessor_id = self.request.query_params.get('assessor')
        history.get_last_assessor_manager(assessor_id=self.request.GET.get('assessor'))
        return History.objects.filter(assessor__id=assessor_id).order_by('-timestamp')
