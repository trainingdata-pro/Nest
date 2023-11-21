from django.contrib import admin

from .models import Reason, BlackList, Fired


@admin.register(Reason)
class ReasonAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'title',
        'blacklist_reason'
    ]
    list_display_links = ['title']
    list_filter = ['blacklist_reason']


@admin.register(BlackList)
class BlackListStateAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'assessor',
        'reason',
        'date'
    ]
    list_display_links = ['assessor']
    search_fields = [
        'assessor__last_name',
        'assessor__first_name',
        'assessor__middle_name',
        'assessor__username'
    ]
    search_help_text = 'Введите username или ФИО исполнителя'


@admin.register(Fired)
class FiredStateAdmin(BlackListStateAdmin):
    list_display = [
        'pk',
        'assessor',
        'reason',
        'date',
        'possible_return_date'
    ]
