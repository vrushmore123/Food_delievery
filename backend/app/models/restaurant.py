from pydantic import BaseModel

class RestaurantBase(BaseModel):
    name: str
    location: str

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantOut(RestaurantBase):
    id: int

    class Config:
        orm_mode = True
