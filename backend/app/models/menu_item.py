from pydantic import BaseModel

class MenuItemBase(BaseModel):
    name: str
    price: float
    description: str | None = None
    location: str | None = None  # Make location optional
    categories: list[str] | None = []  # Default to an empty list

class MenuItemCreate(MenuItemBase):
    restaurant_id: int

class MenuItemOut(MenuItemBase):
    id: str
    restaurant_id: int

    class Config:
        orm_mode = True
