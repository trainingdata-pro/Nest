from typing import Union, Dict, List, Set, Iterable

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import Fired, BlackList
from apps.projects.models import Project
from apps.users.models import Manager
from .models import History, HistoryEvents


class HistoryManager:
    def new_assessor_history(self, assessor: Assessor) -> None:
        updates = self.__check_new(assessor)
        self.__create_history(assessor, updates)

    def updated_assessor_history(self,
                                 old_assessor: Assessor,
                                 updated_assessor: Assessor,
                                 old_projects: Set[int],
                                 old_second_managers: Set[int]) -> None:
        updates = self.__check_updated(
            old_assessor=old_assessor,
            updated_assessor=updated_assessor,
            old_projects=old_projects,
            old_second_managers=old_second_managers
        )
        self.__create_history(updated_assessor, updates)

    def fired_assessor_history(self,
                               assessor: Assessor,
                               manager: Manager,
                               fired_item: Union[Fired, BlackList],
                               blacklist: bool = False) -> None:
        updates = self.__fired_event(manager=manager, fired_item=fired_item, blacklist=blacklist)
        self.__create_history(assessor, updates)

    def returned_history(self, assessor: Assessor, manager: Manager) -> None:
        updates = self.__returned_event(manager)
        self.__create_history(assessor, updates)

    @staticmethod
    def __create_history(assessor: Assessor, updates: List[Dict]) -> None:
        histories = [History(
            assessor=assessor,
            event=item['event'],
            description=item['description']
        ) for item in updates]

        History.objects.bulk_create(histories)

    def __check_new(self, assessor: Assessor) -> List[Dict]:
        data = self.__created_event()
        if assessor.manager:
            event = HistoryEvents.ADD_MANAGER
            data.append(
                {
                    'event': event,
                    'description': self.__get_description(event, manager=assessor.manager)
                }
            )

        if assessor.projects.exists():
            event = HistoryEvents.ADD_PROJECT
            data.append(
                {
                    'event': event,
                    'description': self.__get_description(event, project=assessor.projects.all())
                }
            )

        if assessor.is_free_resource:
            event = HistoryEvents.ADD_TO_FREE_RESOURCE
            data.append(
                {
                    'event': event,
                    'description': self.__get_description(event)
                }
            )

        return data

    def __check_updated(self,
                        old_assessor: Assessor,
                        updated_assessor: Assessor,
                        old_projects: Set[int],
                        old_second_managers: Set[int]) -> List[Dict]:
        data = []
        new_projects = set(updated_assessor.projects.values_list('pk', flat=True))
        new_second_managers = set(updated_assessor.second_manager.values_list('pk', flat=True))
        if old_assessor.manager != updated_assessor.manager:
            if old_assessor.manager is not None:
                event = HistoryEvents.REMOVE_FROM_MANAGER
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, manager=old_assessor.manager)
                    }
                )
            if updated_assessor.manager is not None:
                event = HistoryEvents.ADD_MANAGER
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, manager=updated_assessor.manager)
                    }
                )

        if old_assessor.is_free_resource != updated_assessor.is_free_resource:
            if updated_assessor.is_free_resource is True:
                event = HistoryEvents.ADD_TO_FREE_RESOURCE
            else:
                event = HistoryEvents.REMOVE_FROM_FREE_RESOURCE

            data.append(
                {
                    'event': event,
                    'description': self.__get_description(event)
                }
            )

        if new_second_managers != old_second_managers:
            removed_id = [manager_id for manager_id in old_second_managers if manager_id not in new_second_managers]
            if removed_id:
                event = HistoryEvents.REMOVE_ADDITIONAL_MANAGER
                removed = Manager.objects.filter(pk__in=removed_id)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, second_manager=removed)
                    }
                )

            added_id = [manager_id for manager_id in new_second_managers if manager_id not in old_second_managers]
            if added_id:
                event = HistoryEvents.ADD_ADDITIONAL_MANAGER
                added = Manager.objects.filter(pk__in=added_id)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, second_manager=added)
                    }
                )

        if new_projects != old_projects:
            removed_id = [project_id for project_id in old_projects if project_id not in new_projects]
            if removed_id:
                event = HistoryEvents.REMOVE_PROJECT
                removed = Project.objects.filter(pk__in=removed_id).values_list('name', flat=True)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, project=removed)
                    }
                )

            added_id = [project_id for project_id in new_projects if project_id not in old_projects]
            if added_id:
                event = HistoryEvents.ADD_PROJECT
                added = Project.objects.filter(pk__in=added_id).values_list('name', flat=True)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event, project=added)
                    }
                )

        if updated_assessor.state != old_assessor.state:
            if updated_assessor.state == AssessorState.BLACKLIST:
                event = HistoryEvents.BLACKLIST
                blacklist_item = BlackList.objects.get(assessor=updated_assessor)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event,
                                                              manager=old_assessor.manager,
                                                              fired_item=blacklist_item)
                    }
                )
            elif updated_assessor.state == AssessorState.FIRED:
                event = HistoryEvents.LEFT
                fired_item = Fired.objects.get(assessor=updated_assessor)
                data.append(
                    {
                        'event': event,
                        'description': self.__get_description(event,
                                                              manager=old_assessor.manager,
                                                              fired_item=fired_item)
                    }
                )
            elif updated_assessor.state == AssessorState.WORK:
                data.extend(self.__returned_event(manager=updated_assessor.manager))

        return data

    def __fired_event(self,
                      manager: Manager,
                      fired_item: Union[Fired, BlackList],
                      blacklist: bool = True) -> List[Dict]:
        event = HistoryEvents.BLACKLIST if blacklist else HistoryEvents.LEFT
        return [
            {
                'event': event,
                'description': self.__get_description(event, manager=manager, fired_item=fired_item)
            }
        ]

    def __created_event(self) -> List[Dict]:
        event = HistoryEvents.CREATED
        return [
            {
                'event': event,
                'description': self.__create_description(event)
            }
        ]

    def __returned_event(self, manager: Manager) -> List[Dict]:
        event = HistoryEvents.RETURNED
        return [
            {
                'event': event,
                'description': self.__create_description(event, manager=manager)
            }
        ]

    def __get_description(self, event: str, **kwargs) -> str:
        return self.__create_description(event, **kwargs)

    @staticmethod
    def __create_description(event: str,
                             manager: Manager = None,
                             project: Iterable[str] = None,
                             second_manager: Iterable[Manager] = None,
                             fired_item: Union[Fired, BlackList] = None) -> str:
        projects = ', '.join(project) if project is not None else None
        second_managers = ', '.join([
            f'{manager.full_name} (@{manager.user.username})' for manager in second_manager
        ]) if second_manager is not None else None
        manager_info = f'{manager.full_name}' if manager else None
        if event == HistoryEvents.CREATED:
            description = 'Добавлен в систему'
        elif event == HistoryEvents.BLACKLIST:
            description = f'Добавлен в ЧС менеджером {manager_info} по ' \
                          f'причине "{fired_item.reason}"'
        elif event == HistoryEvents.LEFT:
            description = f'Уволен по собственному желанию менеджером {manager_info} ' \
                          f'по причине "{fired_item.reason}"'
        elif event == HistoryEvents.RETURNED:
            description = f'Удален из уволенных по собственному желанию ' \
                          f'и закреплен за менеджером {manager_info}'
        elif event == HistoryEvents.ADD_MANAGER:
            description = f'Закреплен за менеджером {manager_info}'
        elif event == HistoryEvents.REMOVE_FROM_MANAGER:
            description = f'Откреплен от менеджера {manager_info}'
        elif event == HistoryEvents.ADD_PROJECT:
            description = f'Назначен на проект(ы): {projects}'
        elif event == HistoryEvents.REMOVE_PROJECT:
            description = f'Удален с проекта(ов): {projects}'
        elif event == HistoryEvents.ADD_TO_FREE_RESOURCE:
            description = 'Добавлен в свободные ресурсы'
        elif event == HistoryEvents.REMOVE_FROM_FREE_RESOURCE:
            description = 'Удален из свободных ресурсов'
        elif event == HistoryEvents.ADD_ADDITIONAL_MANAGER:
            description = f'Взят из свободных ресурсов менеджером {second_managers} (доп. менеджер)'
        elif event == HistoryEvents.REMOVE_ADDITIONAL_MANAGER:
            description = f'Откреплен доп. менеджер {second_managers}'
        else:
            raise ValueError('Invalid event.')

        return description


history = HistoryManager()
