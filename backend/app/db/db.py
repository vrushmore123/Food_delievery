from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DETAILS = "mongodb://localhost:27017"  # replace with your MongoDB connection string

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.food_delivery  # your DB name

# Example collections
menu_collection = database.get_collection("menus")
