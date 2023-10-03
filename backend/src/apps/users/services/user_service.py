from django.contrib.auth import get_user_model

from ..models import BaseUser


class UserService:
    model = get_user_model()

    def activate_user(self, instance: BaseUser) -> BaseUser:
        instance.is_active = True
        return self.__perform_save(instance)

    def set_password(self, user: BaseUser, password: str) -> BaseUser:
        user.set_password(password)
        return self.__perform_save(user)

    @staticmethod
    def __perform_save(instance: BaseUser) -> BaseUser:
        instance.save()
        return instance


user_service = UserService()
