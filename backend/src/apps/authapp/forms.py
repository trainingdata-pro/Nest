from django import forms
from django.contrib.auth.forms import AuthenticationForm, UsernameField
from django.utils.translation import gettext_lazy as _


class SwaggerLoginForm(AuthenticationForm):
    username = UsernameField(
        widget=forms.EmailInput(attrs={'autofocus': True, 'class': 'form-control'})
    )
    password = forms.CharField(
        label=_('Password'),
        strip=False,
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
    )
