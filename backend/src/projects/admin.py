from django.contrib import admin

from .models import Project


class ProjectAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    search_help_text = 'Введите название проекта'
    list_display = (
        'pk',
        'name',
        'managers',
        'status',
        'date_of_creation'
    )
    list_display_links = ('name',)
    list_filter = ('manager', 'status')
    ordering = ('manager__last_name', 'name')

    def get_queryset(self, request):
        return Project.objects.all().prefetch_related('manager')


admin.site.register(Project, ProjectAdmin)
