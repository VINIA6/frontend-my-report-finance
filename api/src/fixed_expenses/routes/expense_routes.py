from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.shared.security import get_current_user_id
from src.fixed_expenses.factories.expense_factory import make_expense_controller
from src.fixed_expenses.controllers.expense_controller import ExpenseRequest

router = APIRouter(prefix="/fixed-expenses", tags=["Fixed Expenses"])


@router.get("", status_code=status.HTTP_200_OK)
def list_expenses(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_expense_controller(db)
    return controller.list_expenses(user_id)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_expense(
    body: ExpenseRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_expense_controller(db)
    return controller.create_expense(user_id, body)


@router.put("/{expense_id}", status_code=status.HTTP_200_OK)
def update_expense(
    expense_id: str,
    body: ExpenseRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_expense_controller(db)
    return controller.update_expense(expense_id, user_id, body)


@router.delete("/{expense_id}", status_code=status.HTTP_200_OK)
def delete_expense(
    expense_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_expense_controller(db)
    return controller.delete_expense(expense_id, user_id)
