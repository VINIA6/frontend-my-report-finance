from sqlalchemy.orm import Session
from src.fixed_expenses.repositories.expense_repository_impl import ExpenseRepositoryImpl
from src.fixed_expenses.use_cases.list_expenses_use_case import ListExpensesUseCase
from src.fixed_expenses.use_cases.create_expense_use_case import CreateExpenseUseCase
from src.fixed_expenses.use_cases.update_expense_use_case import UpdateExpenseUseCase
from src.fixed_expenses.use_cases.delete_expense_use_case import DeleteExpenseUseCase
from src.fixed_expenses.controllers.expense_controller import ExpenseController


def make_expense_controller(db: Session) -> ExpenseController:
    repository = ExpenseRepositoryImpl(db)
    return ExpenseController(
        list_use_case=ListExpensesUseCase(repository),
        create_use_case=CreateExpenseUseCase(repository),
        update_use_case=UpdateExpenseUseCase(repository),
        delete_use_case=DeleteExpenseUseCase(repository),
    )
