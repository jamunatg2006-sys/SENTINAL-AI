import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "sentinel_ai")

client = None
db = None


async def connect_to_mongo():
    global client, db
    masked_url = MONGODB_URL.split("@")[-1] if "@" in MONGODB_URL else MONGODB_URL
    print(f"[DB] Connecting to MongoDB cluster at {masked_url} ...")
    client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    db = client[MONGODB_DB_NAME]
    # Verify connection
    await client.admin.command("ping")
    print(f"[DB] [SUCCESS] Connected to database: {MONGODB_DB_NAME}")


async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("[DB] MongoDB connection closed")


def get_database():
    """Return the active database instance."""
    return db
