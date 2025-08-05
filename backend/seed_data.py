import pymongo
from datetime import datetime, timedelta
import bcrypt
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
MONGO_URL = os.getenv("MONGO_URL")
client = pymongo.MongoClient(MONGO_URL)
db = client.growe_platform

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed_users():
    users = [
        {
            "id": str(uuid.uuid4()),
            "email": "admin@growe.com",
            "password": hash_password("admin123"),
            "role": "admin",
            "company_name": "Growe",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "email": "partner@logistics.com",
            "password": hash_password("partner123"),
            "role": "3pl_partner",
            "company_name": "Summit Logistics",
            "created_at": datetime.now()
        }
    ]
    
    db.users.delete_many({})
    db.users.insert_many(users)
    print("✅ Users seeded")

def seed_3pls():
    three_pls = [
        {
            "id": str(uuid.uuid4()),
            "company_name": "Summit Logistics",
            "primary_contact": "John Smith",
            "email": "partner@logistics.com",
            "phone": "(555) 123-4567",
            "services": ["Warehousing", "Fulfillment", "Transportation"],
            "regions_covered": ["California", "Nevada", "Arizona"],
            "status": "Engaged",
            "notes": "Key partner with 5 facilities across the West Coast",
            "created_at": datetime.now(),
            "rep_owner": "Sarah Johnson",
            "number_of_locations": 5
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Atlantic Supply Chain",
            "primary_contact": "Mike Davis",
            "email": "mdavis@atlanticsupply.com",
            "phone": "(555) 234-5678",
            "services": ["Warehousing", "Cross-docking", "LTL"],
            "regions_covered": ["New York", "New Jersey", "Pennsylvania"],
            "status": "Matched",
            "notes": "Specialized in e-commerce fulfillment",
            "created_at": datetime.now(),
            "rep_owner": "Tom Wilson",
            "number_of_locations": 3
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Midwest Distribution Co",
            "primary_contact": "Lisa Brown",
            "email": "lbrown@midwestdist.com",
            "phone": "(555) 345-6789",
            "services": ["Warehousing", "Pick & Pack", "Returns Processing"],
            "regions_covered": ["Illinois", "Wisconsin", "Indiana"],
            "status": "New",
            "notes": "Growing 3PL looking to expand capacity",
            "created_at": datetime.now(),
            "rep_owner": "Jennifer Lee",
            "number_of_locations": 2
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Texas Freight Solutions",
            "primary_contact": "Carlos Rodriguez",
            "email": "crodriguez@texasfreight.com",
            "phone": "(555) 456-7890",
            "services": ["Transportation", "Warehousing", "LTL", "FTL"],
            "regions_covered": ["Texas", "Oklahoma", "Louisiana"],
            "status": "Engaged",
            "notes": "Strong transportation network throughout the South",
            "created_at": datetime.now(),
            "rep_owner": "Mark Thompson",
            "number_of_locations": 4
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Pacific Northwest Logistics",
            "primary_contact": "Emily Chen",
            "email": "echen@pnwlogistics.com",
            "phone": "(555) 567-8901",
            "services": ["Warehousing", "Cold Storage", "Food Grade"],
            "regions_covered": ["Washington", "Oregon", "Idaho"],
            "status": "Matched",
            "notes": "Specializes in food and beverage logistics",
            "created_at": datetime.now(),
            "rep_owner": "David Kim",
            "number_of_locations": 3
        }
    ]
    
    db.three_pls.delete_many({})
    db.three_pls.insert_many(three_pls)
    print("✅ 3PLs seeded")
    return three_pls

def seed_warehouses(three_pls):
    warehouses = [
        # Summit Logistics warehouses
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[0]["id"],
            "name": "Summit LA Distribution Center",
            "address": "1234 Industrial Blvd",
            "city": "Los Angeles",
            "state": "CA",
            "zip_code": "90021",
            "lat": 34.0522,
            "lng": -118.2437,
            "growe_represented": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[0]["id"],
            "name": "Summit Oakland Facility",
            "address": "5678 Port Way",
            "city": "Oakland",
            "state": "CA",
            "zip_code": "94607",
            "lat": 37.8044,
            "lng": -122.2712,
            "growe_represented": True,
            "created_at": datetime.now()
        },
        # Atlantic Supply Chain warehouses
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[1]["id"],
            "name": "Atlantic Newark Hub",
            "address": "9101 Commerce Dr",
            "city": "Newark",
            "state": "NJ",
            "zip_code": "07102",
            "lat": 40.7357,
            "lng": -74.1724,
            "growe_represented": False,
            "created_at": datetime.now()
        },
        # Midwest Distribution warehouses
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[2]["id"],
            "name": "Midwest Chicago Center",
            "address": "2345 Logistics Ave",
            "city": "Chicago",
            "state": "IL",
            "zip_code": "60632",
            "lat": 41.8781,
            "lng": -87.6298,
            "growe_represented": True,
            "created_at": datetime.now()
        },
        # Texas Freight Solutions warehouses
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[3]["id"],
            "name": "Texas Dallas Terminal",
            "address": "3456 Freight Rd",
            "city": "Dallas",
            "state": "TX",
            "zip_code": "75207",
            "lat": 32.7767,
            "lng": -96.7970,
            "growe_represented": True,
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[3]["id"],
            "name": "Texas Houston Port Facility",
            "address": "7890 Ship Channel Dr",
            "city": "Houston",
            "state": "TX",
            "zip_code": "77029",
            "lat": 29.7604,
            "lng": -95.3698,
            "growe_represented": False,
            "created_at": datetime.now()
        },
        # Pacific Northwest Logistics warehouses
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[4]["id"],
            "name": "PNW Seattle Cold Storage",
            "address": "4567 Harbor View Dr",
            "city": "Seattle",
            "state": "WA",
            "zip_code": "98134",
            "lat": 47.6062,
            "lng": -122.3321,
            "growe_represented": True,
            "created_at": datetime.now()
        }
    ]
    
    db.warehouses.delete_many({})
    db.warehouses.insert_many(warehouses)
    print("✅ Warehouses seeded")
    return warehouses

