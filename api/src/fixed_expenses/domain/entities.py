from dataclasses import dataclass
from datetime import datetime


@dataclass
class FixedExpenseEntity:
    id: str
    user_id: str
    name: str
    value: float
    color: str
    created_at: datetime
    updated_at: datetime
