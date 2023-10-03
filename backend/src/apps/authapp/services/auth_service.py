from apps.users.models import BaseUser
from ..models import Code, PasswordResetToken


class AuthService:
    model = Code

    def delete_code(self, instance: Code) -> None:
        return self.__perform_delete(instance)

    @staticmethod
    def __perform_save(instance: Code) -> Code:
        instance.save()
        return instance

    @staticmethod
    def __perform_delete(instance: Code) -> None:
        instance.delete()


class ResetPasswordService:
    model = PasswordResetToken

    def create_token(self, user: BaseUser) -> PasswordResetToken:
        self.remove_old_tokens(user)
        token = self.__create_token(user)
        return self.__perform_save(token)

    def remove_token(self, instance: PasswordResetToken) -> None:
        return self.__perform_delete(instance)

    def remove_old_tokens(self, user: BaseUser) -> None:
        self.model.objects.filter(user=user).delete()

    @staticmethod
    def __create_token(user: BaseUser) -> PasswordResetToken:
        return PasswordResetToken(user=user)

    @staticmethod
    def __perform_save(instance: PasswordResetToken) -> PasswordResetToken:
        instance.save()
        return instance

    @staticmethod
    def __perform_delete(instance: PasswordResetToken) -> None:
        instance.delete()


auth_service = AuthService()
reset_password_service = ResetPasswordService()
