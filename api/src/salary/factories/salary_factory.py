from sqlalchemy.orm import Session
from src.salary.repositories.salary_repository_impl import SalaryRepositoryImpl
from src.salary.use_cases.get_salary_use_case import GetSalaryUseCase
from src.salary.use_cases.upsert_salary_use_case import UpsertSalaryUseCase
from src.salary.use_cases.delete_salary_use_case import DeleteSalaryUseCase
from src.salary.controllers.salary_controller import SalaryController


def make_salary_controller(db: Session) -> SalaryController:
    repository = SalaryRepositoryImpl(db)
    return SalaryController(
        get_use_case=GetSalaryUseCase(repository),
        upsert_use_case=UpsertSalaryUseCase(repository),
        delete_use_case=DeleteSalaryUseCase(repository),
    )
