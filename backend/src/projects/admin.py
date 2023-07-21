from django.contrib import admin

from .models import Project


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    search_help_text = 'Введите название проекта'
    list_display = (
        'pk',
        'name',
        'owner',
        'date_of_create'
    )
    list_display_links = ('name',)
    list_filter = ('owner',)
    ordering = ('owner', 'name')


admin.site.register(Project, ProjectAdmin)
