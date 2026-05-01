from typing import List
from src.fixed_expenses.domain.entities import FixedExpenseEntity
from src.fixed_expenses.repositories.expense_repository import ExpenseRepository


class ListExpensesUseCase:

    def __init__(self, expense_repository: ExpenseRepository):
        self.expense_repository = expense_repository

    def execute(self, user_id: str) -> List[FixedExpenseEntity]:
        return self.expense_repository.find_all_by_user(user_id)
