from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel, EmailStr
from src.auth.repositories.user_repository import UserRepository
from src.shared.exceptions import UnauthorizedError
from src.shared.security import verify_password, create_access_token


class LoginInput(BaseModel):
    email: EmailStr
    password: str


@dataclass
class LoginOutput:
    access_token: str
    token_type: str
    user_id: str
    email: str
    user_type: str
    salary: Optional[float]


class LoginUseCase:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, data: LoginInput) -> LoginOutput:
        user = self.user_repository.find_by_email(data.email)
        if not user:
            raise UnauthorizedError("Credenciais inválidas")

        if not verify_password(data.password, user.hashed_password):
            raise UnauthorizedError("Credenciais inválidas")

        token = create_access_token({"sub": user.id})
        return LoginOutput(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            user_type=user.user_type,
            salary=user.salary,
        )
