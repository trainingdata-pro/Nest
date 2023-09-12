from django.contrib import admin

from .models import Code, PasswordResetToken


class CodeAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'code',
        'user'
    ]


class TokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'token']
    list_display_links = ['user']


admin.site.register(Code, CodeAdmin)
admin.site.register(PasswordResetToken, TokenAdmin)
