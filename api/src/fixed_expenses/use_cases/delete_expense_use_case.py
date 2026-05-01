from src.fixed_expenses.repositories.expense_repository import ExpenseRepository


class DeleteExpenseUseCase:

    def __init__(self, expense_repository: ExpenseRepository):
        self.expense_repository = expense_repository

    def execute(self, expense_id: str, user_id: str) -> None:
        self.expense_repository.delete(expense_id=expense_id, user_id=user_id)
