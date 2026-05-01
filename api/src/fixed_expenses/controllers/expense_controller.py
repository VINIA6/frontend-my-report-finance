from pydantic import BaseModel
from src.fixed_expenses.use_cases.list_expenses_use_case import ListExpensesUseCase
from src.fixed_expenses.use_cases.create_expense_use_case import CreateExpenseUseCase, CreateExpenseInput
from src.fixed_expenses.use_cases.update_expense_use_case import UpdateExpenseUseCase, UpdateExpenseInput
from src.fixed_expenses.use_cases.delete_expense_use_case import DeleteExpenseUseCase


class ExpenseRequest(BaseModel):
    name: str
    value: float
    color: str


class ExpenseController:

    def __init__(
        self,
        list_use_case: ListExpensesUseCase,
        create_use_case: CreateExpenseUseCase,
        update_use_case: UpdateExpenseUseCase,
        delete_use_case: DeleteExpenseUseCase,
    ):
        self.list_use_case = list_use_case
        self.create_use_case = create_use_case
        self.update_use_case = update_use_case
        self.delete_use_case = delete_use_case

    def list_expenses(self, user_id: str):
        expenses = self.list_use_case.execute(user_id)
        return [self._serialize(e) for e in expenses]

    def create_expense(self, user_id: str, body: ExpenseRequest):
        expense = self.create_use_case.execute(
            user_id=user_id,
            data=CreateExpenseInput(name=body.name, value=body.value, color=body.color),
        )
        return self._serialize(expense)

    def update_expense(self, expense_id: str, user_id: str, body: ExpenseRequest):
        expense = self.update_use_case.execute(
            expense_id=expense_id,
            user_id=user_id,
            data=UpdateExpenseInput(name=body.name, value=body.value, color=body.color),
        )
        return self._serialize(expense)

    def delete_expense(self, expense_id: str, user_id: str):
        self.delete_use_case.execute(expense_id=expense_id, user_id=user_id)
        return {"message": "Despesa removida com sucesso"}

    def _serialize(self, entity):
        return {
            "id": entity.id,
            "user_id": entity.user_id,
            "name": entity.name,
            "value": entity.value,
            "color": entity.color,
            "created_at": entity.created_at,
            "updated_at": entity.updated_at,
        }
