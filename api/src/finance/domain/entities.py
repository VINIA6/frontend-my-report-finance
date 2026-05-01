from dataclasses import dataclass
from typing import Optional


@dataclass
class ExpenseTemplateEntity:
    id: str
    user_id: str
    name: str
    value: Optional[float]
    due_day: int
    expense_type: str
    fixed: bool
    start_month: str


@dataclass
class IncomeEntity:
    id: str
    period_id: str
    user_id: str
    description: str
    value: float
    received_at: Optional[str]


@dataclass
class ExpenseEntity:
    id: str
    period_id: str
    user_id: str
    expense_type: str
    name: str
    value: Optional[float]
    due_day: Optional[int]
    paid: bool
    paid_at: Optional[str]
    fixed: bool
    template_id: Optional[str]


@dataclass
class MonthlyPeriodEntity:
    id: str
    user_id: str
    month: str
    incomes: list
    pj_expenses: list
    pf_expenses: list
