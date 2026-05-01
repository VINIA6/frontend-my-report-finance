from typing import Optional
from pydantic import BaseModel
from src.auth.use_cases.register_use_case import RegisterUseCase, RegisterInput
from src.auth.use_cases.login_use_case import LoginUseCase, LoginInput


class RegisterRequest(BaseModel):
    email: str
    password: str
    user_type: str = "clt"
    salary: Optional[float] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthController:

    def __init__(self, register_use_case: RegisterUseCase, login_use_case: LoginUseCase):
        self.register_use_case = register_use_case
        self.login_use_case = login_use_case

    def register(self, body: RegisterRequest):
        user = self.register_use_case.execute(
            RegisterInput(
                email=body.email,
                password=body.password,
                user_type=body.user_type,
                salary=body.salary,
            )
        )
        return {
            "id": user.id,
            "email": user.email,
            "user_type": user.user_type,
            "salary": user.salary,
            "created_at": user.created_at,
        }

    def login(self, body: LoginRequest):
        result = self.login_use_case.execute(
            LoginInput(email=body.email, password=body.password)
        )
        return {
            "access_token": result.access_token,
            "token_type": result.token_type,
            "user_id": result.user_id,
            "email": result.email,
            "user_type": result.user_type,
            "salary": result.salary,
        }
