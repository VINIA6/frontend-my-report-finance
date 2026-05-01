from typing import Optional
from src.salary.domain.entities import MonthlySalaryEntity
from src.salary.repositories.salary_repository import SalaryRepository


class GetSalaryUseCase:

    def __init__(self, salary_repository: SalaryRepository):
        self.salary_repository = salary_repository

    def execute(self, user_id: str) -> Optional[MonthlySalaryEntity]:
        return self.salary_repository.find_by_user(user_id)
