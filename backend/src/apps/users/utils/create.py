from apps.users.models import BaseUser, ManagerProfile


def create_manager_profile(user: BaseUser) -> ManagerProfile:
    return ManagerProfile.objects.create(user=user, is_teamlead=False)
