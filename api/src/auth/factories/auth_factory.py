from sqlalchemy.orm import Session
from src.auth.repositories.user_repository_impl import UserRepositoryImpl
from src.auth.use_cases.register_use_case import RegisterUseCase
from src.auth.use_cases.login_use_case import LoginUseCase
from src.auth.controllers.auth_controller import AuthController


def make_auth_controller(db: Session) -> AuthController:
    user_repository = UserRepositoryImpl(db)
    register_use_case = RegisterUseCase(user_repository)
    login_use_case = LoginUseCase(user_repository)
    return AuthController(register_use_case, login_use_case)
