from django.shortcuts import redirect


def auth_swagger_redirect(method):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('schema-swagger-ui')

        return method(request, *args, **kwargs)

    return wrapper
