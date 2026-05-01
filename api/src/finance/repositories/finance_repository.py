from abc import ABC, abstractmethod
from typing import List, Optional
from src.finance.domain.entities import (
    ExpenseTemplateEntity, IncomeEntity, ExpenseEntity, MonthlyPeriodEntity
)


class FinanceRepository(ABC):

    # --- Templates ---
    @abstractmethod
    def list_templates(self, user_id: str) -> List[ExpenseTemplateEntity]: ...

    @abstractmethod
    def create_template(self, user_id: str, name: str, value: Optional[float],
                        due_day: int, expense_type: str, fixed: bool, start_month: str) -> ExpenseTemplateEntity: ...

    @abstractmethod
    def update_template(self, template_id: str, user_id: str, **kwargs) -> ExpenseTemplateEntity: ...

    @abstractmethod
    def delete_template(self, template_id: str, user_id: str) -> None: ...

    # --- Periods ---
    @abstractmethod
    def get_or_create_period(self, user_id: str, month: str) -> MonthlyPeriodEntity: ...

    @abstractmethod
    def list_periods(self, user_id: str) -> List[MonthlyPeriodEntity]: ...

    # --- Incomes ---
    @abstractmethod
    def create_income(self, period_id: str, user_id: str, description: str,
                      value: float, received_at: Optional[str]) -> IncomeEntity: ...

    @abstractmethod
    def update_income(self, income_id: str, user_id: str, **kwargs) -> IncomeEntity: ...

    @abstractmethod
    def delete_income(self, income_id: str, user_id: str) -> None: ...

    # --- Expenses ---
    @abstractmethod
    def create_expense(self, period_id: str, user_id: str, expense_type: str,
                       name: str, value: Optional[float], due_day: Optional[int],
                       paid: bool, paid_at: Optional[str], fixed: bool,
                       template_id: Optional[str]) -> ExpenseEntity: ...

    @abstractmethod
    def update_expense(self, expense_id: str, user_id: str, **kwargs) -> ExpenseEntity: ...

    @abstractmethod
    def delete_expense(self, expense_id: str, user_id: str) -> None: ...

    # --- Bulk sync ---
    @abstractmethod
    def sync_all(self, user_id: str, templates: list, periods: dict) -> None: ...
