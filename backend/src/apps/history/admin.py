from django.contrib import admin

from .models import History


class HistoryAdmin(admin.ModelAdmin):
    search_help_text = 'Введите ФИО или username исполнителя'
    search_fields = [
        'assessor__last_name',
        'assessor__first_name',
        'assessor__middle_name',
        'assessor__username'
    ]
    list_display = [
        'pk',
        'assessor',
        'timestamp',
        'attribute',
        'old_value',
        'new_value',
        'action',
        'reason',
        'user'
    ]
    list_display_links = ['assessor']
    list_filter = ['action', 'user']
    readonly_fields = ['timestamp']
    date_hierarchy = 'timestamp'


admin.site.register(History, HistoryAdmin)
