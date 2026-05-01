import uuid
from typing import Optional
from sqlalchemy.orm import Session
from src.auth.domain.entities import UserEntity
from src.auth.domain.models import UserModel
from src.auth.repositories.user_repository import UserRepository


class UserRepositoryImpl(UserRepository):

    def __init__(self, db: Session):
        self.db = db

    def find_by_email(self, email: str) -> Optional[UserEntity]:
        record = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._to_entity(record) if record else None

    def find_by_id(self, user_id: str) -> Optional[UserEntity]:
        record = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        return self._to_entity(record) if record else None

    def create(self, email: str, hashed_password: str, user_type: str = "clt", salary: float | None = None) -> UserEntity:
        record = UserModel(
            id=str(uuid.uuid4()),
            email=email,
            hashed_password=hashed_password,
            user_type=user_type,
            salary=salary,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return self._to_entity(record)

    def _to_entity(self, model: UserModel) -> UserEntity:
        return UserEntity(
            id=model.id,
            email=model.email,
            hashed_password=model.hashed_password,
            user_type=model.user_type,
            salary=model.salary,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
