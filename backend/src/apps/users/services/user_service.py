from django.contrib.auth import get_user_model

from ..models import BaseUser, ManagerProfile


class UserService:
    model = get_user_model()

    def create_user(self, is_active: bool = False, **data) -> BaseUser:
        instance = self.__create_instance(is_active=is_active, **data)
        return self.__perform_save(instance)

    def activate_user(self, instance: BaseUser) -> BaseUser:
        instance.is_active = True
        return self.__perform_save(instance)

    def set_password(self, user: BaseUser, password: str) -> BaseUser:
        user.set_password(password)
        return self.__perform_save(user)

    def __create_instance(self, **kwargs) -> BaseUser:
        return self.model.objects.create_user(**kwargs)

    @staticmethod
    def __perform_save(instance: BaseUser) -> BaseUser:
        instance.save()
        return instance


class ProfileService:
    model = ManagerProfile

    def create_profile(self, user: BaseUser, is_teamlead: bool = False) -> ManagerProfile:
        instance = self.__create_instance(user=user, is_teamlead=is_teamlead)
        return self.__perform_save(instance)

    def __create_instance(self, **kwargs) -> ManagerProfile:
        return self.model(**kwargs)

    @staticmethod
    def __perform_save(instance: ManagerProfile) -> ManagerProfile:
        instance.save()
        return instance


user_service = UserService()
profile_service = ProfileService()
