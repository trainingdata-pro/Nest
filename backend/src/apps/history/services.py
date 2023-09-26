from typing import Union, Dict, List, Set, Iterable, Optional

from apps.assessors.models import Assessor, AssessorState
from apps.fired.models import Fired, BlackList
from apps.projects.models import Project
from apps.users.models import BaseUser
from .models import History, HistoryAction, HistoryAttribute


class HistoryManager2:
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
        event = HistoryAction.BLACKLIST if blacklist else HistoryAction.LEFT
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
        event = HistoryAction.CREATED
        return [
            {
                'event': event,
                'description': self.get_description(event)
            }
        ]

    def returned_event(self, manager: BaseUser) -> List[Dict]:
        event = HistoryAction.RETURNED
        return [
            {
                'event': event,
                'description': self.get_description(event, manager=manager)
            }
        ]

    def vacation_event(self, manager: BaseUser, to_vacation: bool) -> List[Dict]:
        event = HistoryAction.TO_VACATION if to_vacation else HistoryAction.FROM_VACATION
        return [
            {
                'event': event,
                'description': self.get_description(event, manager=manager)
            }
        ]

    def free_resource_event(self, free_resource: bool, **reason) -> List[Dict]:
        event = HistoryAction.ADD_TO_FREE_RESOURCE if free_resource else HistoryAction.REMOVE_FROM_FREE_RESOURCE
        return [
            {
                'event': event,
                'description': self.get_description(event, **reason)
            }
        ]

    # def remove_from_team_event(self, manager: BaseUser, reason: str) -> List[Dict]:
    #     event = HistoryEvent.REMOVE_FROM_MANAGER
    #     return [
    #         {
    #             'event': event,
    #             'description': self.get_description(
    #                 HistoryEvent.REMOVE_FROM_MANAGER,
    #                 manager=manager,
    #                 unpin_reason=reason
    #             )
    #         }
    #     ]

    # def add_to_team_event(self, new_manager: BaseUser) -> List[Dict]:
    #     event = HistoryEvent.ADD_MANAGER
    #     return [
    #         {
    #             'event': event,
    #             'description': self.get_description(event, manager=new_manager)
    #         }
    #     ]

    @staticmethod
    def create_history_objects(assessor: Assessor, updates: List[Dict]) -> List[History]:
        return [History(
            assessor=assessor,
            attribute=item.get('attribute'),
            event=item.get('event'),
            old_value=item.get('old_value'),
            new_value=item.get('new_value'),
            reason=item.get('reason'),
            user=item.get('user')
        ) for item in updates]

    @staticmethod
    def perform_create(histories: List[History]) -> None:
        History.objects.bulk_create(histories)

    def _new_assessor_updates(self, assessor: Assessor):
        updates = []

    # def _check_new(self, assessor: Assessor) -> List[Dict]:
    #     data = self.created_event()
    #     if assessor.manager:
    #         event = HistoryEvent.ADD_MANAGER
    #         data.append(
    #             {
    #                 'event': event,
    #                 'description': self.get_description(event, manager=assessor.manager)
    #             }
    #         )
    #
    #     if assessor.projects.exists():
    #         event = HistoryEvent.ADD_PROJECT
    #         projects = assessor.projects.values_list('name', flat=True)
    #         data.append(
    #             {
    #                 'event': event,
    #                 'description': self.get_description(event, project=projects)
    #             }
    #         )
    #
    #     if assessor.state == AssessorState.FREE_RESOURCE:
    #         event = HistoryEvent.ADD_TO_FREE_RESOURCE
    #         data.append(
    #             {
    #                 'event': event,
    #                 'description': self.get_description(event)
    #             }
    #         )
    #
    #     return data

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
                event = HistoryAction.REMOVE_ADDITIONAL_MANAGER
                removed = BaseUser.objects.filter(pk__in=removed_id)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, second_manager=removed)
                    }
                )

            added_id = [manager_id for manager_id in new_second_managers if manager_id not in old_second_managers]
            if added_id:
                event = HistoryAction.ADD_ADDITIONAL_MANAGER
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
                event = HistoryAction.REMOVE_PROJECT
                removed = Project.objects.filter(pk__in=removed_id).values_list('name', flat=True)
                data.append(
                    {
                        'event': event,
                        'description': self.get_description(event, project=removed)
                    }
                )

            added_id = [project_id for project_id in new_projects if project_id not in old_projects]
            if added_id:
                event = HistoryAction.ADD_PROJECT
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
                event = HistoryAction.ADD_MANAGER
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

    # @staticmethod
    # def __create_description(event: str,
    #                          manager: BaseUser = None,
    #                          project: Iterable[str] = None,
    #                          second_manager: Iterable[BaseUser] = None,
    #                          fired_item: Union[Fired, BlackList] = None,
    #                          free_resource_reason: str = None,
    #                          unpin_reason: str = None,
    #                          date_to_return: str = None) -> str:
    #     projects = ', '.join(project) if project is not None else None
    #     second_managers = ', '.join([
    #         f'{manager.full_name} (@{manager.username})' for manager in second_manager
    #     ]) if second_manager is not None else None
    #     manager_info = f'{manager.full_name}' if manager else None
    #     if event == HistoryEvent.CREATED:
    #         description = 'Добавлен в систему'
    #     elif event == HistoryEvent.BLACKLIST:
    #         description = f'Добавлен в ЧС менеджером {manager_info} по ' \
    #                       f'причине "{fired_item.reason}"'
    #     elif event == HistoryEvent.LEFT:
    #         date = date_to_return if date_to_return else '-'
    #         description = f'Уволен по собственному желанию менеджером {manager_info} ' \
    #                       f'по причине "{fired_item.reason}". Дата возможного возврата: {date}'
    #     elif event == HistoryEvent.RETURNED:
    #         description = f'Удален из уволенных по собственному желанию ' \
    #                       f'и закреплен за менеджером {manager_info}'
    #     elif event == HistoryEvent.TO_VACATION:
    #         description = f'Отправлен в отпуск менеджером {manager.full_name}'
    #     elif event == HistoryEvent.FROM_VACATION:
    #         description = f'Вернулся из отпуска в команду менеджера {manager.full_name}'
    #     elif event == HistoryEvent.ADD_MANAGER:
    #         description = f'Закреплен за менеджером {manager_info}'
    #     elif event == HistoryEvent.REMOVE_FROM_MANAGER:
    #         description = f'Откреплен от менеджера {manager_info} по причине "{unpin_reason}"'
    #     elif event == HistoryEvent.ADD_PROJECT:
    #         description = f'Назначен на проект(ы): {projects}'
    #     elif event == HistoryEvent.REMOVE_PROJECT:
    #         description = f'Удален с проекта(ов): {projects}'
    #     elif event == HistoryEvent.ADD_TO_FREE_RESOURCE:
    #         description = 'Добавлен в свободные ресурсы'
    #         if free_resource_reason is not None:
    #             description += f' по причине "{free_resource_reason}"'
    #     elif event == HistoryEvent.REMOVE_FROM_FREE_RESOURCE:
    #         description = 'Удален из свободных ресурсов'
    #     elif event == HistoryEvent.ADD_ADDITIONAL_MANAGER:
    #         description = f'Взят из свободных ресурсов менеджером {second_managers} (доп. менеджер)'
    #     elif event == HistoryEvent.REMOVE_ADDITIONAL_MANAGER:
    #         description = f'Откреплен доп. менеджер {second_managers}'
    #     else:
    #         raise ValueError('Invalid event.')

    # return description

    @staticmethod
    def __create_description():
        pass


