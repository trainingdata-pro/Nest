from apps.users.models import BaseUser, ManagerProfile, Code

from .common import get_code


def create_manager_profile(user: BaseUser) -> ManagerProfile:
    return ManagerProfile.objects.create(user=user, is_teamlead=False)


def create_user_confirmation_code(user: BaseUser) -> 'Code':
    return Code.objects.create(
        code=get_code(),
        user=user
    )
