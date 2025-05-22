from pydantic import BaseModel, EmailStr

class ManagerBase(BaseModel):
    name: str
    email: EmailStr
    role: str | None = "manager"

class ManagerCreate(ManagerBase):
    password: str

class ManagerUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: str | None = None
    is_active: bool | None = None

class ManagerOut(ManagerBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True
