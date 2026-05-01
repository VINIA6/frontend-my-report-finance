"""finance tables

Revision ID: 004
Revises: 003
Create Date: 2026-05-01

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "expense_templates",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("value", sa.Float(), nullable=True),
        sa.Column("due_day", sa.Integer(), nullable=False),
        sa.Column("expense_type", sa.String(2), nullable=False),
        sa.Column("fixed", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("start_month", sa.String(7), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_expense_templates_user_id", "expense_templates", ["user_id"])

    op.create_table(
        "monthly_periods",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("month", sa.String(7), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "month", name="uq_period_user_month"),
    )
    op.create_index("ix_monthly_periods_user_id", "monthly_periods", ["user_id"])

    op.create_table(
        "incomes",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("period_id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("description", sa.String(255), nullable=False),
        sa.Column("value", sa.Float(), nullable=False),
        sa.Column("received_at", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["monthly_periods.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_incomes_period_id", "incomes", ["period_id"])

    op.create_table(
        "expenses",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("period_id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("expense_type", sa.String(2), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("value", sa.Float(), nullable=True),
        sa.Column("due_day", sa.Integer(), nullable=True),
        sa.Column("paid", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("paid_at", sa.String(50), nullable=True),
        sa.Column("fixed", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("template_id", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["period_id"], ["monthly_periods.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_expenses_period_id", "expenses", ["period_id"])


def downgrade() -> None:
    op.drop_table("expenses")
    op.drop_table("incomes")
    op.drop_table("monthly_periods")
    op.drop_table("expense_templates")
