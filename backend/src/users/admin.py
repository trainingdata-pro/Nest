from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group, User

from .models import Manager, Code


class CustomUserAdmin(UserAdmin):
    list_display = (
        'pk',
        'username',
        'email',
        'is_superuser',
        'is_active'
    )
    list_display_links = ('username',)


class ManagerAdmin(admin.ModelAdmin):
    search_fields = (
        'user__username',
        'last_name',
        'first_name',
        'middle_name'
    )
    search_help_text = 'Введите username или ФИО менеджера'
    list_display = (
        'pk',
        'user',
        'last_name',
        'first_name',
        'middle_name',
        'is_operational_manager'
    )
    list_display_links = ('user',)
    ordering = ('last_name',)


class CodeAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'code',
        'user'
    )


admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Manager, ManagerAdmin)
admin.site.register(Code, CodeAdmin)
