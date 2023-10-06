from django.shortcuts import redirect, render


def swagger_redirect(get_response):
    def middleware(request):
        if (not request.user.is_authenticated and
                ('swagger' in request.path and request.path != '/swagger/login/')):
            return redirect('swagger-login')

        response = get_response(request)
        return response

    return middleware


def swagger_forbidden(get_response):
    def middleware(request):
        check = True if 'swagger' in request.path else False
        response = get_response(request)
        if response.status_code == 403 and check:
            return render(request, '403.html', status=403)

        return response
    return middleware
