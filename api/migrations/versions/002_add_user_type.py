"""add user_type column to users table

Revision ID: 002_add_user_type
Revises: 001_initial_schema
Create Date: 2026-04-16
"""
from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("user_type", sa.String(10), nullable=False, server_default="clt"))


def downgrade() -> None:
    op.drop_column("users", "user_type")
