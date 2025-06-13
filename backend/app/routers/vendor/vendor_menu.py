from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorCollection
from app.db.db import menu_collection
from app.models import menu_item as schemas
import logging

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

@router.get("/", response_model=list[schemas.MenuItemOut])
async def get_menu_items(
    collection: AsyncIOMotorCollection = Depends(lambda: menu_collection)
):
    items = await collection.find().to_list(100)  # Limit to 100 items
    for item in items:
        item["id"] = str(item.pop("_id"))  # Rename _id to id
        item.setdefault("location", None)  # Ensure location is present
        item.setdefault("categories", [])  # Ensure categories is present
    logging.info(f"Response data: {items}")  # Log the response data
    return items

