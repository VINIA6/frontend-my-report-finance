import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Float, Boolean, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from src.config.database import Base


class ExpenseTemplateModel(Base):
    __tablename__ = "expense_templates"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    due_day: Mapped[int] = mapped_column(Integer, nullable=False)
    expense_type: Mapped[str] = mapped_column(String(2), nullable=False)  # 'pj' | 'pf'
    fixed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    start_month: Mapped[str] = mapped_column(String(7), nullable=False)  # "2026-04"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class MonthlyPeriodModel(Base):
    __tablename__ = "monthly_periods"
    __table_args__ = (UniqueConstraint("user_id", "month", name="uq_period_user_month"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    month: Mapped[str] = mapped_column(String(7), nullable=False)  # "2026-04"
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class IncomeModel(Base):
    __tablename__ = "incomes"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    period_id: Mapped[str] = mapped_column(String, ForeignKey("monthly_periods.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[float] = mapped_column(Float, nullable=False)
    received_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ExpenseModel(Base):
    __tablename__ = "expenses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    period_id: Mapped[str] = mapped_column(String, ForeignKey("monthly_periods.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[str] = mapped_column(String, nullable=False)
    expense_type: Mapped[str] = mapped_column(String(2), nullable=False)  # 'pj' | 'pf'
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    due_day: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    paid: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    paid_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    fixed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    template_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
