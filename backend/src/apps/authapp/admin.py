from django.contrib import admin

from .models import Code, PasswordResetToken


@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'code',
        'user'
    ]


@admin.register(PasswordResetToken)
class TokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'token']
    list_display_links = ['user']
