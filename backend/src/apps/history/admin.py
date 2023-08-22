from django.contrib import admin

from .models import History


class HistoryAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'assessor',
        'event',
        'timestamp',
        'description'
    )
    list_display_links = ('assessor',)


admin.site.register(History, HistoryAdmin)
