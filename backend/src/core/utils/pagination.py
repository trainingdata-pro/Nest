from collections import OrderedDict

from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class Pagination(LimitOffsetPagination):
    def get_paginated_response(self, data) -> Response:
        return Response(OrderedDict([
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('limit', self.get_limit(self.request)),
            ('offset', self.get_offset(self.request)),
            ('results', data)
        ]))
