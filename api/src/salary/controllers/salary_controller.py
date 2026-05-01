from pydantic import BaseModel
from src.salary.use_cases.get_salary_use_case import GetSalaryUseCase
from src.salary.use_cases.upsert_salary_use_case import UpsertSalaryUseCase, UpsertSalaryInput
from src.salary.use_cases.delete_salary_use_case import DeleteSalaryUseCase


class SalaryRequest(BaseModel):
    value: float


class SalaryController:

    def __init__(
        self,
        get_use_case: GetSalaryUseCase,
        upsert_use_case: UpsertSalaryUseCase,
        delete_use_case: DeleteSalaryUseCase,
    ):
        self.get_use_case = get_use_case
        self.upsert_use_case = upsert_use_case
        self.delete_use_case = delete_use_case

    def get_salary(self, user_id: str):
        salary = self.get_use_case.execute(user_id)
        if not salary:
            return None
        return self._serialize(salary)

    def upsert_salary(self, user_id: str, body: SalaryRequest):
        salary = self.upsert_use_case.execute(
            user_id=user_id,
            data=UpsertSalaryInput(value=body.value),
        )
        return self._serialize(salary)

    def delete_salary(self, user_id: str):
        self.delete_use_case.execute(user_id=user_id)
        return {"message": "Salário removido com sucesso"}

    def _serialize(self, entity):
        return {
            "id": entity.id,
            "user_id": entity.user_id,
            "value": entity.value,
            "created_at": entity.created_at,
            "updated_at": entity.updated_at,
        }
