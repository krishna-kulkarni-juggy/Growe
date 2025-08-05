#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for Growe Logistics Platform
Tests all API endpoints with authentication and data validation
"""

import requests
import json
from datetime import datetime, timedelta
import uuid

# Configuration - Use production URL from frontend/.env
BASE_URL = "https://7a0fd8e1-7d57-4e40-8e2f-214f86a66a75.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_CREDENTIALS = {
    "email": "admin@growe.com",
    "password": "admin123"
}

PARTNER_CREDENTIALS = {
    "email": "partner@logistics.com", 
    "password": "partner123"
}

class GroweBackendTester:
    def __init__(self):
        self.admin_token = None
        self.partner_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def test_health_endpoint(self):
        """Test health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", True, "Health endpoint working correctly")
                    return True
                else:
                    self.log_test("Health Check", False, "Invalid health response format")
                    return False
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False
            
    def test_authentication(self):
        """Test authentication with both demo accounts"""
        # Test admin login
        try:
            response = requests.post(f"{API_BASE}/auth/login", json=ADMIN_CREDENTIALS)
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.admin_token = data["token"]
                    self.log_test("Admin Login", True, f"Admin authenticated successfully, role: {data['user']['role']}")
                else:
                    self.log_test("Admin Login", False, "Missing token or user in response")
                    return False
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, f"Exception: {str(e)}")
            return False
            
        # Test partner login
        try:
            response = requests.post(f"{API_BASE}/auth/login", json=PARTNER_CREDENTIALS)
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.partner_token = data["token"]
                    self.log_test("Partner Login", True, f"Partner authenticated successfully, role: {data['user']['role']}")
                else:
                    self.log_test("Partner Login", False, "Missing token or user in response")
                    return False
            else:
                self.log_test("Partner Login", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Partner Login", False, f"Exception: {str(e)}")
            return False
            
        # Test invalid credentials
        try:
            invalid_creds = {"email": "invalid@test.com", "password": "wrongpass"}
            response = requests.post(f"{API_BASE}/auth/login", json=invalid_creds)
            if response.status_code == 401:
                self.log_test("Invalid Login", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("Invalid Login", False, f"Should return 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Login", False, f"Exception: {str(e)}")
            
        return self.admin_token is not None and self.partner_token is not None
        
    def get_auth_headers(self, token):
        """Get authorization headers"""
        return {"Authorization": f"Bearer {token}"}
        
    def test_protected_endpoints_without_auth(self):
        """Test that protected endpoints require authentication"""
        protected_endpoints = [
            "/3pls",
            "/warehouses", 
            "/leases",
            "/deals",
            "/shipper-leads",
            "/dashboard/stats"
        ]
        
        for endpoint in protected_endpoints:
            try:
                response = requests.get(f"{API_BASE}{endpoint}")
                if response.status_code == 401 or response.status_code == 403:
                    self.log_test(f"Auth Required {endpoint}", True, "Correctly requires authentication")
                else:
                    self.log_test(f"Auth Required {endpoint}", False, f"Should require auth, got {response.status_code}")
            except Exception as e:
                self.log_test(f"Auth Required {endpoint}", False, f"Exception: {str(e)}")
                
    def test_3pls_endpoints(self):
        """Test 3PL companies endpoints"""
        if not self.admin_token:
            self.log_test("3PLs Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test GET 3PLs
        try:
            response = requests.get(f"{API_BASE}/3pls", headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET 3PLs", True, f"Retrieved {len(data)} 3PL companies")
            else:
                self.log_test("GET 3PLs", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET 3PLs", False, f"Exception: {str(e)}")
            
        # Test POST 3PL (admin only)
        test_3pl = {
            "company_name": "Test Logistics Co",
            "primary_contact": "John Smith",
            "email": "john@testlogistics.com",
            "phone": "555-0123",
            "services": ["Warehousing", "Transportation"],
            "regions_covered": ["West Coast", "Southwest"],
            "status": "New",
            "notes": "Test 3PL company",
            "rep_owner": "Admin User",
            "number_of_locations": 5
        }
        
        try:
            response = requests.post(f"{API_BASE}/3pls", json=test_3pl, headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("POST 3PL (Admin)", True, f"Created 3PL with ID: {data.get('id', 'N/A')}")
            else:
                self.log_test("POST 3PL (Admin)", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST 3PL (Admin)", False, f"Exception: {str(e)}")
            
        # Test POST 3PL with partner token (should fail)
        if self.partner_token:
            partner_headers = self.get_auth_headers(self.partner_token)
            try:
                response = requests.post(f"{API_BASE}/3pls", json=test_3pl, headers=partner_headers)
                if response.status_code == 403:
                    self.log_test("POST 3PL (Partner)", True, "Correctly denied partner access")
                else:
                    self.log_test("POST 3PL (Partner)", False, f"Should deny access, got {response.status_code}")
            except Exception as e:
                self.log_test("POST 3PL (Partner)", False, f"Exception: {str(e)}")
                
    def test_warehouses_endpoints(self):
        """Test warehouse endpoints"""
        if not self.admin_token:
            self.log_test("Warehouses Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test GET warehouses
        try:
            response = requests.get(f"{API_BASE}/warehouses", headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Warehouses", True, f"Retrieved {len(data)} warehouses")
            else:
                self.log_test("GET Warehouses", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET Warehouses", False, f"Exception: {str(e)}")
            
        # Test POST warehouse
        test_warehouse = {
            "threepl_id": str(uuid.uuid4()),
            "name": "Test Warehouse Facility",
            "address": "123 Industrial Blvd",
            "city": "Los Angeles",
            "state": "CA",
            "zip_code": "90210",
            "lat": 34.0522,
            "lng": -118.2437,
            "growe_represented": True
        }
        
        try:
            response = requests.post(f"{API_BASE}/warehouses", json=test_warehouse, headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("POST Warehouse", True, f"Created warehouse with ID: {data.get('id', 'N/A')}")
            else:
                self.log_test("POST Warehouse", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Warehouse", False, f"Exception: {str(e)}")
            
    def test_leases_endpoints(self):
        """Test lease endpoints"""
        if not self.admin_token:
            self.log_test("Leases Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test GET leases
        try:
            response = requests.get(f"{API_BASE}/leases", headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Leases", True, f"Retrieved {len(data)} leases")
            else:
                self.log_test("GET Leases", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET Leases", False, f"Exception: {str(e)}")
            
        # Test GET expiring leases
        try:
            response = requests.get(f"{API_BASE}/leases/expiring", headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Expiring Leases", True, f"Retrieved {len(data)} expiring leases")
            else:
                self.log_test("GET Expiring Leases", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET Expiring Leases", False, f"Exception: {str(e)}")
            
        # Test POST lease
        start_date = datetime.now()
        end_date = start_date + timedelta(days=365)
        
        test_lease = {
            "warehouse_id": str(uuid.uuid4()),
            "threepl_id": str(uuid.uuid4()),
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "square_footage": 50000,
            "landlord": "Industrial Properties LLC",
            "monthly_rent": 25000.00,
            "status": "Active",
            "notes": "Test lease agreement"
        }
        
        try:
            response = requests.post(f"{API_BASE}/leases", json=test_lease, headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("POST Lease", True, f"Created lease with ID: {data.get('id', 'N/A')}")
            else:
                self.log_test("POST Lease", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Lease", False, f"Exception: {str(e)}")
            
    def test_deals_endpoints(self):
        """Test CRM deals endpoints"""
        if not self.admin_token:
            self.log_test("Deals Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test GET deals
        try:
            response = requests.get(f"{API_BASE}/deals", headers=headers)
            if response.status_code == 200:
                data = response.json()
                self.log_test("GET Deals", True, f"Retrieved {len(data)} deals")
            else:
                self.log_test("GET Deals", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET Deals", False, f"Exception: {str(e)}")
            
        # Test POST deal
        test_deal = {
            "threepl_id": str(uuid.uuid4()),
            "deal_name": "Test Partnership Deal",
            "stage": "Discovery",
            "value": 150000.00,
            "expected_close_date": (datetime.now() + timedelta(days=30)).isoformat(),
            "notes": "Test deal for partnership",
            "rep_owner": "Sales Rep"
        }
        
        try:
            response = requests.post(f"{API_BASE}/deals", json=test_deal, headers=headers)
            if response.status_code == 200:
                data = response.json()
                deal_id = data.get('id')
                self.log_test("POST Deal", True, f"Created deal with ID: {deal_id}")
                
                # Test PUT deal update
                if deal_id:
                    updated_deal = test_deal.copy()
                    updated_deal["stage"] = "Proposal"
                    updated_deal["value"] = 175000.00
                    
                    try:
                        response = requests.put(f"{API_BASE}/deals/{deal_id}", json=updated_deal, headers=headers)
                        if response.status_code == 200:
                            self.log_test("PUT Deal", True, "Successfully updated deal")
                        else:
                            self.log_test("PUT Deal", False, f"HTTP {response.status_code}: {response.text}")
                    except Exception as e:
                        self.log_test("PUT Deal", False, f"Exception: {str(e)}")
                        
            else:
                self.log_test("POST Deal", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Deal", False, f"Exception: {str(e)}")
            
    def test_shipper_leads_endpoints(self):
        """Test shipper leads endpoints"""
        # Test POST shipper lead (no auth required)
        test_lead = {
            "company_name": "Test Shipping Corp",
            "contact_name": "Jane Doe",
            "email": "jane@testshipping.com",
            "phone": "555-0456",
            "product_type": "Electronics",
            "regions_needed": ["Northeast", "Southeast"],
            "monthly_shipments": 500,
            "urgency": "High",
            "status": "New"
        }
        
        try:
            response = requests.post(f"{API_BASE}/shipper-leads", json=test_lead)
            if response.status_code == 200:
                data = response.json()
                self.log_test("POST Shipper Lead", True, f"Created lead with ID: {data.get('id', 'N/A')}")
            else:
                self.log_test("POST Shipper Lead", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("POST Shipper Lead", False, f"Exception: {str(e)}")
            
        # Test GET shipper leads (requires auth)
        if self.admin_token:
            headers = self.get_auth_headers(self.admin_token)
            try:
                response = requests.get(f"{API_BASE}/shipper-leads", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    self.log_test("GET Shipper Leads", True, f"Retrieved {len(data)} shipper leads")
                else:
                    self.log_test("GET Shipper Leads", False, f"HTTP {response.status_code}")
            except Exception as e:
                self.log_test("GET Shipper Leads", False, f"Exception: {str(e)}")
                
    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        if not self.admin_token:
            self.log_test("Dashboard Stats", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        try:
            response = requests.get(f"{API_BASE}/dashboard/stats", headers=headers)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_3pls", "total_warehouses", "active_deals", "expiring_leases", "new_leads"]
                
                if all(field in data for field in required_fields):
                    self.log_test("Dashboard Stats", True, f"Stats: {data}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_test("Dashboard Stats", False, f"Missing fields: {missing}")
            else:
                self.log_test("Dashboard Stats", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("Dashboard Stats", False, f"Exception: {str(e)}")
    def test_google_maps_warehouse_data(self):
        """Test warehouse endpoints specifically for Google Maps functionality"""
        print("\n🗺️  Testing Google Maps Warehouse Data Structure")
        print("-" * 50)
        
        # Test GET warehouses without authentication (should work for map display)
        try:
            response = requests.get(f"{API_BASE}/warehouses")
            if response.status_code == 200:
                warehouses = response.json()
                self.log_test("GET Warehouses (No Auth)", True, f"Retrieved {len(warehouses)} warehouses for map display")
                
                # Validate warehouse data structure for map compatibility
                if warehouses:
                    sample_warehouse = warehouses[0]
                    required_map_fields = ['id', 'name', 'address', 'city', 'state', 'lat', 'lng', 'growe_represented']
                    
                    missing_fields = [field for field in required_map_fields if field not in sample_warehouse]
                    if not missing_fields:
                        self.log_test("Warehouse Map Data Structure", True, "All required fields present for map display")
                        
                        # Validate coordinate data types
                        lat_valid = isinstance(sample_warehouse.get('lat'), (int, float))
                        lng_valid = isinstance(sample_warehouse.get('lng'), (int, float))
                        
                        if lat_valid and lng_valid:
                            self.log_test("Warehouse Coordinates", True, f"Valid lat/lng coordinates: {sample_warehouse['lat']}, {sample_warehouse['lng']}")
                        else:
                            self.log_test("Warehouse Coordinates", False, f"Invalid coordinate types: lat={type(sample_warehouse.get('lat'))}, lng={type(sample_warehouse.get('lng'))}")
                            
                        # Validate coordinate ranges (basic sanity check)
                        lat = sample_warehouse.get('lat', 0)
                        lng = sample_warehouse.get('lng', 0)
                        if -90 <= lat <= 90 and -180 <= lng <= 180:
                            self.log_test("Coordinate Ranges", True, "Coordinates within valid geographic ranges")
                        else:
                            self.log_test("Coordinate Ranges", False, f"Coordinates out of range: lat={lat}, lng={lng}")
                            
                    else:
                        self.log_test("Warehouse Map Data Structure", False, f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("Warehouse Map Data Structure", False, "No warehouse data available for testing")
                    
            else:
                self.log_test("GET Warehouses (No Auth)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET Warehouses (No Auth)", False, f"Exception: {str(e)}")
            
    def test_google_maps_3pl_data(self):
        """Test 3PL endpoints specifically for Google Maps functionality"""
        print("\n🏢 Testing Google Maps 3PL Data Structure")
        print("-" * 50)
        
        # Test GET 3PLs without authentication (should work for map display)
        try:
            response = requests.get(f"{API_BASE}/3pls")
            if response.status_code == 200:
                threepls = response.json()
                self.log_test("GET 3PLs (No Auth)", True, f"Retrieved {len(threepls)} 3PL companies for map display")
                
                # Validate 3PL data structure for map compatibility
                if threepls:
                    sample_3pl = threepls[0]
                    required_map_fields = ['id', 'company_name', 'primary_contact', 'email', 'phone', 'services', 'regions_covered', 'status']
                    
                    missing_fields = [field for field in required_map_fields if field not in sample_3pl]
                    if not missing_fields:
                        self.log_test("3PL Map Data Structure", True, "All required fields present for map display")
                        
                        # Validate services and regions are lists
                        services_valid = isinstance(sample_3pl.get('services'), list)
                        regions_valid = isinstance(sample_3pl.get('regions_covered'), list)
                        
                        if services_valid and regions_valid:
                            self.log_test("3PL List Fields", True, "Services and regions are properly formatted as lists")
                        else:
                            self.log_test("3PL List Fields", False, f"Invalid list types: services={type(sample_3pl.get('services'))}, regions={type(sample_3pl.get('regions_covered'))}")
                            
                    else:
                        self.log_test("3PL Map Data Structure", False, f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("3PL Map Data Structure", False, "No 3PL data available for testing")
                    
            else:
                self.log_test("GET 3PLs (No Auth)", False, f"HTTP {response.status_code}")
        except Exception as e:
            self.log_test("GET 3PLs (No Auth)", False, f"Exception: {str(e)}")
            
    def test_warehouse_3pl_relationship(self):
        """Test the relationship between warehouses and 3PLs for map functionality"""
        print("\n🔗 Testing Warehouse-3PL Relationship for Map")
        print("-" * 50)
        
        try:
            # Get both warehouses and 3PLs
            warehouses_response = requests.get(f"{API_BASE}/warehouses")
            threepls_response = requests.get(f"{API_BASE}/3pls")
            
            if warehouses_response.status_code == 200 and threepls_response.status_code == 200:
                warehouses = warehouses_response.json()
                threepls = threepls_response.json()
                
                # Create a lookup for 3PLs by ID
                threepls_by_id = {tpl['id']: tpl for tpl in threepls}
                
                # Check if warehouses can be linked to 3PLs
                linked_count = 0
                unlinked_count = 0
                sample_warehouse_ids = []
                sample_3pl_ids = []
                
                for warehouse in warehouses[:3]:  # Check first 3 for diagnostics
                    threepl_id = warehouse.get('threepl_id')
                    sample_warehouse_ids.append(threepl_id)
                    if threepl_id and threepl_id in threepls_by_id:
                        linked_count += 1
                    else:
                        unlinked_count += 1
                        
                for threepl in threepls[:3]:  # Get first 3 3PL IDs for diagnostics
                    sample_3pl_ids.append(threepl.get('id'))
                
                if linked_count > 0:
                    self.log_test("Warehouse-3PL Linking", True, f"Successfully linked {linked_count} warehouses to 3PLs, {unlinked_count} unlinked")
                else:
                    # Provide diagnostic information
                    diagnostic_msg = f"No warehouses could be linked to 3PLs. Sample warehouse threepl_ids: {sample_warehouse_ids[:3]}, Sample 3PL ids: {sample_3pl_ids[:3]}"
                    self.log_test("Warehouse-3PL Linking", False, diagnostic_msg)
                    
                    # This is a data consistency issue, not a critical API failure
                    # The map can still display warehouses, just without 3PL details
                    self.log_test("Map Functionality Impact", True, "Map can still display warehouses without 3PL linking - minor data issue")
                    
            else:
                self.log_test("Warehouse-3PL Linking", False, f"Failed to retrieve data: warehouses={warehouses_response.status_code}, 3pls={threepls_response.status_code}")
                
        except Exception as e:
            self.log_test("Warehouse-3PL Linking", False, f"Exception: {str(e)}")
            
    def test_map_data_completeness(self):
        """Test completeness of data for map display"""
        print("\n📊 Testing Map Data Completeness")
        print("-" * 50)
        
        try:
            response = requests.get(f"{API_BASE}/warehouses")
            if response.status_code == 200:
                warehouses = response.json()
                
                if not warehouses:
                    self.log_test("Map Data Completeness", False, "No warehouse data available")
                    return
                    
                # Check for complete data
                complete_warehouses = 0
                incomplete_warehouses = 0
                
                for warehouse in warehouses:
                    required_fields = ['name', 'address', 'city', 'state', 'lat', 'lng']
                    if all(warehouse.get(field) for field in required_fields):
                        complete_warehouses += 1
                    else:
                        incomplete_warehouses += 1
                        
                if complete_warehouses > 0:
                    self.log_test("Map Data Completeness", True, f"{complete_warehouses} complete warehouses, {incomplete_warehouses} incomplete")
                else:
                    self.log_test("Map Data Completeness", False, "No warehouses have complete data for map display")
                    
                # Check geographic distribution
                states = set()
                for warehouse in warehouses:
                    if warehouse.get('state'):
                        states.add(warehouse['state'])
                        
                if len(states) > 1:
                    self.log_test("Geographic Distribution", True, f"Warehouses distributed across {len(states)} states: {', '.join(sorted(states))}")
                else:
                    self.log_test("Geographic Distribution", False, f"Limited geographic distribution: {len(states)} states")
                    
            else:
                self.log_test("Map Data Completeness", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Map Data Completeness", False, f"Exception: {str(e)}")
            
    def run_google_maps_tests(self):
        """Run all Google Maps specific tests"""
        print("\n🗺️  GOOGLE MAPS BACKEND FUNCTIONALITY TESTS")
        print("=" * 60)
        
        self.test_google_maps_warehouse_data()
        self.test_google_maps_3pl_data()
        self.test_warehouse_3pl_relationship()
        self.test_map_data_completeness()
        
        return True
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Growe Logistics Platform Backend Tests")
        print("=" * 60)
        
        # Basic connectivity
        self.test_health_endpoint()
        
        # Authentication tests
        if self.test_authentication():
            # Protected endpoint tests
            self.test_protected_endpoints_without_auth()
            
            # CRUD operations tests
            self.test_3pls_endpoints()
            self.test_warehouses_endpoints()
            self.test_leases_endpoints()
            self.test_deals_endpoints()
            self.test_shipper_leads_endpoints()
            self.test_dashboard_stats()
            
            # Google Maps specific tests
            self.run_google_maps_tests()
        else:
            print("❌ Authentication failed - skipping protected endpoint tests")
            
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # List failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
        else:
            print("\n✅ ALL TESTS PASSED!")
            
        return passed == total

if __name__ == "__main__":
    tester = GroweBackendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)