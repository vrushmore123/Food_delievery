from pydantic import BaseModel

class MenuItemBase(BaseModel):
    name: str
    price: float
    description: str | None = None

class MenuItemCreate(MenuItemBase):
    restaurant_id: int

class MenuItemOut(MenuItemBase):
    id: str                 # <-- Change from int to str
    restaurant_id: int

    class Config:
        orm_mode = True