def seed_leases(warehouses):
    leases = []
    
    for warehouse in warehouses:
        lease = {
            "id": str(uuid.uuid4()),
            "warehouse_id": warehouse["id"],
            "threepl_id": warehouse["threepl_id"],
            "start_date": datetime.now() - timedelta(days=365 * 2),  # 2 years ago
            "end_date": datetime.now() + timedelta(days=180 + (len(leases) * 30)),  # Spread expiration dates
            "renewal_date": datetime.now() + timedelta(days=150 + (len(leases) * 30)),
            "square_footage": 50000 + (len(leases) * 10000),
            "landlord": f"Property Group {len(leases) + 1}",
            "monthly_rent": 25000 + (len(leases) * 5000),
            "status": "Active",
            "notes": f"Standard warehouse lease for {warehouse['name']}",
            "created_at": datetime.now()
        }
        leases.append(lease)
    
    db.leases.delete_many({})
    db.leases.insert_many(leases)
    print("✅ Leases seeded")

def seed_deals(three_pls):
    deals = [
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[0]["id"],
            "deal_name": "West Coast Expansion - Summit",
            "stage": "In Negotiation",
            "value": 250000,
            "expected_close_date": datetime.now() + timedelta(days=45),
            "notes": "Expansion into new 100k sq ft facility",
            "created_at": datetime.now(),
            "rep_owner": "Sarah Johnson"
        },
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[1]["id"],
            "deal_name": "E-commerce Partnership - Atlantic",
            "stage": "Proposal",
            "value": 180000,
            "expected_close_date": datetime.now() + timedelta(days=30),
            "notes": "New e-commerce client onboarding",
            "created_at": datetime.now(),
            "rep_owner": "Tom Wilson"
        },
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[2]["id"],
            "deal_name": "Midwest Capacity Increase",
            "stage": "Discovery",
            "value": 120000,
            "expected_close_date": datetime.now() + timedelta(days=60),
            "notes": "Additional warehouse space needed",
            "created_at": datetime.now(),
            "rep_owner": "Jennifer Lee"
        },
        {
            "id": str(uuid.uuid4()),
            "threepl_id": three_pls[3]["id"],
            "deal_name": "Texas Transportation Hub",
            "stage": "Won",
            "value": 300000,
            "expected_close_date": datetime.now() - timedelta(days=15),
            "notes": "Major transportation contract secured",
            "created_at": datetime.now(),
            "rep_owner": "Mark Thompson"
        }
    ]
    
    db.deals.delete_many({})
    db.deals.insert_many(deals)
    print("✅ Deals seeded")

def seed_shipper_leads():
    leads = [
        {
            "id": str(uuid.uuid4()),
            "company_name": "TechStart Electronics",
            "contact_name": "Alex Johnson",
            "email": "alex@techstart.com",
            "phone": "(555) 111-2222",
            "product_type": "Consumer Electronics",
            "regions_needed": ["California", "Texas"],
            "monthly_shipments": 500,
            "urgency": "High",
            "matched_3pls": [],
            "status": "New",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "GreenLife Supplements",
            "contact_name": "Maria Garcia",
            "email": "maria@greenlife.com",
            "phone": "(555) 333-4444",
            "product_type": "Health & Wellness",
            "regions_needed": ["New York", "New Jersey"],
            "monthly_shipments": 300,
            "urgency": "Medium",
            "matched_3pls": [],
            "status": "New",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "Urban Fashion Co",
            "contact_name": "David Lee",
            "email": "david@urbanfashion.com",
            "phone": "(555) 555-6666",
            "product_type": "Apparel",
            "regions_needed": ["Illinois", "Wisconsin"],
            "monthly_shipments": 800,
            "urgency": "Low",
            "matched_3pls": [],
            "status": "Matched",
            "created_at": datetime.now()
        },
        {
            "id": str(uuid.uuid4()),
            "company_name": "FreshFood Direct",
            "contact_name": "Rachel Kim",
            "email": "rachel@freshfood.com",
            "phone": "(555) 777-8888",
            "product_type": "Food & Beverage",
            "regions_needed": ["Washington", "Oregon"],
            "monthly_shipments": 1200,
            "urgency": "High",
            "matched_3pls": [],
            "status": "New",
            "created_at": datetime.now()
        }
    ]
    
    db.shipper_leads.delete_many({})
    db.shipper_leads.insert_many(leads)
    print("✅ Shipper leads seeded")

def main():
    print("🌱 Starting database seeding...")
    
    seed_users()
    three_pls = seed_3pls()
    warehouses = seed_warehouses(three_pls)
    seed_leases(warehouses)
    seed_deals(three_pls)
    seed_shipper_leads()
    
    print("\n🎉 Database seeding completed successfully!")
    print("\nDemo accounts:")
    print("Admin: admin@growe.com / admin123")
    print("3PL Partner: partner@logistics.com / partner123")

if __name__ == "__main__":
    main()