from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.finance.domain.models import (
    ExpenseTemplateModel, MonthlyPeriodModel, IncomeModel, ExpenseModel
)
from src.finance.domain.entities import (
    ExpenseTemplateEntity, IncomeEntity, ExpenseEntity, MonthlyPeriodEntity
)
from src.finance.repositories.finance_repository import FinanceRepository


def _tmpl(m: ExpenseTemplateModel) -> ExpenseTemplateEntity:
    return ExpenseTemplateEntity(
        id=m.id, user_id=m.user_id, name=m.name, value=float(m.value) if m.value is not None else None,
        due_day=m.due_day, expense_type=m.expense_type, fixed=m.fixed, start_month=m.start_month,
    )


def _income(m: IncomeModel) -> IncomeEntity:
    return IncomeEntity(
        id=m.id, period_id=m.period_id, user_id=m.user_id,
        description=m.description, value=float(m.value), received_at=m.received_at,
    )


def _expense(m: ExpenseModel) -> ExpenseEntity:
    return ExpenseEntity(
        id=m.id, period_id=m.period_id, user_id=m.user_id,
        expense_type=m.expense_type, name=m.name,
        value=float(m.value) if m.value is not None else None,
        due_day=m.due_day, paid=m.paid, paid_at=m.paid_at,
        fixed=m.fixed, template_id=m.template_id,
    )


def _period_with_children(db: Session, p: MonthlyPeriodModel) -> MonthlyPeriodEntity:
    incomes = db.query(IncomeModel).filter_by(period_id=p.id).all()
    pj = db.query(ExpenseModel).filter_by(period_id=p.id, expense_type="pj").all()
    pf = db.query(ExpenseModel).filter_by(period_id=p.id, expense_type="pf").all()
    return MonthlyPeriodEntity(
        id=p.id, user_id=p.user_id, month=p.month,
        incomes=[_income(i) for i in incomes],
        pj_expenses=[_expense(e) for e in pj],
        pf_expenses=[_expense(e) for e in pf],
    )


