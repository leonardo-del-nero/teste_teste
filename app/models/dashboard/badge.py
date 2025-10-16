from pydantic import BaseModel

class Badge(BaseModel):
    id: int
    nome: str
    niveis: int
    nivel_atual: int 
    descricao: str
