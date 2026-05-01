from src.salary.repositories.salary_repository import SalaryRepository


class DeleteSalaryUseCase:

    def __init__(self, salary_repository: SalaryRepository):
        self.salary_repository = salary_repository

    def execute(self, user_id: str) -> None:
        self.salary_repository.delete(user_id=user_id)
