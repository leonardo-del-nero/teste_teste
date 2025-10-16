from pydantic import BaseModel
from typing import List
from .badge import Badge
from .goal import Goal


class Pilar(BaseModel):
    nome: str
    progresso: float
    badges: List[Badge]
    objetivos: List[Goal]
