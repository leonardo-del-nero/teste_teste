from pydantic import BaseModel
from typing import List
from .pilar import Pilar

class DashboardState(BaseModel):
    score_geral: float
    pilares: List[Pilar]
