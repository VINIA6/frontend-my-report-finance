from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.routes.auth_routes import router as auth_router
from src.fixed_expenses.routes.expense_routes import router as expenses_router
from src.salary.routes.salary_routes import router as salary_router

app = FastAPI(
    title="My Report Finance API",
    description="API de gestão de finanças pessoais",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(expenses_router, prefix="/api/v1")
app.include_router(salary_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