class FinanceRepositoryImpl(FinanceRepository):

    def __init__(self, db: Session):
        self.db = db

    # --- Templates ---

    def list_templates(self, user_id: str) -> List[ExpenseTemplateEntity]:
        rows = self.db.query(ExpenseTemplateModel).filter_by(user_id=user_id).all()
        return [_tmpl(r) for r in rows]

    def create_template(self, user_id: str, name: str, value: Optional[float],
                        due_day: int, expense_type: str, fixed: bool, start_month: str) -> ExpenseTemplateEntity:
        m = ExpenseTemplateModel(
            user_id=user_id, name=name, value=value, due_day=due_day,
            expense_type=expense_type, fixed=fixed, start_month=start_month,
        )
        self.db.add(m)
        self.db.commit()
        self.db.refresh(m)
        return _tmpl(m)

    def update_template(self, template_id: str, user_id: str, **kwargs) -> ExpenseTemplateEntity:
        m = self.db.query(ExpenseTemplateModel).filter_by(id=template_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template não encontrado")
        for k, v in kwargs.items():
            setattr(m, k, v)
        self.db.commit()
        self.db.refresh(m)
        return _tmpl(m)

    def delete_template(self, template_id: str, user_id: str) -> None:
        m = self.db.query(ExpenseTemplateModel).filter_by(id=template_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template não encontrado")
        self.db.delete(m)
        self.db.commit()

    # --- Periods ---

    def get_or_create_period(self, user_id: str, month: str) -> MonthlyPeriodEntity:
        p = self.db.query(MonthlyPeriodModel).filter_by(user_id=user_id, month=month).first()
        if not p:
            p = MonthlyPeriodModel(user_id=user_id, month=month)
            self.db.add(p)
            self.db.commit()
            self.db.refresh(p)
        return _period_with_children(self.db, p)

    def list_periods(self, user_id: str) -> List[MonthlyPeriodEntity]:
        rows = self.db.query(MonthlyPeriodModel).filter_by(user_id=user_id).order_by(MonthlyPeriodModel.month).all()
        return [_period_with_children(self.db, p) for p in rows]

    # --- Incomes ---

    def create_income(self, period_id: str, user_id: str, description: str,
                      value: float, received_at: Optional[str]) -> IncomeEntity:
        m = IncomeModel(period_id=period_id, user_id=user_id, description=description,
                        value=value, received_at=received_at)
        self.db.add(m)
        self.db.commit()
        self.db.refresh(m)
        return _income(m)

    def update_income(self, income_id: str, user_id: str, **kwargs) -> IncomeEntity:
        m = self.db.query(IncomeModel).filter_by(id=income_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receita não encontrada")
        for k, v in kwargs.items():
            setattr(m, k, v)
        self.db.commit()
        self.db.refresh(m)
        return _income(m)

    def delete_income(self, income_id: str, user_id: str) -> None:
        m = self.db.query(IncomeModel).filter_by(id=income_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Receita não encontrada")
        self.db.delete(m)
        self.db.commit()

    # --- Expenses ---

    def create_expense(self, period_id: str, user_id: str, expense_type: str,
                       name: str, value: Optional[float], due_day: Optional[int],
                       paid: bool, paid_at: Optional[str], fixed: bool,
                       template_id: Optional[str]) -> ExpenseEntity:
        m = ExpenseModel(
            period_id=period_id, user_id=user_id, expense_type=expense_type,
            name=name, value=value, due_day=due_day, paid=paid, paid_at=paid_at,
            fixed=fixed, template_id=template_id,
        )
        self.db.add(m)
        self.db.commit()
        self.db.refresh(m)
        return _expense(m)

    def update_expense(self, expense_id: str, user_id: str, **kwargs) -> ExpenseEntity:
        m = self.db.query(ExpenseModel).filter_by(id=expense_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa não encontrada")
        for k, v in kwargs.items():
            setattr(m, k, v)
        self.db.commit()
        self.db.refresh(m)
        return _expense(m)

    def delete_expense(self, expense_id: str, user_id: str) -> None:
        m = self.db.query(ExpenseModel).filter_by(id=expense_id, user_id=user_id).first()
        if not m:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa não encontrada")
        self.db.delete(m)
        self.db.commit()

    # --- Bulk sync ---

    def sync_all(self, user_id: str, templates: list, periods: dict) -> None:
        # Delete all existing data for user
        existing_periods = self.db.query(MonthlyPeriodModel).filter_by(user_id=user_id).all()
        for p in existing_periods:
            self.db.delete(p)
        self.db.query(ExpenseTemplateModel).filter_by(user_id=user_id).delete()
        self.db.flush()

        # Insert templates
        for t in templates:
            m = ExpenseTemplateModel(
                id=t.get("id"), user_id=user_id, name=t["name"],
                value=t.get("value"), due_day=t["dueDay"],
                expense_type=t["type"], fixed=t.get("fixed", True),
                start_month=t["startMonth"],
            )
            self.db.add(m)

        # Insert periods
        for month, period_data in periods.items():
            p = MonthlyPeriodModel(user_id=user_id, month=month)
            self.db.add(p)
            self.db.flush()

            for inc in period_data.get("incomes", []):
                self.db.add(IncomeModel(
                    id=inc.get("id"), period_id=p.id, user_id=user_id,
                    description=inc["description"], value=inc["value"],
                    received_at=inc.get("receivedAt"),
                ))

            for exp in period_data.get("pjExpenses", []):
                self.db.add(ExpenseModel(
                    id=exp.get("id"), period_id=p.id, user_id=user_id,
                    expense_type="pj", name=exp["name"], value=exp.get("value"),
                    due_day=exp.get("dueDay"), paid=exp.get("paid", False),
                    paid_at=exp.get("paidAt"), fixed=exp.get("fixed", True),
                    template_id=exp.get("templateId"),
                ))

            for exp in period_data.get("pfExpenses", []):
                self.db.add(ExpenseModel(
                    id=exp.get("id"), period_id=p.id, user_id=user_id,
                    expense_type="pf", name=exp["name"], value=exp.get("value"),
                    due_day=exp.get("dueDay"), paid=exp.get("paid", False),
                    paid_at=exp.get("paidAt"), fixed=exp.get("fixed", True),
                    template_id=exp.get("templateId"),
                ))

        self.db.commit()
