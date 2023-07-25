from django.contrib import admin

from .models import Project


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    search_help_text = 'Введите название проекта'
    list_display = (
        'pk',
        'name',
        'manager',
        'status',
        'date_of_creation'
    )
    list_display_links = ('name',)
    list_filter = ('manager', 'status')
    ordering = ('manager', 'name')


admin.site.register(Project, ProjectAdmin)
