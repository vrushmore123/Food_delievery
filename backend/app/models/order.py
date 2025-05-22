from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    item_id: int
    quantity: int

class OrderCreate(BaseModel):
    user_id: int
    restaurant_id: int
    items: List[OrderItem]

class OrderOut(BaseModel):
    id: int
    user_id: int
    restaurant_id: int
    items: List[OrderItem]

    class Config:
        orm_mode = True
