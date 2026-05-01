from abc import ABC, abstractmethod
from typing import Optional
from src.salary.domain.entities import MonthlySalaryEntity


class SalaryRepository(ABC):

    @abstractmethod
    def find_by_user(self, user_id: str) -> Optional[MonthlySalaryEntity]:
        pass

    @abstractmethod
    def upsert(self, user_id: str, value: float) -> MonthlySalaryEntity:
        pass

    @abstractmethod
    def delete(self, user_id: str) -> None:
        pass
