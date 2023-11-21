from typing import Union, Dict, List, Iterable, Optional

from apps.assessors.models import Assessor, AssessorState
from apps.projects.models import Project
from apps.history.models import History, HistoryAction, HistoryAttribute
from core.mixins import BaseService


class HistoryService(BaseService):
    model = History

    def get_last_assessor_manager(self, assessor_id: int) -> Union[str, None]:
        """
        Get the latest assessor manager.
        :param assessor_id: Unique assessor ID
        :return
        The latest value, or "None" if the value doesn't exist.
        """
        return self.__get_last_obj(assessor_id, attribute=HistoryAttribute.MANAGER)

    def get_last_assessor_project(self, assessor_id: int) -> Union[str, None]:
        """
        Get the latest assessor project.
        :param assessor_id: Unique assessor ID
        :return
        The latest value, or "None" if the value doesn't exist.
        """
        return self.__get_last_obj(assessor_id, attribute=HistoryAttribute.PROJECT)

    def new_assessor_history(self, assessor: Assessor, user: str) -> None:
        """
        Create history for a new assessor.
        :param assessor: New assessor object.
        :param user: A string indicating who made the update.
        """
        updates = self._get_updates_for_new_assessor(assessor, user=user)
        histories = self.create_history_objects(assessor, updates)
        self.perform_create(histories)

    def updated_assessor_history(
            self,
            old_assessor: Assessor,
            new_assessor: Assessor,
            user: str,
            old_projects: Optional[List[int]] = None,
            old_second_managers: Optional[List[int]] = None,
            completed_project: bool = False,
            reason: Optional[str] = None,
            unpin_reason: Optional[str] = None,
            state_reason: Optional[str] = None,
            use_none_action_for_state: bool = False
    ) -> None:
        """
        Update history for an existing assessor.
        :param old_assessor: Assessor object before update.
        :param new_assessor: Assessor object after update.
        :param user: A string indicating who made the update.
        :param old_projects: List of ID assessor's projects before update.
        :param old_second_managers: List of ID assessor's second managers before update.
        :param completed_project: If True, then if the assessor object has deleted
        projects, the “completed_project” event will be selected.
        :param reason: Reason for removing assessor from a project.
        :param unpin_reason: Reason for removing assessor from a team.
        :param state_reason: Reason for changing assessor's state.
        :param use_none_action_for_state: Indicates whether to use the "None" action
        """
        updates = self._get_updates_for_existing_assessor(
            old_assessor=old_assessor,
            new_assessor=new_assessor,
            user=user,
            old_projects=old_projects,
            old_second_managers=old_second_managers,
            completed_project=completed_project,
            reason=reason,
            unpin_reason=unpin_reason,
            state_reason=state_reason,
            use_none_action_for_state=use_none_action_for_state
        )
        histories = self.create_history_objects(new_assessor, updates)
        self.perform_create(histories)

    def return_from_vacation_system_updates(self) -> List[Dict]:
        """
        Used when the assessor returns from vacation
        using the system (periodic task)
        """
        return [
            {
                'attribute': HistoryAttribute.STATE,
                'old_value': AssessorState.get_value(AssessorState.VACATION),
                'new_value': AssessorState.get_value(AssessorState.AVAILABLE),
                **self.__get_base_history_data(user='-')
            }
        ]

    def create_history_objects(self, assessor: Assessor, updates: List[Dict]) -> List[History]:
        """
        Create history objects without commit to DB.
        :param assessor: A new assessor object.
        :param updates: A list consisting of dict containing assessor update data.
        :return
        List of History objects.
        """
        return [self.model(
            assessor=assessor,
            attribute=item.get('attribute'),
            action=item.get('action'),
            old_value=item.get('old_value'),
            new_value=item.get('new_value'),
            reason=item.get('reason'),
            user=item.get('user')
        ) for item in updates]

    def perform_create(self, histories: List[History]) -> None:
        """
        Commit history objects to DB.
        :param histories: List of History objects
        """
        self.model.objects.bulk_create(histories)

    def _get_updates_for_new_assessor(self, assessor: Assessor, user: str) -> List[Dict]:
        """
        Return list of updates for a new assessor.
        Used only when creating a new assessor.
        :param assessor: A new assessor object.
        :param user: A string indicating who made the update.
        :return
        A list consisting of dict containing assessor update data
        """
        updates = [
            {
                'attribute': HistoryAttribute.FULL_NAME,
                'new_value': assessor.full_name,
                **self._get_new_assessor_base_history_data(user)
            },
            {
                'attribute': HistoryAttribute.USERNAME,
                'new_value': assessor.username,
                **self._get_new_assessor_base_history_data(user)
            },
            {
                'attribute': HistoryAttribute.MANAGER,
                'new_value': assessor.manager.full_name if assessor.manager else None,
                **self._get_new_assessor_base_history_data(user)
            },
            {
                'attribute': HistoryAttribute.STATE,
                'new_value': AssessorState.get_value(assessor.state),
                **self._get_new_assessor_base_history_data(user)
            }
        ]
        return updates

    def _get_updates_for_existing_assessor(
            self,
            old_assessor: Assessor,
            new_assessor: Assessor,
            user: str,
            old_projects: Optional[List[int]] = None,
            old_second_managers: Optional[List[int]] = None,
            completed_project: bool = False,
            reason: Optional[str] = None,
            unpin_reason: Optional[str] = None,
            state_reason: Optional[str] = None,
            use_none_action_for_state: bool = False
    ) -> List[Dict]:
        """
        Return list of updates for an existing assessor.
        Checks for updates to key fields and adds updates
        for them to the list of updates
        """
        updates = []
        if old_assessor.last_name != new_assessor.last_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.last_name,
                    'new_value': new_assessor.last_name,
                    **self.__get_base_history_data(user)
                }
            )

        if old_assessor.first_name != new_assessor.first_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.first_name,
                    'new_value': new_assessor.first_name,
                    **self.__get_base_history_data(user)
                }
            )

        if old_assessor.middle_name != new_assessor.middle_name:
            updates.append(
                {
                    'attribute': HistoryAttribute.FULL_NAME,
                    'old_value': old_assessor.middle_name,
                    'new_value': new_assessor.middle_name,
                    **self.__get_base_history_data(user)
                }
            )

        if old_assessor.username != new_assessor.username:
            updates.append(
                {
                    'attribute': HistoryAttribute.USERNAME,
                    'old_value': old_assessor.username,
                    'new_value': new_assessor.username,
                    **self.__get_base_history_data(user)
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
                        **self.__get_base_history_data(user, action=action)
                    }
                )
                # To use None action for second update when state updates will be checked
                use_none_action_for_state = True
            elif new_assessor.manager is None and new_assessor.state in AssessorState.fired_states():
                action = HistoryAction.FIRE
                updates.append(
                    {
                        'attribute': HistoryAttribute.MANAGER,
                        'old_value': old_assessor.manager.full_name,
                        'new_value': None,
                        'reason': unpin_reason,
                        **self.__get_base_history_data(user, action=action)
                    }
                )
            elif old_assessor.manager is None and new_assessor.manager is not None:
                action = HistoryAction.TO_TEAM
                updates.append(
                    {
                        'attribute': HistoryAttribute.MANAGER,
                        'old_value': old_assessor.manager,
                        'new_value': new_assessor.manager.full_name,
                        **self.__get_base_history_data(user, action=action)
                    }
                )
            elif old_assessor.manager is not None and new_assessor.manager is not None:
                action = HistoryAction.UNPIN
                updates.extend(
                    [
                        {
                            'attribute': HistoryAttribute.MANAGER,
                            'old_value': old_assessor.manager.full_name,
                            'new_value': None,
                            'reason': unpin_reason,
                            **self.__get_base_history_data(user, action=action)
                        },
                        {
                            'attribute': HistoryAttribute.MANAGER,
                            'old_value': None,
                            'new_value': new_assessor.manager.full_name,
                            **self.__get_base_history_data(user)
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
                        'reason': reason,
                        **self.__get_base_history_data(user, action=action)
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
                        **self.__get_base_history_data(user, action=action)
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
                elif new_assessor.state in AssessorState.fired_states():
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
                    **self.__get_base_history_data(user, action=action)
                }
            )

        return updates

    def _get_new_assessor_base_history_data(self, user: str) -> Dict:
        """
        Returns base history data for a new assessor.
        :param user: A string indicating who made the update.
        :return
        Dict with history data
        """
        action = HistoryAction.CREATED
        return self.__get_base_history_data(user, action=action)

    @staticmethod
    def __get_base_history_data(user: str, action: Optional[str] = None) -> Dict:
        """
        Get base history data.
        :param user: A string indicating who made the update.
        :param action: HistoryAction value.
        :return
        Dict with history data
        """
        return {
            'action': action,
            'user': user
        }

    @staticmethod
    def __convert_for_db(data: Iterable) -> Union[str, None]:
        """
        Convert list of values to string.
        Returns "None" if data is an empty list, an empty string, 0(int) etc.
        :param data: Any iterable object
        """
        if data:
            return '; '.join(data)
        return None

    def __get_last_obj(self, assessor_id: int, attribute: str) -> Union[str, None]:
        """
        Get the latest history object for a specific attribute
        and a specific assessor.
        :param assessor_id: Unique assessor ID.
        :param attribute: Any History object attribute.
        :return
        Returns "old_value" of History object if it exists, otherwise "None"
        """
        obj = self.model.objects.filter(
            assessor=assessor_id, attribute=attribute
        ).first()

        return obj.old_value if obj is not None else None


history = HistoryService()
