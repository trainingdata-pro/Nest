from typing import Union, Dict, List, Iterable, Optional

from apps.assessors.models import Assessor, AssessorState
from apps.projects.models import Project
from .models import History, HistoryAction, HistoryAttribute


class HistoryManager:
    def new_assessor_history(self, assessor: Assessor, user: str) -> None:
        updates = self._get_updates_for_new_assessor(assessor, user=user)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def updated_assessor_history(self,
                                 old_assessor: Assessor,
                                 new_assessor: Assessor,
                                 user: str,
                                 old_projects: Optional[List[int]] = None,
                                 old_second_managers: Optional[List[int]] = None,
                                 completed_project: bool = False,
                                 state_reason: Optional[str] = None,
                                 unpin_reason: Optional[str] = None,
                                 use_none_action_for_state: bool = False) -> None:
        updates = self._get_updates_for_existing_assessor(
            old_assessor=old_assessor,
            new_assessor=new_assessor,
            user=user,
            old_projects=old_projects,
            old_second_managers=old_second_managers,
            completed_project=completed_project,
            state_reason=state_reason,
            unpin_reason=unpin_reason,
            use_none_action_for_state=use_none_action_for_state
        )
        histories = self.create_history_objects(new_assessor, updates)
        self.perform_create(histories)

    def return_from_vacation_system_updates(self) -> List[Dict]:
        return [
            {
                'attribute': HistoryAttribute.STATE,
                'old_value': AssessorState.get_value(AssessorState.VACATION),
                'new_value': AssessorState.get_value(AssessorState.AVAILABLE),
                **self.__get_base_action_data(user='-')
            }
        ]

    def _get_updates_for_new_assessor(self, assessor: Assessor, user: str) -> List[Dict]:
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
                                           user: str,
                                           old_projects: Optional[List[int]] = None,
                                           old_second_managers: Optional[List[int]] = None,
                                           completed_project: bool = False,
                                           state_reason: Optional[str] = None,
                                           unpin_reason: Optional[str] = None,
                                           use_none_action_for_state: bool = False) -> List[Dict]:
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
            elif new_assessor.manager is None and new_assessor.state in AssessorState.fired_states():
                action = HistoryAction.FIRE
                updates.append(
                    {
                        'attribute': HistoryAttribute.MANAGER,
                        'old_value': old_assessor.manager.full_name,
                        'new_value': None,
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
            if use_none_action_for_state:
                action = None
            else:
                if new_assessor.state == AssessorState.FREE_RESOURCE:
                    action = HistoryAction.ADD_TO_FREE_RESOURCE
                elif old_assessor.state == AssessorState.FREE_RESOURCE:
                    action = HistoryAction.RETURN_FROM_FREE_RESOURCE
                elif new_assessor.state == AssessorState.VACATION:
                    action = HistoryAction.TO_VACATION
                elif old_assessor.state == AssessorState.VACATION:
                    action = HistoryAction.FROM_VACATION
                elif new_assessor.state == AssessorState.FIRED or new_assessor.state == AssessorState.BLACKLIST:
                    action = HistoryAction.FIRE
                elif old_assessor.state == AssessorState.FIRED:
                    action = HistoryAction.TO_TEAM
                else:
                    action = None

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

    def _get_new_assessor_base_action_data(self, user: str) -> Dict:
        action = HistoryAction.CREATED
        return self.__get_base_action_data(user, action=action)

    @staticmethod
    def __get_base_action_data(user: str, action: Optional[str] = None) -> Dict:
        return {
            'action': action,
            'user': user
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
