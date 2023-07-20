from django.contrib import admin

from .models import Assessor


class AssessorAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'manager',
        'is_free_resource',
        'is_busy'
    )
    list_display_links = ('username',)
    ordering = ['pk']


admin.site.register(Assessor, AssessorAdmin)
