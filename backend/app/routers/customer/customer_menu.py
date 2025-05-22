from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorCollection
from app.db.db import menu_collection
from app.models import menu_item as schemas

router = APIRouter(prefix="/customer/menu", tags=["Customer Menu"])

@router.get("/{restaurant_id}", response_model=list[schemas.MenuItemOut])
async def get_menu_items(
    restaurant_id: int,
    collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)
):
    cursor = collection.find({"restaurant_id": restaurant_id})
    items = []
    async for document in cursor:
        document["id"] = str(document["_id"])  # convert _id to id
        del document["_id"]
        items.append(document)
    return items

@router.post("/", response_model=schemas.MenuItemOut)
async def create_menu_item(
    item: schemas.MenuItemCreate,
    collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)
):
    db_item = item.dict()
    result = await collection.insert_one(db_item)
    db_item["id"] = str(result.inserted_id)  # convert inserted_id to id string
    return db_item
