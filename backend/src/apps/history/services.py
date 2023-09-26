from typing import Union, Dict, List, Set, Iterable

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import Fired, BlackList
from apps.projects.models import Project
from apps.users.models import BaseUser
from .models import History, HistoryEvent


class HistoryManager:
    def new_assessor_history(self, assessor: Assessor) -> None:
        updates = self._check_new(assessor)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def updated_assessor_history(self,
                                 old_assessor: Assessor,
                                 updated_assessor: Assessor,
                                 old_projects: Union[Set[int], None],
                                 old_second_managers: Union[Set[int], None]) -> None:
        updates = self._check_updated(
            old_assessor=old_assessor,
            updated_assessor=updated_assessor,
            old_projects=old_projects,
            old_second_managers=old_second_managers
        )
        histories = self.create_history_objects(updated_assessor, updates)
        self.perform_create(histories)

    def fired_assessor_history(self,
                               assessor: Assessor,
                               manager: BaseUser,
                               fired_item: Union[Fired, BlackList],
                               blacklist: bool = False,
                               date_to_return: str = None) -> None:
        updates = self.fired_event(
            manager=manager,
            fired_item=fired_item,
            blacklist=blacklist,
            date_to_return=date_to_return
        )
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def returned_history(self, assessor: Assessor, manager: BaseUser) -> None:
        updates = self.returned_event(manager)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def vacation_history(self, assessor: Assessor, to_vacation: bool) -> None:
        updates = self.vacation_event(assessor.manager, to_vacation)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def free_resource_history(self, assessor: Assessor, free_resource: bool, reason: str = None) -> None:
        updates = self.free_resource_event(free_resource, free_resource_reason=reason)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def unpin_with_free_resources_history(self, assessor: Assessor, manager: BaseUser, reason: str) -> None:
        updates = self.remove_from_team_event(manager, reason)
        update_2 = self.free_resource_event(free_resource=True)
        updates.extend(update_2)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def unpin_with_new_manager(self,
                               assessor: Assessor,
                               old_manager: BaseUser,
                               new_manager: BaseUser,
                               reason: str) -> None:
        updates = self.remove_from_team_event(old_manager, reason)
        update_2 = self.add_to_team_event(new_manager)
        updates.extend(update_2)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def fired_event(self,
                    manager: BaseUser,
                    fired_item: Union[Fired, BlackList],
                    blacklist: bool = True,
                    date_to_return: str = None) -> List[Dict]:
        event = HistoryEvent.BLACKLIST if blacklist else HistoryEvent.LEFT
        return [
            {
                'event': event,
                'description': self.get_description(
                    event,
                    manager=manager,
                    fired_item=fired_item,
                    date_to_return=date_to_return
                )
            }
        ]

    def created_event(self) -> List[Dict]:
        event = HistoryEvent.CREATED
        return [
            {
                'event': event,
                'description': self.get_description(event)
            }
        ]

    def returned_event(self, manager: BaseUser) -> List[Dict]:
        event = HistoryEvent.RETURNED
        return [
            {
                'event': event,
                'description': self.get_description(event, manager=manager)
            }
        ]

    def vacation_event(self, manager: BaseUser, to_vacation: bool) -> List[Dict]:
        event = HistoryEvent.TO_VACATION if to_vacation else HistoryEvent.FROM_VACATION
        return [
            {
                'event': event,
                'description': self.get_description(event, manager=manager)
            }
        ]

    def free_resource_event(self, free_resource: bool, **reason) -> List[Dict]:
        event = HistoryEvent.ADD_TO_FREE_RESOURCE if free_resource else HistoryEvent.REMOVE_FROM_FREE_RESOURCE
        return [
            {
                'event': event,
                'description': self.get_description(event, **reason)
            }
        ]

    def remove_from_team_event(self, manager: BaseUser, reason: str) -> List[Dict]:
        event = HistoryEvent.REMOVE_FROM_MANAGER
        return [
            {
                'event': event,
                'description': self.get_description(
                    HistoryEvent.REMOVE_FROM_MANAGER,
                    manager=manager,
                    unpin_reason=reason
                )
            }
        ]

    def add_to_team_event(self, new_manager: BaseUser) -> List[Dict]:
        event = HistoryEvent.ADD_MANAGER
        return [
            {
                'event': event,
                'description': self.get_description(event, manager=new_manager)
            }
        ]

    @staticmethod
    def create_history_objects(assessor: Assessor, updates: List[Dict]) -> List[History]:
        return [History(
            assessor=assessor,
            event=item['event'],
            description=item['description']
        ) for item in updates]

    @staticmethod
    def perform_create(histories: List[History]) -> None:
        History.objects.bulk_create(histories)

    def _check_new(self, assessor: Assessor) -> List[Dict]:
        data = self.created_event()
        if assessor.manager:
            event = HistoryEvent.ADD_MANAGER
            data.append(
                {
                    'event': event,
                    'description': self.get_description(event, manager=assessor.manager)
                }
            )

        if assessor.projects.exists():
            event = HistoryEvent.ADD_PROJECT
            projects = assessor.projects.values_list('name', flat=True)
            data.append(
                {
                    'event': event,
                    'description': self.get_description(event, project=projects)
                }
            )

        if assessor.state == AssessorState.FREE_RESOURCE:
            event = HistoryEvent.ADD_TO_FREE_RESOURCE
            data.append(
                {
                    'event': event,
                    'description': self.get_description(event)
                }
            )

        return data

    def _check_updated(self,
                       old_assessor: Assessor,
                       updated_assessor: Assessor,
                       old_projects: Union[Set[int], None],
                       old_second_managers: Union[Set[int], None]) -> List[Dict]:
        data = []
        new_projects = set(updated_assessor.projects.values_list('pk', flat=True))
        new_second_managers = set(updated_assessor.second_manager.values_list('pk', flat=True))
        if old_second_managers is not None and new_second_managers != old_second_managers:
            removed_id = [manager_id for manager_id in old_second_managers if manager_id not in new_second_managers]
            if removed_id:
                event = HistoryEvent.REMOVE_ADDITIONAL_MANAGER
                removed = BaseUser.objects.filter(pk__in=removed_id)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, second_manager=removed)
                    }
                )

            added_id = [manager_id for manager_id in new_second_managers if manager_id not in old_second_managers]
            if added_id:
                event = HistoryEvent.ADD_ADDITIONAL_MANAGER
                added = BaseUser.objects.filter(pk__in=added_id)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, second_manager=added)
                    }
                )

        if old_projects is not None and new_projects != old_projects:
            removed_id = [project_id for project_id in old_projects if project_id not in new_projects]
            if removed_id:
                event = HistoryEvent.REMOVE_PROJECT
                removed = Project.objects.filter(pk__in=removed_id).values_list('name', flat=True)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, project=removed)
                    }
                )

            added_id = [project_id for project_id in new_projects if project_id not in old_projects]
            if added_id:
                event = HistoryEvent.ADD_PROJECT
                added = Project.objects.filter(pk__in=added_id).values_list('name', flat=True)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, project=added)
                    }
                )

        if old_assessor.manager != updated_assessor.manager:
            # if old_assessor.manager is not None:
            #     event = HistoryEvents.REMOVE_FROM_MANAGER
            #     data.append(
            #         {
            #             'event': event,
            #             'description': self.get_description(event, manager=old_assessor.manager)
            #         }
            #     )
            if updated_assessor.manager is not None:
                event = HistoryEvent.ADD_MANAGER
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, manager=updated_assessor.manager)
                    }
                )

        # if updated_assessor.state != old_assessor.state:
        #     if updated_assessor.state == AssessorState.BLACKLIST:
        #         event = HistoryEvents.BLACKLIST
        #         blacklist_item = BlackList.objects.get(assessor=updated_assessor)
        #         data.append(
        #             {
        #                 'event': event,
        #                 'description': self.get_description(event,
        #                                                     manager=old_assessor.manager,
        #                                                     fired_item=blacklist_item)
        #             }
        #         )
        #     elif updated_assessor.state == AssessorState.FIRED:
        #         event = HistoryEvents.LEFT
        #         fired_item = Fired.objects.get(assessor=updated_assessor)
        #         data.append(
        #             {
        #                 'event': event,
        #                 'description': self.get_description(event,
        #                                                     manager=old_assessor.manager,
        #                                                     fired_item=fired_item)
        #             }
        #         )
        #     elif updated_assessor.state in AssessorState.work_states():
        #         data.extend(self.returned_event(manager=updated_assessor.manager))

        return data

    def get_description(self, event: str, **kwargs) -> str:
        return self.__create_description(event, **kwargs)

    @staticmethod
    def __create_description(event: str,
                             manager: BaseUser = None,
                             project: Iterable[str] = None,
                             second_manager: Iterable[BaseUser] = None,
                             fired_item: Union[Fired, BlackList] = None,
                             free_resource_reason: str = None,
                             unpin_reason: str = None,
                             date_to_return: str = None) -> str:
        projects = ', '.join(project) if project is not None else None
        second_managers = ', '.join([
            f'{manager.full_name} (@{manager.username})' for manager in second_manager
        ]) if second_manager is not None else None
        manager_info = f'{manager.full_name}' if manager else None
        if event == HistoryEvent.CREATED:
            description = 'Добавлен в систему'
        elif event == HistoryEvent.BLACKLIST:
            description = f'Добавлен в ЧС менеджером {manager_info} по ' \
                          f'причине "{fired_item.reason}"'
        elif event == HistoryEvent.LEFT:
            date = date_to_return if date_to_return else '-'
            description = f'Уволен по собственному желанию менеджером {manager_info} ' \
                          f'по причине "{fired_item.reason}". Дата возможного возврата: {date}'
        elif event == HistoryEvent.RETURNED:
            description = f'Удален из уволенных по собственному желанию ' \
                          f'и закреплен за менеджером {manager_info}'
        elif event == HistoryEvent.TO_VACATION:
            description = f'Отправлен в отпуск менеджером {manager.full_name}'
        elif event == HistoryEvent.FROM_VACATION:
            description = f'Вернулся из отпуска в команду менеджера {manager.full_name}'
        elif event == HistoryEvent.ADD_MANAGER:
            description = f'Закреплен за менеджером {manager_info}'
        elif event == HistoryEvent.REMOVE_FROM_MANAGER:
            description = f'Откреплен от менеджера {manager_info} по причине "{unpin_reason}"'
        elif event == HistoryEvent.ADD_PROJECT:
            description = f'Назначен на проект(ы): {projects}'
        elif event == HistoryEvent.REMOVE_PROJECT:
            description = f'Удален с проекта(ов): {projects}'
        elif event == HistoryEvent.ADD_TO_FREE_RESOURCE:
            description = 'Добавлен в свободные ресурсы'
            if free_resource_reason is not None:
                description += f' по причине "{free_resource_reason}"'
        elif event == HistoryEvent.REMOVE_FROM_FREE_RESOURCE:
            description = 'Удален из свободных ресурсов'
        elif event == HistoryEvent.ADD_ADDITIONAL_MANAGER:
            description = f'Взят из свободных ресурсов менеджером {second_managers} (доп. менеджер)'
        elif event == HistoryEvent.REMOVE_ADDITIONAL_MANAGER:
            description = f'Откреплен доп. менеджер {second_managers}'
        else:
            raise ValueError('Invalid event.')

        return description


history = HistoryManager()
