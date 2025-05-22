from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorCollection
from app.db.db import menu_collection
from app.models import menu_item as schemas

router = APIRouter(prefix="/vendor/menu", tags=["Vendor Menu"])

@router.post("/", response_model=schemas.MenuItemOut)
async def create_menu_item(
    item: schemas.MenuItemCreate,
    collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)
):
    db_item = item.dict()
    result = await collection.insert_one(db_item)
    db_item["id"] = str(result.inserted_id)  # rename _id to id
    return db_item

