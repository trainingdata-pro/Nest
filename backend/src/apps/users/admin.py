from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from .models import BaseUser, ManagerProfile


@admin.register(BaseUser)
class BaseUserAdmin(UserAdmin):
    model = BaseUser
    add_form = UserCreationForm
    search_help_text = 'Введите username, email или ФИО пользователя'
    search_fields = [
        'username',
        'email',
        'last_name',
        'first_name',
        'middle_name'
    ]
    list_display = (
        'pk',
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'email',
        'status',
        'is_active',
        'is_staff',
        'is_superuser'
    )
    list_display_links = ('pk', 'username')
    list_filter = ['status', 'is_staff', 'is_superuser']
    fieldsets = [
        (None, {
            'fields': [
                'last_name',
                'first_name',
                'middle_name',
                'username',
                'email',
                'status',
                'password'
            ]
        }),
        (_('Permissions'), {
            'fields': ['is_active', 'is_staff', 'is_superuser']
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined')
        }),
    ]
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': [
                'username',
                'email',
                'last_name',
                'first_name',
                'middle_name',
                'status',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superuser'
            ]
        }),
    ]


@admin.register(ManagerProfile)
class ManagerProfileAdmin(admin.ModelAdmin):
    search_help_text = 'Введите username, email или ФИО пользователя'
    search_fields = [
        'user__username',
        'user__email',
        'user__last_name',
        'user__first_name',
        'user__middle_name'
    ]
    list_display = [
        'pk',
        'user',
        'is_teamlead',
        'teamlead'
    ]
    list_display_links = ['user']
    list_filter = ['is_teamlead', 'teamlead']


admin.site.unregister(Group)
