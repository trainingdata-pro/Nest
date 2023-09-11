import sys
from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response


class Pagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_page_size(self, request: Request):
        page_size = 0
        try:
            value = request.query_params[self.page_size_query_param]
            if value == 'all':
                page_size = sys.maxsize
            else:
                page_size = int(value)
        except (KeyError, ValueError):
            pass

        return page_size if page_size > 0 else self.page_size

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('page', self.page.number),
            ('page_size', self.get_page_size(self.request)),
            ('results', data)
        ]))
