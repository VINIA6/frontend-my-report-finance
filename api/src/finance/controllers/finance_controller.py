from typing import Optional
from src.finance.repositories.finance_repository import FinanceRepository
from src.finance.schemas.finance_schemas import (
    TemplateCreate, TemplateUpdate, IncomeCreate, IncomeUpdate,
    ExpenseCreate, ExpenseUpdate, SyncRequest,
)


def _fmt_template(e) -> dict:
    return {"id": e.id, "name": e.name, "value": e.value, "dueDay": e.due_day,
            "type": e.expense_type, "fixed": e.fixed, "startMonth": e.start_month}


def _fmt_income(e) -> dict:
    return {"id": e.id, "description": e.description, "value": e.value, "receivedAt": e.received_at}


def _fmt_expense(e) -> dict:
    return {"id": e.id, "name": e.name, "value": e.value, "dueDay": e.due_day,
            "paid": e.paid, "paidAt": e.paid_at, "fixed": e.fixed, "templateId": e.template_id}


def _fmt_period(p) -> dict:
    return {
        "month": p.month,
        "incomes": [_fmt_income(i) for i in p.incomes],
        "pjExpenses": [_fmt_expense(e) for e in p.pj_expenses],
        "pfExpenses": [_fmt_expense(e) for e in p.pf_expenses],
    }


class FinanceController:

    def __init__(self, repo: FinanceRepository):
        self.repo = repo

    # --- Finance data ---

    def get_all_data(self, user_id: str) -> dict:
        templates = self.repo.list_templates(user_id)
        periods = self.repo.list_periods(user_id)
        return {
            "templates": [_fmt_template(t) for t in templates],
            "periods": {p.month: _fmt_period(p) for p in periods},
        }

    def sync(self, user_id: str, body: SyncRequest) -> dict:
        self.repo.sync_all(user_id, body.templates, body.periods)
        return {"message": "Sincronizado com sucesso"}

    # --- Templates ---

    def list_templates(self, user_id: str) -> list:
        return [_fmt_template(t) for t in self.repo.list_templates(user_id)]

    def create_template(self, user_id: str, body: TemplateCreate) -> dict:
        t = self.repo.create_template(
            user_id=user_id, name=body.name, value=body.value,
            due_day=body.dueDay, expense_type=body.type,
            fixed=body.fixed, start_month=body.startMonth,
        )
        return _fmt_template(t)

    def update_template(self, template_id: str, user_id: str, body: TemplateUpdate) -> dict:
        updates = {k: v for k, v in {
            "name": body.name, "value": body.value,
            "due_day": body.dueDay, "fixed": body.fixed,
        }.items() if v is not None}
        t = self.repo.update_template(template_id, user_id, **updates)
        return _fmt_template(t)

    def delete_template(self, template_id: str, user_id: str) -> dict:
        self.repo.delete_template(template_id, user_id)
        return {"message": "Template removido"}

    # --- Periods ---

    def get_period(self, user_id: str, month: str) -> dict:
        p = self.repo.get_or_create_period(user_id, month)
        return _fmt_period(p)

    # --- Incomes ---

    def add_income(self, user_id: str, month: str, body: IncomeCreate) -> dict:
        p = self.repo.get_or_create_period(user_id, month)
        income = self.repo.create_income(
            period_id=p.id, user_id=user_id,
            description=body.description, value=body.value, received_at=body.receivedAt,
        )
        return _fmt_income(income)

    def update_income(self, income_id: str, user_id: str, body: IncomeUpdate) -> dict:
        updates = {k: v for k, v in {
            "description": body.description, "value": body.value, "received_at": body.receivedAt,
        }.items() if v is not None}
        income = self.repo.update_income(income_id, user_id, **updates)
        return _fmt_income(income)

    def delete_income(self, income_id: str, user_id: str) -> dict:
        self.repo.delete_income(income_id, user_id)
        return {"message": "Receita removida"}

    # --- Expenses ---

    def add_expense(self, user_id: str, month: str, body: ExpenseCreate) -> dict:
        p = self.repo.get_or_create_period(user_id, month)
        expense = self.repo.create_expense(
            period_id=p.id, user_id=user_id, expense_type=body.type,
            name=body.name, value=body.value, due_day=body.dueDay,
            paid=body.paid, paid_at=body.paidAt, fixed=body.fixed,
            template_id=body.templateId,
        )
        return _fmt_expense(expense)

    def update_expense(self, expense_id: str, user_id: str, body: ExpenseUpdate) -> dict:
        updates = {k: v for k, v in {
            "name": body.name, "value": body.value, "due_day": body.dueDay,
            "paid": body.paid, "paid_at": body.paidAt, "fixed": body.fixed,
        }.items() if v is not None}
        expense = self.repo.update_expense(expense_id, user_id, **updates)
        return _fmt_expense(expense)

    def delete_expense(self, expense_id: str, user_id: str) -> dict:
        self.repo.delete_expense(expense_id, user_id)
        return {"message": "Despesa removida"}
