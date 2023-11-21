from django.contrib.auth import get_user_model

from apps.users.models import BaseUser, ManagerProfile
from core.mixins import BaseService


class UserService(BaseService):
    model = get_user_model()

    def create_user(self, is_active: bool = False, **data) -> BaseUser:
        """ Create a new base user """
        instance = self.create_instance(is_active=is_active, **data)
        return self.perform_save(instance)

    def activate_user(self, instance: BaseUser) -> BaseUser:
        """ Activate a specific user """
        instance.is_active = True
        return self.perform_save(instance)

    def set_password(self, user: BaseUser, password: str) -> BaseUser:
        """ Set user password """
        user.set_password(password)
        return self.perform_save(user)


class ProfileService(BaseService):
    model = ManagerProfile

    def create_profile(self, user: BaseUser, is_teamlead: bool = False) -> ManagerProfile:
        """ Create a new manager profile """
        instance = self.create_instance(user=user, is_teamlead=is_teamlead)
        return self.perform_save(instance)


user_service = UserService()
profile_service = ProfileService()
