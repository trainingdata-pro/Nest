from django.contrib import admin

from .models import BlackListItem


class BlackListItemAdmin(admin.ModelAdmin):
    search_fields = (
        'assessor__username',
        'assessor__last_name',
        'assessor__first_name',
        'assessor__middle_name'
    )
    search_help_text = 'Введите username или ФИО исполнителя'
    list_display = (
        'pk',
        'assessor',
        'last_manager',
        'last_project',
        'reason',
        'date_added'
    )
    list_display_links = ('assessor',)
    list_filter = ('last_manager',)
    ordering = ('last_manager', 'assessor__last_name')


admin.site.register(BlackListItem, BlackListItemAdmin)
