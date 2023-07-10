from django.contrib import admin

from .models import Project


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'owner', 'date_of_create')
    list_display_links = ('name',)


admin.site.register(Project, ProjectAdmin)
