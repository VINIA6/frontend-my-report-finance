from pydantic import BaseModel
from src.fixed_expenses.domain.entities import FixedExpenseEntity
from src.fixed_expenses.repositories.expense_repository import ExpenseRepository


class CreateExpenseInput(BaseModel):
    name: str
    value: float
    color: str


class CreateExpenseUseCase:

    def __init__(self, expense_repository: ExpenseRepository):
        self.expense_repository = expense_repository

    def execute(self, user_id: str, data: CreateExpenseInput) -> FixedExpenseEntity:
        return self.expense_repository.create(
            user_id=user_id,
            name=data.name,
            value=data.value,
            color=data.color,
        )
