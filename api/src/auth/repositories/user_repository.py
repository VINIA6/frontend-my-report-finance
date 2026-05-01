from abc import ABC, abstractmethod
from typing import Optional
from src.auth.domain.entities import UserEntity


class UserRepository(ABC):

    @abstractmethod
    def find_by_email(self, email: str) -> Optional[UserEntity]:
        pass

    @abstractmethod
    def find_by_id(self, user_id: str) -> Optional[UserEntity]:
        pass

    @abstractmethod
    def create(self, email: str, hashed_password: str, user_type: str = "clt", salary: float | None = None) -> UserEntity:
        pass
