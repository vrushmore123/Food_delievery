from fastapi import Depends
from .db import menu_collection

# Since Motor client is async and singleton, no need to open/close sessions

async def get_menu_collection():
    return menu_collection
