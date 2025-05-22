from pydantic import BaseModel, EmailStr

class AdminBase(BaseModel):
    name: str
    email: EmailStr

class AdminCreate(AdminBase):
    password: str

class AdminOut(AdminBase):
    id: int

    class Config:
        orm_mode = True
