from apps.users.models import BaseUser
from core.utils.common import get_code
from ..models import Code


def create_user_confirmation_code(user: BaseUser) -> 'Code':
    return Code.objects.create(
        code=get_code(),
        user=user
    )
