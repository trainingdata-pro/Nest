from django.contrib import admin

from .models import Assessor


class AssessorAdmin(admin.ModelAdmin):
    search_fields = (
        'username',
        'last_name',
        'first_name',
        'middle_name'
    )
    search_help_text = 'Введите username или ФИО исполнителя'
    list_display = (
        'pk',
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'manager',
        'is_free_resource',
        'is_busy',
        'blacklist'
    )
    list_filter = (
        'manager',
        'projects',
        'blacklist'
    )
    list_display_links = ('username',)
    ordering = ('manager__last_name', 'last_name')


admin.site.register(Assessor, AssessorAdmin)
