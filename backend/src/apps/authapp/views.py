from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator

from core.decorators import auth_swagger_redirect
from .forms import SwaggerLoginForm


@method_decorator(name='dispatch', decorator=auth_swagger_redirect)
class Login(LoginView):
    template_name = 'swagger_login.html'
    extra_context = {'title': 'Вход в Swagger'}
    form_class = SwaggerLoginForm

    def get_success_url(self):
        return reverse_lazy('schema-swagger-ui')


class Logout(LogoutView):
    pass
