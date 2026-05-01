import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from src.fixed_expenses.domain.entities import FixedExpenseEntity
from src.fixed_expenses.domain.models import FixedExpenseModel
from src.fixed_expenses.repositories.expense_repository import ExpenseRepository
from src.shared.exceptions import NotFoundError


class ExpenseRepositoryImpl(ExpenseRepository):

    def __init__(self, db: Session):
        self.db = db

    def find_all_by_user(self, user_id: str) -> List[FixedExpenseEntity]:
        records = (
            self.db.query(FixedExpenseModel)
            .filter(FixedExpenseModel.user_id == user_id)
            .order_by(FixedExpenseModel.created_at)
            .all()
        )
        return [self._to_entity(r) for r in records]

    def find_by_id(self, expense_id: str, user_id: str) -> Optional[FixedExpenseEntity]:
        record = (
            self.db.query(FixedExpenseModel)
            .filter(FixedExpenseModel.id == expense_id, FixedExpenseModel.user_id == user_id)
            .first()
        )
        return self._to_entity(record) if record else None

    def create(self, user_id: str, name: str, value: float, color: str) -> FixedExpenseEntity:
        record = FixedExpenseModel(
            id=str(uuid.uuid4()),
            user_id=user_id,
            name=name,
            value=value,
            color=color,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return self._to_entity(record)

    def update(self, expense_id: str, user_id: str, name: str, value: float, color: str) -> FixedExpenseEntity:
        record = (
            self.db.query(FixedExpenseModel)
            .filter(FixedExpenseModel.id == expense_id, FixedExpenseModel.user_id == user_id)
            .first()
        )
        if not record:
            raise NotFoundError("Despesa não encontrada")

        record.name = name
        record.value = value
        record.color = color
        record.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(record)
        return self._to_entity(record)

    def delete(self, expense_id: str, user_id: str) -> None:
        record = (
            self.db.query(FixedExpenseModel)
            .filter(FixedExpenseModel.id == expense_id, FixedExpenseModel.user_id == user_id)
            .first()
        )
        if not record:
            raise NotFoundError("Despesa não encontrada")

        self.db.delete(record)
        self.db.commit()

    def _to_entity(self, model: FixedExpenseModel) -> FixedExpenseEntity:
        return FixedExpenseEntity(
            id=model.id,
            user_id=model.user_id,
            name=model.name,
            value=float(model.value),
            color=model.color,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
