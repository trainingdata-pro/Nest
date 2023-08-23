from django.contrib import admin

from .models import BlackListReason, FiredReason, BlackList, Fired


class ReasonAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'title'
    ]
    list_display_links = ['title']


class StateAdmin(admin.ModelAdmin):
    list_display = [
        'pk',
        'assessor',
        'reason'
    ]
    list_display_links = ['assessor']


admin.site.register(BlackListReason, ReasonAdmin)
admin.site.register(FiredReason, ReasonAdmin)
admin.site.register(BlackList, StateAdmin)
admin.site.register(Fired, StateAdmin)
