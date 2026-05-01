from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.database import get_db
from src.auth.factories.auth_factory import make_auth_controller
from src.auth.controllers.auth_controller import RegisterRequest, LoginRequest

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    controller = make_auth_controller(db)
    return controller.register(body)


@router.post("/login", status_code=status.HTTP_200_OK)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    controller = make_auth_controller(db)
    return controller.login(body)
