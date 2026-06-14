from fastapi import APIRouter, HTTPException
from database import get_database
from models.scan_history_schema import (
    SaveScanRequest,
    ScanHistoryResponse,
    GetHistoryResponse,
    ScanHistoryEntry,
)
from datetime import datetime

router = APIRouter(tags=["Scan History"])


# ── POST /history/save ────────────────────────────────────────────────────────
@router.post("/save", response_model=ScanHistoryResponse)
async def save_scan(request: SaveScanRequest):
    print(f"[HISTORY] Saving scan {request.scan_id} for domain: {request.domain}")
    try:
        db = get_database()
        if db is None:
            raise RuntimeError("Database not connected")

        collection = db["scan_history"]

        scan_doc = request.dict()
        scan_doc["created_at"] = datetime.now().isoformat()

        # Upsert — update if scan_id already exists, insert otherwise
        existing = await collection.find_one({"scan_id": request.scan_id})

        if existing:
            await collection.update_one(
                {"scan_id": request.scan_id},
                {"$set": scan_doc}
            )
            print(f"[HISTORY] [SUCCESS] Updated existing scan {request.scan_id}")
        else:
            await collection.insert_one(scan_doc)
            print(f"[HISTORY] [SUCCESS] Inserted new scan {request.scan_id}")

        return ScanHistoryResponse(
            success=True,
            message="Scan saved successfully",
            scan_id=request.scan_id,
        )

    except Exception as e:
        print(f"[HISTORY] [ERROR] Error saving scan: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save scan: {str(e)}")


# ── GET /history/{user_id} ────────────────────────────────────────────────────
@router.get("/{user_id}", response_model=GetHistoryResponse)
async def get_scan_history(user_id: str):
    print(f"[HISTORY] Fetching scan history for user: {user_id}")
    try:
        db = get_database()
        if db is None:
            raise RuntimeError("Database not connected")

        collection = db["scan_history"]

        # Newest first
        cursor = collection.find({"user_id": user_id}).sort("created_at", -1)

        scans = []
        async for doc in cursor:
            doc.pop("_id", None)       # remove MongoDB ObjectId — not JSON-serialisable
            doc.pop("created_at", None)  # internal field, not in schema
            scans.append(ScanHistoryEntry(**doc))

        print(f"[HISTORY] [SUCCESS] Found {len(scans)} scan(s) for {user_id}")
        return GetHistoryResponse(
            success=True,
            user_id=user_id,
            total_scans=len(scans),
            scans=scans,
        )

    except Exception as e:
        print(f"[HISTORY] [ERROR] Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


# ── DELETE /history/{user_id}/{scan_id} ───────────────────────────────────────
@router.delete("/{user_id}/{scan_id}")
async def delete_scan(user_id: str, scan_id: str):
    print(f"[HISTORY] Deleting scan {scan_id} for user {user_id}")
    try:
        db = get_database()
        if db is None:
            raise RuntimeError("Database not connected")

        collection = db["scan_history"]
        result = await collection.delete_one({"user_id": user_id, "scan_id": scan_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Scan not found")

        print(f"[HISTORY] [SUCCESS] Deleted scan {scan_id}")
        return {"success": True, "message": f"Scan {scan_id} deleted"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[HISTORY] [ERROR] Error deleting scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))
