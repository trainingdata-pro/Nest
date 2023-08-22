from apps.assessors.models import Assessor
from apps.projects.models import Project
from apps.users.models import Manager
from .models import History, HistoryEvents


def create_description(event: str,
                       assessor: Assessor,
                       manager: Manager,
                       project: Project = None,
                       additional_manager: Manager = None) -> str:
    description = f'Исполнитель {assessor.full_name} (@{assessor.username})'
    manager_info = f'{manager.full_name} (@{manager.user.username})'
    if event == HistoryEvents.CREATED:
        description += f' добавлен в систему.'
    elif event == HistoryEvents.DELETED:
        description += f' удален из команды менеджером {manager_info}'
    elif event == HistoryEvents.BLACKLIST:
        description += f' добавлен в ЧС менеджером {manager_info}'
        # TODO добавить причину
    elif event == HistoryEvents.LEFT:
        description += f' уволен по собственному желанию менеджером {manager_info}'
        # TODO добавить причину
    elif event == HistoryEvents.RETURNED:
        description += f' возвращен в команду менеджера {manager_info}'
    elif event == HistoryEvents.RETURNED_FROM_BL:
        description += f' возвращен из ЧС менеджером {manager_info}'
    elif event == HistoryEvents.ADD_MANAGER:
        description += f' закреплен за менеджером {manager_info}'
    elif event == HistoryEvents.ADD_PROJECT:
        description += f' назначен на проект {project.name}'
    elif event == HistoryEvents.REMOVE_PROJECT:
        description += f' удален с проекта {project.name}'
    elif event == HistoryEvents.ADD_ADDITIONAL_PROJECT:
        description += f' назначен на проект {project.name} доп. менеджера'
    elif event == HistoryEvents.REMOVE_ADDITIONAL_PROJECT:
        description += f' удален с проекта {project.name} доп. менеджера'
    elif event == HistoryEvents.ADD_TO_FREE_RESOURCE:
        description += f' добавлен в свободные ресурсы'
    elif event == HistoryEvents.REMOVE_FROM_FREE_RESOURCE:
        description += f' удален из свободных ресурсов'
    elif event == HistoryEvents.ADD_ADDITIONAL_MANAGER:
        description += f' добавлен доп. менеджер ' \
                       f'{additional_manager.full_name} (@{additional_manager.user.username})'
    elif event == HistoryEvents.REMOVE_ADDITIONAL_MANAGER:
        description += f' удален доп. менеджер ' \
                       f'{additional_manager.full_name} (@{additional_manager.user.username})'
    else:
        raise ValueError('Invalid event.')

    return description


def create_history(event: str,
                   assessor: Assessor,
                   manager: Manager,
                   project: Project = None,
                   additional_manager: Manager = None) -> History:
    description = create_description(
        event=event,
        assessor=assessor,
        manager=manager,
        project=project,
        additional_manager=additional_manager
    )
    history = History.objects.create(
        event=event,
        assessor=Assessor,
        description=description
    )

    return history
