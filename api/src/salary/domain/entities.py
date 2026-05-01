from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class MonthlySalaryEntity:
    id: str
    user_id: str
    value: float
    created_at: datetime
    updated_at: datetime
