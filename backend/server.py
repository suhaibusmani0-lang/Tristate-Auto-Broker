from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime
import uuid
import shutil

import cloudinary
import cloudinary.uploader

from models import (
    Vehicle, VehicleCreate, VehicleUpdate,
    ContactSubmission, VehicleFinderSubmission, CreditApplication,
    Deposit, VehicleInquiry, FormResponse,
    AdminLoginRequest, AdminLoginResponse, SubmissionCounts,
)
from seed_data import SEED_VEHICLES
from auth import (
    verify_password, hash_password, create_token, require_admin
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Local uploads directory
UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# Cloudinary configuration
CLOUDINARY_ENABLED = bool(
    os.environ.get('CLOUDINARY_CLOUD_NAME') and
    os.environ.get('CLOUDINARY_API_KEY') and
    os.environ.get('CLOUDINARY_API_SECRET')
)
if CLOUDINARY_ENABLED:
    cloudinary.config(
        cloud_name=os.environ['CLOUDINARY_CLOUD_NAME'],
        api_key=os.environ['CLOUDINARY_API_KEY'],
        api_secret=os.environ['CLOUDINARY_API_SECRET'],
        secure=True,
    )

app = FastAPI(title="Tri State Auto Brokers API")

# Serve uploaded images at /uploads/*
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ADMIN_USERNAME_DEFAULT = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_DEFAULT = os.environ.get('ADMIN_PASSWORD', 'admin123')


def _clean(doc):
    if doc and '_id' in doc:
        doc.pop('_id', None)
    return doc


def _public_url(request_host: str, path: str) -> str:
    """Return public URL for uploaded image."""
    return path  # Frontend prepends REACT_APP_BACKEND_URL


@api_router.get("/")
async def root():
    return {
        "message": "Tri State Auto Brokers API",
        "cloudinary": CLOUDINARY_ENABLED,
        "local_uploads": True,
    }


# ---------- ADMIN AUTH ----------
@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(payload: AdminLoginRequest):
    doc = await db.admin_users.find_one({"username": payload.username})
    if not doc or not verify_password(payload.password, doc.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(payload.username)
    return AdminLoginResponse(token=token, username=payload.username)


@api_router.get("/admin/me")
async def admin_me(user=Depends(require_admin)):
    return {"username": user.get('sub'), "role": user.get('role')}


@api_router.get("/admin/counts", response_model=SubmissionCounts)
async def admin_counts(user=Depends(require_admin)):
    return SubmissionCounts(
        contact=await db.contact_submissions.count_documents({}),
        vehicle_finder=await db.vehicle_finder_submissions.count_documents({}),
        credit_application=await db.credit_applications.count_documents({}),
        deposit=await db.deposits.count_documents({}),
        inquiry=await db.vehicle_inquiries.count_documents({}),
        vehicles=await db.vehicles.count_documents({}),
    )


async def _list_submissions(collection):
    items = await collection.find().sort([("created_at", -1)]).to_list(500)
    return [_clean(i) for i in items]


@api_router.get("/admin/submissions/contact")
async def admin_contact(user=Depends(require_admin)):
    return await _list_submissions(db.contact_submissions)


@api_router.get("/admin/submissions/vehicle-finder")
async def admin_vf(user=Depends(require_admin)):
    return await _list_submissions(db.vehicle_finder_submissions)


@api_router.get("/admin/submissions/credit-applications")
async def admin_ca(user=Depends(require_admin)):
    return await _list_submissions(db.credit_applications)


@api_router.get("/admin/submissions/deposits")
async def admin_dep(user=Depends(require_admin)):
    return await _list_submissions(db.deposits)


@api_router.get("/admin/submissions/inquiries")
async def admin_inq(user=Depends(require_admin)):
    return await _list_submissions(db.vehicle_inquiries)


@api_router.delete("/admin/submissions/{kind}/{sid}")
async def admin_delete_submission(kind: str, sid: str, user=Depends(require_admin)):
    mapping = {
        'contact': db.contact_submissions,
        'vehicle-finder': db.vehicle_finder_submissions,
        'credit-applications': db.credit_applications,
        'deposits': db.deposits,
        'inquiries': db.vehicle_inquiries,
    }
    col = mapping.get(kind)
    if col is None:
        raise HTTPException(status_code=404, detail="Unknown submission type")
    res = await col.delete_one({"id": sid})
    return {"deleted": res.deleted_count}


# ---------- VEHICLES (public read, admin write) ----------
@api_router.get("/vehicles", response_model=List[Vehicle])
async def list_vehicles(sort: Optional[str] = None):
    sort_map = {
        'year_desc': [('year', -1)],
        'year_asc': [('year', 1)],
        'mileage_asc': [('mileage', 1)],
        'mileage_desc': [('mileage', -1)],
    }
    cursor = db.vehicles.find()
    if sort in sort_map:
        cursor = cursor.sort(sort_map[sort])
    else:
        cursor = cursor.sort([('year', -1), ('created_at', -1)])
    items = await cursor.to_list(500)
    return [Vehicle(**_clean(v)) for v in items]


@api_router.get("/vehicles/{vehicle_id}", response_model=Vehicle)
async def get_vehicle(vehicle_id: str):
    doc = await db.vehicles.find_one({"id": vehicle_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return Vehicle(**_clean(doc))


@api_router.post("/vehicles", response_model=Vehicle)
async def create_vehicle(payload: VehicleCreate, user=Depends(require_admin)):
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['created_at'] = datetime.utcnow()
    data['updated_at'] = datetime.utcnow()
    if not data.get('images'):
        data['images'] = []
    await db.vehicles.insert_one(data)
    return Vehicle(**_clean(data))


@api_router.put("/vehicles/{vehicle_id}", response_model=Vehicle)
async def update_vehicle(vehicle_id: str, payload: VehicleUpdate, user=Depends(require_admin)):
    update = {k: v for k, v in payload.dict(exclude_unset=True).items() if v is not None}
    update['updated_at'] = datetime.utcnow()
    res = await db.vehicles.update_one({"id": vehicle_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    doc = await db.vehicles.find_one({"id": vehicle_id})
    return Vehicle(**_clean(doc))


@api_router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(vehicle_id: str, user=Depends(require_admin)):
    doc = await db.vehicles.find_one({"id": vehicle_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    for img in doc.get('images', []):
        pid = img.get('public_id')
        if pid and CLOUDINARY_ENABLED and not pid.startswith('local:'):
            try:
                cloudinary.uploader.destroy(pid)
            except Exception as e:
                logger.warning(f"Cloudinary destroy failed: {e}")
        elif pid and pid.startswith('local:'):
            local_path = UPLOAD_DIR / pid.replace('local:', '')
            if local_path.exists():
                local_path.unlink()

    await db.vehicles.delete_one({"id": vehicle_id})
    return {"success": True}


@api_router.post("/vehicles/{vehicle_id}/images", response_model=Vehicle)
async def upload_vehicle_image(
    vehicle_id: str,
    file: UploadFile = File(...),
    user=Depends(require_admin),
):
    doc = await db.vehicles.find_one({"id": vehicle_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    content = await file.read()

    if CLOUDINARY_ENABLED:
        try:
            result = cloudinary.uploader.upload(
                content,
                folder=f"tristate_auto_brokers/vehicles/{vehicle_id}",
                resource_type="image",
            )
            image = {"url": result['secure_url'], "public_id": result['public_id']}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {e}")
    else:
        # Local storage fallback
        ext = (file.filename or 'jpg').split('.')[-1].lower()
        if ext not in ('jpg', 'jpeg', 'png', 'webp', 'gif'):
            ext = 'jpg'
        fname = f"{vehicle_id}_{uuid.uuid4().hex[:8]}.{ext}"
        target = UPLOAD_DIR / fname
        with open(target, 'wb') as f:
            f.write(content)
        image = {"url": f"/uploads/{fname}", "public_id": f"local:{fname}"}

    await db.vehicles.update_one(
        {"id": vehicle_id},
        {"$push": {"images": image}, "$set": {"updated_at": datetime.utcnow()}},
    )
    updated = await db.vehicles.find_one({"id": vehicle_id})
    return Vehicle(**_clean(updated))


@api_router.delete("/vehicles/{vehicle_id}/images")
async def delete_vehicle_image(vehicle_id: str, public_id: str, user=Depends(require_admin)):
    doc = await db.vehicles.find_one({"id": vehicle_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if public_id.startswith('local:'):
        local_path = UPLOAD_DIR / public_id.replace('local:', '')
        if local_path.exists():
            local_path.unlink()
    elif CLOUDINARY_ENABLED:
        try:
            cloudinary.uploader.destroy(public_id)
        except Exception as e:
            logger.warning(f"Cloudinary destroy failed: {e}")
    await db.vehicles.update_one(
        {"id": vehicle_id},
        {"$pull": {"images": {"public_id": public_id}}},
    )
    return {"success": True}


@api_router.post("/seed")
async def seed_vehicles(user=Depends(require_admin)):
    count = await db.vehicles.count_documents({})
    if count > 0:
        return {"seeded": False, "existing": count, "message": "Already seeded"}
    docs = []
    now = datetime.utcnow()
    for v in SEED_VEHICLES:
        d = dict(v)
        d['id'] = str(uuid.uuid4())
        d['created_at'] = now
        d['updated_at'] = now
        docs.append(d)
    if docs:
        await db.vehicles.insert_many(docs)
    return {"seeded": True, "count": len(docs)}


# ---------- FORMS (public write) ----------
@api_router.post("/contact", response_model=FormResponse)
async def submit_contact(payload: ContactSubmission):
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['created_at'] = datetime.utcnow()
    await db.contact_submissions.insert_one(data)
    return FormResponse(id=data['id'])


@api_router.post("/vehicle-finder", response_model=FormResponse)
async def submit_vehicle_finder(payload: VehicleFinderSubmission):
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['created_at'] = datetime.utcnow()
    await db.vehicle_finder_submissions.insert_one(data)
    return FormResponse(id=data['id'])


@api_router.post("/credit-application", response_model=FormResponse)
async def submit_credit_app(payload: CreditApplication):
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['created_at'] = datetime.utcnow()
    await db.credit_applications.insert_one(data)
    return FormResponse(id=data['id'])


@api_router.post("/deposit", response_model=FormResponse)
async def submit_deposit(payload: Deposit):
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['created_at'] = datetime.utcnow()
    await db.deposits.insert_one(data)
    return FormResponse(id=data['id'])


@api_router.post("/vehicles/{vehicle_id}/inquire", response_model=FormResponse)
async def submit_inquiry(vehicle_id: str, payload: VehicleInquiry):
    doc = await db.vehicles.find_one({"id": vehicle_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    data = payload.dict()
    data['id'] = str(uuid.uuid4())
    data['vehicle_id'] = vehicle_id
    data['vehicle_title'] = f"{doc.get('year')} {doc.get('make')} {doc.get('model')} {doc.get('trim', '')}".strip()
    data['created_at'] = datetime.utcnow()
    await db.vehicle_inquiries.insert_one(data)
    return FormResponse(id=data['id'])


# ---------- APP SETUP ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # Auto-seed vehicles if empty
    try:
        count = await db.vehicles.count_documents({})
        if count == 0:
            docs = []
            now = datetime.utcnow()
            for v in SEED_VEHICLES:
                d = dict(v)
                d['id'] = str(uuid.uuid4())
                d['created_at'] = now
                d['updated_at'] = now
                docs.append(d)
            if docs:
                await db.vehicles.insert_many(docs)
                logger.info(f"Auto-seeded {len(docs)} vehicles")
    except Exception as e:
        logger.error(f"Startup seed error: {e}")

    # Ensure default admin user exists
    try:
        admin = await db.admin_users.find_one({"username": ADMIN_USERNAME_DEFAULT})
        if not admin:
            await db.admin_users.insert_one({
                "username": ADMIN_USERNAME_DEFAULT,
                "password_hash": hash_password(ADMIN_PASSWORD_DEFAULT),
                "created_at": datetime.utcnow(),
            })
            logger.info(f"Created default admin user: {ADMIN_USERNAME_DEFAULT}")
    except Exception as e:
        logger.error(f"Admin bootstrap error: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
