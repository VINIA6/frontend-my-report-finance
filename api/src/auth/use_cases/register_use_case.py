from typing import Optional
from pydantic import BaseModel, EmailStr
from src.auth.domain.entities import UserEntity
from src.auth.repositories.user_repository import UserRepository
from src.shared.exceptions import ConflictError, UnprocessableError
from src.shared.security import hash_password


class RegisterInput(BaseModel):
    email: EmailStr
    password: str
    user_type: str = "clt"  # "clt" or "cnpj"
    salary: Optional[float] = None  # salario bruto (obrigatorio para CLT)


class RegisterUseCase:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, data: RegisterInput) -> UserEntity:
        if data.user_type not in ("clt", "cnpj"):
            raise UnprocessableError("user_type deve ser 'clt' ou 'cnpj'")

        if data.user_type == "clt" and not data.salary:
            raise UnprocessableError("Salário é obrigatório para usuários CLT")

        existing = self.user_repository.find_by_email(data.email)
        if existing:
            raise ConflictError("E-mail já cadastrado")

        hashed = hash_password(data.password)
        return self.user_repository.create(
            email=data.email,
            hashed_password=hashed,
            user_type=data.user_type,
            salary=data.salary if data.user_type == "clt" else None,
        )
