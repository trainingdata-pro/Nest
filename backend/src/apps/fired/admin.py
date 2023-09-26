from django.contrib import admin

from .models import Reason, BlackList, Fired


class ReasonAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'title',
        'blacklist_reason'
    ]
    list_display_links = ['title']
    list_filter = ['blacklist_reason']


class BlackListStateAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'assessor',
        'reason',
        'date'
    ]
    list_display_links = ['assessor']


class FiredStateAdmin(BlackListStateAdmin):
    list_display = [
        'pk',
        'assessor',
        'reason',
        'date',
        'possible_return_date'
    ]


admin.site.register(Reason, ReasonAdmin)
admin.site.register(BlackList, BlackListStateAdmin)
admin.site.register(Fired, FiredStateAdmin)
