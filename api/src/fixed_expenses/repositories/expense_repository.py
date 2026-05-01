from abc import ABC, abstractmethod
from typing import List, Optional
from src.fixed_expenses.domain.entities import FixedExpenseEntity


class ExpenseRepository(ABC):

    @abstractmethod
    def find_all_by_user(self, user_id: str) -> List[FixedExpenseEntity]:
        pass

    @abstractmethod
    def find_by_id(self, expense_id: str, user_id: str) -> Optional[FixedExpenseEntity]:
        pass

    @abstractmethod
    def create(self, user_id: str, name: str, value: float, color: str) -> FixedExpenseEntity:
        pass

    @abstractmethod
    def update(self, expense_id: str, user_id: str, name: str, value: float, color: str) -> FixedExpenseEntity:
        pass

    @abstractmethod
    def delete(self, expense_id: str, user_id: str) -> None:
        pass
