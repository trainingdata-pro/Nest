from django.contrib import admin

from . import models


class AssessorAdmin(admin.ModelAdmin):
    search_fields = (
        'username',
        'last_name',
        'first_name',
        'middle_name'
    )
    search_help_text = 'Введите username или ФИО исполнителя'
    list_display = (
        'pk',
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'country',
        'manager',
        'is_free_resource',
        'status',
        'state',
        'all_projects'
    )
    list_filter = (
        'is_free_resource',
        'manager',
        'projects',
        'state'
    )
    list_display_links = ('username',)
    ordering = ('manager__last_name', 'last_name')

    def get_queryset(self, request):
        return (models.Assessor.objects.all()
                .select_related('manager')
                .prefetch_related('projects')
                .order_by('manager__last_name', 'last_name'))


class SkillAdmin(admin.ModelAdmin):
    search_fields = ('title',)
    search_help_text = 'Введите название навыка'
    list_display = ('pk', 'title')


class WorkingHoursAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'assessor',
        'total',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    )
    list_display_links = ('assessor',)


admin.site.register(models.Assessor, AssessorAdmin)
admin.site.register(models.Skill, SkillAdmin)
admin.site.register(models.WorkingHours, WorkingHoursAdmin)
