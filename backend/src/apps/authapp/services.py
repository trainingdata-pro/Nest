from apps.authapp.models import Code, PasswordResetToken
from apps.users.models import BaseUser
from core.mixins import BaseService
from core.utils import get_hash


class AuthService(BaseService):
    model = Code

    def create_code(self, user: BaseUser) -> Code:
        """ Create user confirmation code """
        instance = self.create_instance(user=user, code=get_hash())
        return self.perform_save(instance)

    def delete_code(self, instance: Code) -> None:
        """ Delete user confirmation code """
        return self.perform_delete(instance)


class ResetPasswordService(BaseService):
    model = PasswordResetToken

    def create_token(self, user: BaseUser) -> PasswordResetToken:
        """ Create password reset token """
        self.remove_old_tokens(user)
        token = self.create_instance(user=user)
        return self.perform_save(token)

    def remove_token(self, instance: PasswordResetToken) -> None:
        """ Remove password reset token """
        return self.perform_delete(instance)

    def remove_old_tokens(self, user: BaseUser) -> None:
        """ Remove all old tokens for a specific user """
        self.model.objects.filter(user=user).delete()


auth_service = AuthService()
reset_password_service = ResetPasswordService()
