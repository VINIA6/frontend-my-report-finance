from sqlalchemy.orm import Session
from src.finance.repositories.finance_repository_impl import FinanceRepositoryImpl
from src.finance.controllers.finance_controller import FinanceController


def make_finance_controller(db: Session) -> FinanceController:
    repo = FinanceRepositoryImpl(db)
    return FinanceController(repo)
