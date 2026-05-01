from pydantic import BaseModel
from src.fixed_expenses.domain.entities import FixedExpenseEntity
from src.fixed_expenses.repositories.expense_repository import ExpenseRepository


class UpdateExpenseInput(BaseModel):
    name: str
    value: float
    color: str


class UpdateExpenseUseCase:

    def __init__(self, expense_repository: ExpenseRepository):
        self.expense_repository = expense_repository

    def execute(self, expense_id: str, user_id: str, data: UpdateExpenseInput) -> FixedExpenseEntity:
        return self.expense_repository.update(
            expense_id=expense_id,
            user_id=user_id,
            name=data.name,
            value=data.value,
            color=data.color,
        )
