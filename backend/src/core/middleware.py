from typing import Callable

from django.shortcuts import redirect, render
from rest_framework.request import Request
from rest_framework.response import Response


def swagger_redirect(get_response: Callable):
    """ Redirect to swagger login page """
    def middleware(request: Request) -> Response:
        if (not request.user.is_authenticated and
                ('swagger' in request.path and request.path != '/swagger/login/')):
            return redirect('swagger-login')

        response = get_response(request)
        return response

    return middleware


def swagger_forbidden(get_response: Callable):
    def middleware(request: Request) -> Response:
        check = True if 'swagger' in request.path else False
        response = get_response(request)
        if response.status_code == 403 and check:
            return render(request, '403.html', status=403)

        return response
    return middleware
