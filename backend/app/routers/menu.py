from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorCollection
from bson.objectid import ObjectId
from app.db.db import menu_collection  # direct import of your Mongo collection
from app.models import menu_item as schemas

router = APIRouter(prefix="/menu", tags=["Menu"])

# Admin POST route
@router.post("/", response_model=schemas.MenuItemOut)
async def create_menu_item(item: schemas.MenuItemCreate, collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)):
    db_item = item.dict()
    result = await collection.insert_one(db_item)
    db_item["_id"] = str(result.inserted_id)
    return db_item

# User GET route to get all menu items for a restaurant
@router.get("/{restaurant_id}", response_model=list[schemas.MenuItemOut])
async def get_menu_items(restaurant_id: int, collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)):
    cursor = collection.find({"restaurant_id": restaurant_id})
    items = []
    async for document in cursor:
        document["_id"] = str(document["_id"])  # convert ObjectId to str for JSON serialization
        items.append(document)
    return items
