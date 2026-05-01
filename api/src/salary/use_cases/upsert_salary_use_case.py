from pydantic import BaseModel
from src.salary.domain.entities import MonthlySalaryEntity
from src.salary.repositories.salary_repository import SalaryRepository


class UpsertSalaryInput(BaseModel):
    value: float


class UpsertSalaryUseCase:

    def __init__(self, salary_repository: SalaryRepository):
        self.salary_repository = salary_repository

    def execute(self, user_id: str, data: UpsertSalaryInput) -> MonthlySalaryEntity:
        return self.salary_repository.upsert(user_id=user_id, value=data.value)
