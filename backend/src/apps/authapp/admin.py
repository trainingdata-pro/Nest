from django.contrib import admin
from rest_framework.authtoken.admin import TokenAdmin

from .models import Code, PasswordResetToken


@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = ['pk', 'code', 'user']


@admin.register(PasswordResetToken)
class ResetPasswordTokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'token']
    list_display_links = ['user']


TokenAdmin.list_display = ['pk', 'key', 'user', 'created']
TokenAdmin.list_display_links = ['pk', 'key']
TokenAdmin.search_fields = [
    'user__username',
    'user__email',
    'user__first_name',
    'user__last_name',
    'user__middle_name'
]
TokenAdmin.search_help_text = 'Введите username, email или ФИО пользователя'
