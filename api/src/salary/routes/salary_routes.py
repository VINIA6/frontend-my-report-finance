from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.shared.security import get_current_user_id
from src.salary.factories.salary_factory import make_salary_controller
from src.salary.controllers.salary_controller import SalaryRequest

router = APIRouter(prefix="/salary", tags=["Salary"])


@router.get("", status_code=status.HTTP_200_OK)
def get_salary(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_salary_controller(db)
    return controller.get_salary(user_id)


@router.put("", status_code=status.HTTP_200_OK)
def upsert_salary(
    body: SalaryRequest,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_salary_controller(db)
    return controller.upsert_salary(user_id, body)


@router.delete("", status_code=status.HTTP_200_OK)
def delete_salary(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    controller = make_salary_controller(db)
    return controller.delete_salary(user_id)
