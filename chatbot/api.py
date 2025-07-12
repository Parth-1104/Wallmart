# app.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from embed import query_item_location

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[" http://localhost:5173"],  # for dev; restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/product-location")
async def get_location(data: dict):
    query = data.get(query_item_location)
    if not query:
        return {"error": "No query provided"}
    
    result = query_item_location(query)
    return result
