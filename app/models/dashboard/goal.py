from pydantic import BaseModel

class Goal(BaseModel):
    id: int
    descricao: str
    niveis: int
    nivel_atual: int = 0
    concluido: bool = False
    para_completar: str
