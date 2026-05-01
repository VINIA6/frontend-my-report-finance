from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.shared.security import get_current_user_id
from src.finance.factories.finance_factory import make_finance_controller
from src.finance.schemas.finance_schemas import (
    TemplateCreate, TemplateUpdate, IncomeCreate, IncomeUpdate,
    ExpenseCreate, ExpenseUpdate, SyncRequest,
)

router = APIRouter(prefix="/finance", tags=["Finance"])


# ─── Full data ────────────────────────────────────────────────

@router.get("/data")
def get_all_data(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).get_all_data(user_id)


@router.post("/sync")
def sync_data(
    body: SyncRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).sync(user_id, body)


# ─── Templates ────────────────────────────────────────────────

@router.get("/templates")
def list_templates(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).list_templates(user_id)


@router.post("/templates", status_code=status.HTTP_201_CREATED)
def create_template(
    body: TemplateCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).create_template(user_id, body)


@router.put("/templates/{template_id}")
def update_template(
    template_id: str,
    body: TemplateUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).update_template(template_id, user_id, body)


@router.delete("/templates/{template_id}")
def delete_template(
    template_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).delete_template(template_id, user_id)


# ─── Periods ──────────────────────────────────────────────────

@router.get("/periods/{month}")
def get_period(
    month: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).get_period(user_id, month)


# ─── Incomes ──────────────────────────────────────────────────

@router.post("/periods/{month}/incomes", status_code=status.HTTP_201_CREATED)
def add_income(
    month: str,
    body: IncomeCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).add_income(user_id, month, body)


@router.put("/incomes/{income_id}")
def update_income(
    income_id: str,
    body: IncomeUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).update_income(income_id, user_id, body)


@router.delete("/incomes/{income_id}")
def delete_income(
    income_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).delete_income(income_id, user_id)


# ─── Expenses ─────────────────────────────────────────────────

@router.post("/periods/{month}/expenses", status_code=status.HTTP_201_CREATED)
def add_expense(
    month: str,
    body: ExpenseCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).add_expense(user_id, month, body)


@router.put("/expenses/{expense_id}")
def update_expense(
    expense_id: str,
    body: ExpenseUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).update_expense(expense_id, user_id, body)


@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: str,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return make_finance_controller(db).delete_expense(expense_id, user_id)
