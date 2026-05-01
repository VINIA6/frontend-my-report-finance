from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class IncomeCreate(BaseModel):
    description: str
    value: float
    receivedAt: Optional[str] = None


class IncomeUpdate(BaseModel):
    description: Optional[str] = None
    value: Optional[float] = None
    receivedAt: Optional[str] = None


class IncomeResponse(BaseModel):
    id: str
    description: str
    value: float
    receivedAt: Optional[str] = None


class ExpenseCreate(BaseModel):
    name: str
    value: Optional[float] = None
    dueDay: int
    paid: bool = False
    paidAt: Optional[str] = None
    fixed: bool = True
    templateId: Optional[str] = None
    type: str  # 'pj' | 'pf'


class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[float] = None
    dueDay: Optional[int] = None
    paid: Optional[bool] = None
    paidAt: Optional[str] = None
    fixed: Optional[bool] = None


class ExpenseResponse(BaseModel):
    id: str
    name: str
    value: Optional[float] = None
    dueDay: Optional[int] = None
    paid: bool
    paidAt: Optional[str] = None
    fixed: bool
    templateId: Optional[str] = None


class TemplateCreate(BaseModel):
    name: str
    value: Optional[float] = None
    dueDay: int
    type: str  # 'pj' | 'pf'
    fixed: bool = True
    startMonth: str


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    value: Optional[float] = None
    dueDay: Optional[int] = None
    fixed: Optional[bool] = None


class TemplateResponse(BaseModel):
    id: str
    name: str
    value: Optional[float] = None
    dueDay: int
    type: str
    fixed: bool
    startMonth: str


class MonthlyPeriodResponse(BaseModel):
    month: str
    incomes: List[IncomeResponse]
    pjExpenses: List[ExpenseResponse]
    pfExpenses: List[ExpenseResponse]


class FinanceDataResponse(BaseModel):
    templates: List[TemplateResponse]
    periods: Dict[str, MonthlyPeriodResponse]


class SyncRequest(BaseModel):
    templates: List[Dict[str, Any]]
    periods: Dict[str, Dict[str, Any]]
