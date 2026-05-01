from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class UserEntity:
    id: str
    email: str
    hashed_password: str
    user_type: str  # "clt" or "cnpj"
    salary: Optional[float]  # salario bruto CLT (None para CNPJ)
    created_at: datetime
    updated_at: datetime
