from fastapi import FastAPI
from app.routers.vendor import vendor_menu
from app.routers.customer import customer_menu

app = FastAPI()

app.include_router(vendor_menu.router)
app.include_router(customer_menu.router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)