class HistoryManager:
    def new_assessor_history(self, assessor: Assessor, user: BaseUser) -> None:
        updates = self._get_updates_for_new_assessor(assessor, user=user)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def updated_assessor_history(self,
                                 old_assessor: Assessor,
                                 new_assessor: Assessor,
                                 user: BaseUser,
                                 old_projects: Optional[List[int]] = None,
                                 old_second_managers: Optional[List[int]] = None,
                                 completed_project: bool = False,
                                 state_reason: Optional[str] = None,
                                 unpin_reason: Optional[str] = None) -> None:
        updates = self._get_updates_for_existing_assessor(
            old_assessor=old_assessor,
            new_assessor=new_assessor,
            user=user,
            old_projects=old_projects,
            old_second_managers=old_second_managers,
            completed_project=completed_project,
            state_reason=state_reason,
            unpin_reason=unpin_reason
        )
        histories = self.create_history_objects(new_assessor, updates)
        self.perform_create(histories)

    def _get_updates_for_new_assessor(self, assessor: Assessor, user: BaseUser) -> List[Dict]:
        updates = [
            {
                'attribute': HistoryAttribute.FULL_NAME,
                'new_value': assessor.full_name,
                **self._get_new_assessor_base_action_data(user)
            },
            {
                'attribute': HistoryAttribute.USERNAME,
                'new_value': assessor.username,
                **self._get_new_assessor_base_action_data(user)
            },
            {
                'attribute': HistoryAttribute.MANAGER,
                'new_value': assessor.manager.full_name,
                **self._get_new_assessor_base_action_data(user)
            },
            {
                'attribute': HistoryAttribute.STATE,
                'new_value': AssessorState.get_value(assessor.state),
                **self._get_new_assessor_base_action_data(user)
            }
        ]
        return updates

    def _get_updates_for_existing_assessor(self,
                                           old_assessor: Assessor,
                                           new_assessor: Assessor,
                                           user: BaseUser,
                                           old_projects: Optional[List[int]] = None,
                                           old_second_managers: Optional[List[int]] = None,
                                           completed_project: bool = False,
                                           state_reason: Optional[str] = None,
                                           unpin_reason: Optional[str] = None) -> List[Dict]:
        updates = []
        if old_assessor.last_name != new_assessor.last_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.last_name,
                    'new_value': new_assessor.last_name,
                    **self.__get_base_action_data(user)
                }
            )

        if old_assessor.first_name != new_assessor.first_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.first_name,
                    'new_value': new_assessor.first_name,
                    **self.__get_base_action_data(user)
                }
            )

        if old_assessor.middle_name != new_assessor.middle_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.middle_name,
                    'new_value': new_assessor.middle_name,
                    **self.__get_base_action_data(user)
                }
            )

        if old_assessor.username != new_assessor.username:
            updates.append(
                {
                    'attribute': HistoryAttribute.USERNAME,
                    'old_value': old_assessor.username,
                    'new_value': new_assessor.username,
                    **self.__get_base_action_data(user)
                }
            )

        if old_assessor.manager != new_assessor.manager:
            if new_assessor.manager is None and new_assessor.state == AssessorState.FREE_RESOURCE:
                action = HistoryAction.UNPIN
                updates.append(
                    {
                        'attribute': HistoryAttribute.MANAGER,
                        'old_value': old_assessor.manager.full_name,
                        'new_value': new_assessor.manager,
                        'reason': unpin_reason,
                        **self.__get_base_action_data(user, action=action)
                    }
                )

            elif old_assessor.manager is None and new_assessor.manager is not None:
                action = HistoryAction.TO_TEAM
                updates.append(
                    {
                        'attribute': HistoryAttribute.MANAGER,
                        'old_value': old_assessor.manager,
                        'new_value': new_assessor.manager.full_name,
                        **self.__get_base_action_data(user, action=action)
                    }
                )
            elif old_assessor.manager is not None and new_assessor.manager is not None:
                action1 = HistoryAction.UNPIN
                action2 = HistoryAction.TO_TEAM
                updates.extend(
                    [
                        {
                            'attribute': HistoryAttribute.MANAGER,
                            'old_value': old_assessor.manager.full_name,
                            'new_value': None,
                            'reason': unpin_reason,
                            **self.__get_base_action_data(user, action=action1)
                        },
                        {
                            'attribute': HistoryAttribute.MANAGER,
                            'old_value': None,
                            'new_value': new_assessor.manager.full_name,
                            **self.__get_base_action_data(user, action=action2)
                        }
                    ]
                )

        new_projects = list(new_assessor.projects.values_list('pk', flat=True))
        if old_projects is not None and new_projects != old_projects:
            removed_id = [project_id for project_id in old_projects if project_id not in new_projects]
            added_id = [project_id for project_id in new_projects if project_id not in old_projects]
            old_projects_objects = Project.objects.filter(pk__in=old_projects)
            old_projects_names = self.__convert_for_db(
                old_projects_objects.values_list('name', flat=True)
            )
            new_projects_without_removed = old_projects_objects.exclude(pk__in=removed_id)
            new_projects_without_removed_names = self.__convert_for_db(
                new_projects_without_removed.values_list('name', flat=True)
            )
            current_projects = self.__convert_for_db(
                new_assessor.projects.values_list('name', flat=True)
            )

            if removed_id:
                action = HistoryAction.COMPLETE_PROJECT if completed_project else HistoryAction.REMOVE_PROJECT
                updates.append(
                    {
                        'attribute': HistoryAttribute.PROJECT,
                        'old_value': old_projects_names,
                        'new_value': new_projects_without_removed_names,
                        'reason': state_reason,
                        **self.__get_base_action_data(user, action=action)
                    }
                )

            if added_id:
                new_assessor_second_managers = list(new_assessor.second_manager.values_list('pk', flat=True))
                if new_assessor_second_managers != old_second_managers:
                    action = HistoryAction.RENT
                else:
                    action = HistoryAction.ADD_PROJECT
                updates.append(
                    {
                        'attribute': HistoryAttribute.PROJECT,
                        'old_value': new_projects_without_removed_names,
                        'new_value': current_projects,
                        **self.__get_base_action_data(user, action=action)
                    }
                )

        if old_assessor.state != new_assessor.state:
            action = None
            if new_assessor.state == AssessorState.FREE_RESOURCE:
                action = HistoryAction.ADD_TO_FREE_RESOURCE
            elif new_assessor.state == AssessorState.VACATION:
                action = HistoryAction.TO_VACATION
            elif old_assessor.state == AssessorState.VACATION:
                action = HistoryAction.FROM_VACATION
            elif new_assessor.state == AssessorState.FIRED:
                action = HistoryAction.FIRE

            updates.append(
                {
                    'attribute': HistoryAttribute.STATE,
                    'old_value': AssessorState.get_value(old_assessor.state),
                    'new_value': AssessorState.get_value(new_assessor.state),
                    'reason': state_reason,
                    **self.__get_base_action_data(user, action=action)
                }
            )

        return updates

    def _get_new_assessor_base_action_data(self, user: BaseUser) -> Dict:
        action = HistoryAction.CREATED
        return self.__get_base_action_data(user, action=action)

    @staticmethod
    def __get_base_action_data(user: BaseUser, action: Optional[str] = None) -> Dict:
        return {
            'action': action,
            'user': user.full_name
        }

    @staticmethod
    def __convert_for_db(data: Iterable) -> Union[str, None]:
        if data:
            return '; '.join(data)
        return None

    @staticmethod
    def create_history_objects(assessor: Assessor, updates: List[Dict]) -> List[History]:
        return [History(
            assessor=assessor,
            attribute=item.get('attribute'),
            action=item.get('action'),
            old_value=item.get('old_value'),
            new_value=item.get('new_value'),
            reason=item.get('reason'),
            user=item.get('user')
        ) for item in updates]

    @staticmethod
    def perform_create(histories: List[History]) -> None:
        History.objects.bulk_create(histories)


history = HistoryManager()
