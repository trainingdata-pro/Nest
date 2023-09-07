from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from .models import BaseUser, ManagerProfile, Code, PasswordResetToken


class BaseUserAdmin(UserAdmin):
    model = BaseUser
    add_form = UserCreationForm
    list_display = (
        'pk',
        'email',
        'username',
        'is_active',
        'is_staff',
        'is_superuser'
    )
    list_display_links = ('email',)
    list_filter = ['is_staff', 'is_superuser']
    fieldsets = [
        (None, {'fields': ['username', 'email', 'password']}),
        (_('Permissions'), {'fields': ['is_staff', 'is_superuser']}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    ]
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': [
                'username',
                'email',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superuser'
            ]
        }),
    ]
    search_fields = ['email', 'username']
    ordering = ['pk']


class ManagerAdmin(admin.ModelAdmin):
    search_fields = [
        'user__username',
        'last_name',
        'first_name',
        'middle_name'
    ]
    search_help_text = 'Введите username или ФИО менеджера'
    list_display = [
        'pk',
        'user',
        'last_name',
        'first_name',
        'middle_name',
        'is_teamlead'
    ]
    list_display_links = ['user']
    list_filter = ['is_teamlead']
    ordering = ['last_name']


class CodeAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'code',
        'user'
    ]


class TokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'token']
    list_display_links = ['user']


admin.site.unregister(Group)
admin.site.register(BaseUser, BaseUserAdmin)
admin.site.register(ManagerProfile, ManagerAdmin)
admin.site.register(Code, CodeAdmin)
admin.site.register(PasswordResetToken, TokenAdmin)
