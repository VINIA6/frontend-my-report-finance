import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from src.salary.domain.entities import MonthlySalaryEntity
from src.salary.domain.models import MonthlySalaryModel
from src.salary.repositories.salary_repository import SalaryRepository
from src.shared.exceptions import NotFoundError


class SalaryRepositoryImpl(SalaryRepository):

    def __init__(self, db: Session):
        self.db = db

    def find_by_user(self, user_id: str) -> Optional[MonthlySalaryEntity]:
        record = (
            self.db.query(MonthlySalaryModel)
            .filter(MonthlySalaryModel.user_id == user_id)
            .first()
        )
        return self._to_entity(record) if record else None

    def upsert(self, user_id: str, value: float) -> MonthlySalaryEntity:
        record = (
            self.db.query(MonthlySalaryModel)
            .filter(MonthlySalaryModel.user_id == user_id)
            .first()
        )
        if record:
            record.value = value
            record.updated_at = datetime.now(timezone.utc)
        else:
            record = MonthlySalaryModel(
                id=str(uuid.uuid4()),
                user_id=user_id,
                value=value,
            )
            self.db.add(record)

        self.db.commit()
        self.db.refresh(record)
        return self._to_entity(record)

    def delete(self, user_id: str) -> None:
        record = (
            self.db.query(MonthlySalaryModel)
            .filter(MonthlySalaryModel.user_id == user_id)
            .first()
        )
        if not record:
            raise NotFoundError("Salário não cadastrado")

        self.db.delete(record)
        self.db.commit()

    def _to_entity(self, model: MonthlySalaryModel) -> MonthlySalaryEntity:
        return MonthlySalaryEntity(
            id=model.id,
            user_id=model.user_id,
            value=float(model.value),
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
