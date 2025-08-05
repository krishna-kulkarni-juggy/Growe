from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid
from typing import List, Optional
from pydantic import BaseModel
import bcrypt
import jwt

load_dotenv()

app = FastAPI(title="Growe Logistics Platform", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.growe_platform

# Security
security = HTTPBearer()
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Pydantic Models
class User(BaseModel):
    id: Optional[str] = None
    email: str
    role: str  # admin, 3pl_partner, viewer
    company_name: Optional[str] = None
    created_at: Optional[datetime] = None

class UserLogin(BaseModel):
    email: str
    password: str

class ThreePL(BaseModel):
    id: Optional[str] = None
    company_name: str
    primary_contact: str
    email: str
    phone: str
    services: List[str] = []
    regions_covered: List[str] = []
    status: str = "New"  # New, Engaged, Matched, Dormant, Expired
    notes: str = ""
    created_at: Optional[datetime] = None
    rep_owner: str = ""
    number_of_locations: int = 0

class Warehouse(BaseModel):
    id: Optional[str] = None
    threepl_id: str
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    lat: float
    lng: float
    growe_represented: bool = True
    created_at: Optional[datetime] = None

class Lease(BaseModel):
    id: Optional[str] = None
    warehouse_id: str
    threepl_id: str
    start_date: datetime
    end_date: datetime
    renewal_date: Optional[datetime] = None
    square_footage: int
    landlord: str
    monthly_rent: float
    status: str = "Active"  # Active, Expiring, Expired, Renewed
    notes: str = ""
    created_at: Optional[datetime] = None

class Deal(BaseModel):
    id: Optional[str] = None
    threepl_id: str
    deal_name: str
    stage: str = "New"  # New, Discovery, Proposal, In Negotiation, Won, Lost
    value: Optional[float] = None
    expected_close_date: Optional[datetime] = None
    notes: str = ""
    created_at: Optional[datetime] = None
    rep_owner: str = ""

class ShipperLead(BaseModel):
    id: Optional[str] = None
    company_name: str
    contact_name: str
    email: str
    phone: str
    product_type: str
    regions_needed: List[str] = []
    monthly_shipments: int
    urgency: str = "Medium"  # Low, Medium, High
    matched_3pls: List[str] = []
    status: str = "New"  # New, Matched, Converted, Lost
    created_at: Optional[datetime] = None

# Auth functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_data: dict) -> str:
    payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "role": user_data["role"],
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    user = db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    })
    
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "company_name": user.get("company_name", "")
        }
    }

@app.get("/api/3pls")
async def get_3pls(current_user: dict = Depends(verify_token)):
    three_pls = list(db.three_pls.find())
    for threepl in three_pls:
        threepl["id"] = str(threepl["_id"])
        del threepl["_id"]
    return three_pls

@app.post("/api/3pls")
async def create_3pl(threepl: ThreePL, current_user: dict = Depends(verify_token)):
    if current_user["role"] not in ["admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    threepl_dict = threepl.dict()
    threepl_dict["created_at"] = datetime.now()
    threepl_dict["id"] = str(uuid.uuid4())
    
    result = db.three_pls.insert_one(threepl_dict)
    return threepl_dict

@app.get("/api/warehouses")
async def get_warehouses(current_user: dict = Depends(verify_token)):
    warehouses = list(db.warehouses.find())
    for warehouse in warehouses:
        warehouse["id"] = str(warehouse["_id"])
        del warehouse["_id"]
    return warehouses

@app.post("/api/warehouses")
async def create_warehouse(warehouse: Warehouse, current_user: dict = Depends(verify_token)):
    if current_user["role"] not in ["admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    warehouse_dict = warehouse.dict()
    warehouse_dict["created_at"] = datetime.now()
    warehouse_dict["id"] = str(uuid.uuid4())
    
    result = db.warehouses.insert_one(warehouse_dict)
    return warehouse_dict

@app.get("/api/leases")
async def get_leases(current_user: dict = Depends(verify_token)):
    leases = list(db.leases.find())
    for lease in leases:
        lease["id"] = str(lease["_id"])
        del lease["_id"]
    return leases

@app.get("/api/leases/expiring")
async def get_expiring_leases(current_user: dict = Depends(verify_token)):
    six_months_from_now = datetime.now() + timedelta(days=180)
    expiring_leases = list(db.leases.find({
        "end_date": {"$lte": six_months_from_now},
        "status": "Active"
    }))
    
    for lease in expiring_leases:
        lease["id"] = str(lease["_id"])
        del lease["_id"]
    
    return expiring_leases

@app.post("/api/leases")
async def create_lease(lease: Lease, current_user: dict = Depends(verify_token)):
    if current_user["role"] not in ["admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    lease_dict = lease.dict()
    lease_dict["created_at"] = datetime.now()
    lease_dict["id"] = str(uuid.uuid4())
    
    result = db.leases.insert_one(lease_dict)
    return lease_dict

@app.get("/api/deals")
async def get_deals(current_user: dict = Depends(verify_token)):
    deals = list(db.deals.find())
    for deal in deals:
        deal["id"] = str(deal["_id"])
        del deal["_id"]
    return deals

@app.post("/api/deals")
async def create_deal(deal: Deal, current_user: dict = Depends(verify_token)):
    deal_dict = deal.dict()
    deal_dict["created_at"] = datetime.now()
    deal_dict["id"] = str(uuid.uuid4())
    
    result = db.deals.insert_one(deal_dict)
    return deal_dict

@app.put("/api/deals/{deal_id}")
async def update_deal(deal_id: str, deal: Deal, current_user: dict = Depends(verify_token)):
    deal_dict = deal.dict()
    del deal_dict["id"]
    
    result = db.deals.update_one({"id": deal_id}, {"$set": deal_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return {"message": "Deal updated successfully"}

@app.post("/api/shipper-leads")
async def create_shipper_lead(lead: ShipperLead):
    lead_dict = lead.dict()
    lead_dict["created_at"] = datetime.now()
    lead_dict["id"] = str(uuid.uuid4())
    
    result = db.shipper_leads.insert_one(lead_dict)
    return lead_dict

@app.get("/api/shipper-leads")
async def get_shipper_leads(current_user: dict = Depends(verify_token)):
    leads = list(db.shipper_leads.find())
    for lead in leads:
        lead["id"] = str(lead["_id"])
        del lead["_id"]
    return leads

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(verify_token)):
    total_3pls = db.three_pls.count_documents({})
    total_warehouses = db.warehouses.count_documents({})
    active_deals = db.deals.count_documents({"stage": {"$nin": ["Won", "Lost"]}})
    expiring_leases = db.leases.count_documents({
        "end_date": {"$lte": datetime.now() + timedelta(days=180)},
        "status": "Active"
    })
    new_leads = db.shipper_leads.count_documents({"status": "New"})
    
    return {
        "total_3pls": total_3pls,
        "total_warehouses": total_warehouses,
        "active_deals": active_deals,
        "expiring_leases": expiring_leases,
        "new_leads": new_leads
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)