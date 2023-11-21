from django.contrib import admin

from .models import Assessor, Skill, AssessorCredentials


@admin.register(Assessor)
class AssessorAdmin(admin.ModelAdmin):
    search_fields = [
        'username',
        'last_name',
        'first_name',
        'middle_name'
    ]
    search_help_text = 'Введите username или ФИО исполнителя'
    list_display = [
        'pk',
        'username',
        'last_name',
        'first_name',
        'middle_name',
        'country',
        'manager',
        'state'
    ]
    list_filter = [
        'manager',
        'state'
    ]
    list_display_links = ['username']
    ordering = ['manager__last_name', 'last_name']

    def get_queryset(self, request):
        return (Assessor.objects.all()
                .select_related('manager')
                .prefetch_related('projects')
                .order_by('manager__last_name', 'last_name'))


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    search_fields = ['title']
    search_help_text = 'Введите название навыка'
    list_display = ['pk', 'title']
    list_display_links = ['title']


@admin.register(AssessorCredentials)
class AssessorCredentialsAdmin(admin.ModelAdmin):
    search_fields = [
        'assessor__username',
        'assessor__last_name',
        'assessor__first_name',
        'assessor__middle_name'
    ]
    search_help_text = 'Введите username или ФИО исполнителя'
    list_display = ['pk', 'assessor', 'tool', 'login', 'password']
    list_display_links = ['assessor']
    list_filter = ['tool']
