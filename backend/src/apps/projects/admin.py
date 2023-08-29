from django.contrib import admin

from .models import ProjectTag, Project


class ProjectTagAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    list_display_links = ['name']
    ordering = ['name']


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ['name']
    search_help_text = 'Введите название проекта'
    list_display = [
        'pk',
        'asana_id',
        'name',
        'managers',
        'status',
        'date_of_creation',
        'date_of_completion'
    ]
    list_display_links = ['name']
    list_filter = ['manager', 'status']
    ordering = ['name']

    def get_queryset(self, request):
        return Project.objects.all().prefetch_related('manager')


admin.site.register(ProjectTag, ProjectTagAdmin)
admin.site.register(Project, ProjectAdmin)
