from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy

from .forms import SwaggerLoginForm


class Login(LoginView):
    """ Swagger login """
    template_name = 'swagger_login.html'
    extra_context = {'title': 'Вход в Swagger'}
    form_class = SwaggerLoginForm

    def get_success_url(self):
        return reverse_lazy('schema-swagger-ui')


class Logout(LogoutView):
    """ Swagger logout """
    pass
