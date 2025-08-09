#!/usr/bin/env python3
"""
Enhanced Backend Test Suite for Growe Logistics Platform
Tests enhanced lease management and client portal functionality
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

class EnhancedGroweBackendTester:
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
        
    def authenticate(self):
        """Authenticate and get tokens"""
        try:
            # Admin login
            response = requests.post(f"{API_BASE}/auth/login", json=ADMIN_CREDENTIALS)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data["token"]
                self.log_test("Admin Authentication", True, "Admin authenticated successfully")
            else:
                self.log_test("Admin Authentication", False, f"HTTP {response.status_code}")
                return False
                
            # Partner login
            response = requests.post(f"{API_BASE}/auth/login", json=PARTNER_CREDENTIALS)
            if response.status_code == 200:
                data = response.json()
                self.partner_token = data["token"]
                self.log_test("Partner Authentication", True, "Partner authenticated successfully")
            else:
                self.log_test("Partner Authentication", False, f"HTTP {response.status_code}")
                return False
                
            return True
        except Exception as e:
            self.log_test("Authentication", False, f"Exception: {str(e)}")
            return False
            
    def get_auth_headers(self, token):
        """Get authorization headers"""
        return {"Authorization": f"Bearer {token}"}
        
    def test_enhanced_lease_data_structure(self):
        """Test if backend can handle enhanced lease data with agreements and action items"""
        print("\n📋 Testing Enhanced Lease Data Structure Support")
        print("-" * 60)
        
        if not self.admin_token:
            self.log_test("Enhanced Lease Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Create enhanced lease data matching frontend structure
        enhanced_lease = {
            "warehouse_id": str(uuid.uuid4()),
            "threepl_id": str(uuid.uuid4()),
            "start_date": datetime.now().isoformat(),
            "end_date": (datetime.now() + timedelta(days=365)).isoformat(),
            "square_footage": 50000,
            "landlord": "Enhanced Properties LLC",
            "monthly_rent": 30000.00,
            "status": "Active",
            "notes": "Enhanced lease with agreement details",
            # Enhanced fields from frontend
            "lease_agreement": {
                "document_name": "Enhanced_Warehouse_Lease_2024.pdf",
                "summary": {
                    "key_terms": [
                        "3-year initial term with automatic 2-year renewal option",
                        "Annual rent escalation of 3% starting Year 2",
                        "Tenant responsible for utilities and maintenance"
                    ],
                    "action_items": [
                        {
                            "type": "renewal_notice",
                            "description": "Provide renewal decision notice to landlord",
                            "due_date": (datetime.now() + timedelta(days=60)).isoformat(),
                            "priority": "high",
                            "status": "pending"
                        },
                        {
                            "type": "insurance_renewal", 
                            "description": "Update liability insurance certificate",
                            "due_date": (datetime.now() + timedelta(days=45)).isoformat(),
                            "priority": "medium",
                            "status": "pending"
                        }
                    ],
                    "financial_summary": {
                        "total_annual_cost": 360000,
                        "escalation_rate": "3% annually",
                        "deposit_amount": 60000,
                        "additional_fees": ["Property tax", "Utilities", "Maintenance"]
                    }
                }
            }
        }
        
        try:
            response = requests.post(f"{API_BASE}/leases", json=enhanced_lease, headers=headers)
            if response.status_code == 200:
                data = response.json()
                lease_id = data.get('id')
                self.log_test("POST Enhanced Lease", True, f"Created enhanced lease with ID: {lease_id}")
                
                # Test if enhanced data is preserved
                if 'lease_agreement' in data:
                    self.log_test("Enhanced Data Preservation", True, "lease_agreement data preserved in response")
                    
                    # Check if action items are preserved
                    if 'action_items' in data.get('lease_agreement', {}).get('summary', {}):
                        action_items = data['lease_agreement']['summary']['action_items']
                        self.log_test("Action Items Support", True, f"Action items preserved: {len(action_items)} items")
                    else:
                        self.log_test("Action Items Support", False, "Action items not preserved in response")
                        
                    # Check financial summary
                    if 'financial_summary' in data.get('lease_agreement', {}).get('summary', {}):
                        self.log_test("Financial Summary Support", True, "Financial summary data preserved")
                    else:
                        self.log_test("Financial Summary Support", False, "Financial summary not preserved")
                else:
                    self.log_test("Enhanced Data Preservation", False, "lease_agreement data not preserved in response")
                    
            else:
                self.log_test("POST Enhanced Lease", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("POST Enhanced Lease", False, f"Exception: {str(e)}")
            
    def test_lease_filtering_and_sorting(self):
        """Test lease filtering and sorting capabilities"""
        print("\n🔍 Testing Lease Filtering and Sorting")
        print("-" * 60)
        
        if not self.admin_token:
            self.log_test("Lease Filtering Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test basic lease retrieval
        try:
            response = requests.get(f"{API_BASE}/leases", headers=headers)
            if response.status_code == 200:
                leases = response.json()
                self.log_test("GET All Leases", True, f"Retrieved {len(leases)} leases")
                
                # Test expiring leases filter
                response = requests.get(f"{API_BASE}/leases/expiring", headers=headers)
                if response.status_code == 200:
                    expiring_leases = response.json()
                    self.log_test("GET Expiring Leases Filter", True, f"Retrieved {len(expiring_leases)} expiring leases")
                else:
                    self.log_test("GET Expiring Leases Filter", False, f"HTTP {response.status_code}")
                    
                # Test if we can filter by status (if endpoint exists)
                try:
                    response = requests.get(f"{API_BASE}/leases?status=Active", headers=headers)
                    if response.status_code == 200:
                        active_leases = response.json()
                        self.log_test("Status Filter Support", True, f"Status filtering works: {len(active_leases)} active leases")
                    else:
                        self.log_test("Status Filter Support", False, "Status filtering not supported")
                except:
                    self.log_test("Status Filter Support", False, "Status filtering endpoint not available")
                    
                # Test if we can sort by end_date (if endpoint exists)
                try:
                    response = requests.get(f"{API_BASE}/leases?sort=end_date", headers=headers)
                    if response.status_code == 200:
                        sorted_leases = response.json()
                        self.log_test("Date Sorting Support", True, f"Date sorting works: {len(sorted_leases)} leases")
                    else:
                        self.log_test("Date Sorting Support", False, "Date sorting not supported")
                except:
                    self.log_test("Date Sorting Support", False, "Date sorting endpoint not available")
                    
            else:
                self.log_test("GET All Leases", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Lease Filtering Test", False, f"Exception: {str(e)}")
            
    def test_industry_news_endpoints(self):
        """Test industry news functionality for client portal"""
        print("\n📰 Testing Industry News Endpoints")
        print("-" * 60)
        
        # Test if industry news endpoint exists
        try:
            response = requests.get(f"{API_BASE}/industry-news")
            if response.status_code == 200:
                news = response.json()
                self.log_test("GET Industry News", True, f"Retrieved {len(news)} news articles")
                
                # Validate news data structure
                if news and len(news) > 0:
                    sample_news = news[0]
                    required_fields = ['id', 'title', 'summary', 'source', 'category', 'published_date']
                    missing_fields = [field for field in required_fields if field not in sample_news]
                    
                    if not missing_fields:
                        self.log_test("News Data Structure", True, "All required news fields present")
                        
                        # Test trending news filter
                        try:
                            response = requests.get(f"{API_BASE}/industry-news?trending=true")
                            if response.status_code == 200:
                                trending_news = response.json()
                                self.log_test("Trending News Filter", True, f"Retrieved {len(trending_news)} trending articles")
                            else:
                                self.log_test("Trending News Filter", False, "Trending filter not supported")
                        except:
                            self.log_test("Trending News Filter", False, "Trending filter endpoint not available")
                            
                        # Test category filter
                        try:
                            response = requests.get(f"{API_BASE}/industry-news?category=Technology")
                            if response.status_code == 200:
                                tech_news = response.json()
                                self.log_test("Category Filter", True, f"Retrieved {len(tech_news)} technology articles")
                            else:
                                self.log_test("Category Filter", False, "Category filter not supported")
                        except:
                            self.log_test("Category Filter", False, "Category filter endpoint not available")
                            
                    else:
                        self.log_test("News Data Structure", False, f"Missing required fields: {missing_fields}")
                else:
                    self.log_test("News Data Structure", False, "No news data available for validation")
                    
            elif response.status_code == 404:
                self.log_test("GET Industry News", False, "Industry news endpoint not implemented")
            else:
                self.log_test("GET Industry News", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("GET Industry News", False, f"Exception: {str(e)}")
            
        # Test POST industry news (admin only)
        if self.admin_token:
            headers = self.get_auth_headers(self.admin_token)
            test_news = {
                "title": "Test Industry News Article",
                "summary": "This is a test news article for the 3PL industry",
                "source": "Test Source",
                "category": "Technology",
                "read_time": "3 min",
                "trending": False
            }
            
            try:
                response = requests.post(f"{API_BASE}/industry-news", json=test_news, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    self.log_test("POST Industry News", True, f"Created news article with ID: {data.get('id', 'N/A')}")
                elif response.status_code == 404:
                    self.log_test("POST Industry News", False, "Industry news POST endpoint not implemented")
                else:
                    self.log_test("POST Industry News", False, f"HTTP {response.status_code}: {response.text}")
            except Exception as e:
                self.log_test("POST Industry News", False, f"Exception: {str(e)}")
                
    def test_enhanced_client_portal_data(self):
        """Test client portal data retrieval with enhanced features"""
        print("\n🏢 Testing Enhanced Client Portal Data")
        print("-" * 60)
        
        if not self.partner_token:
            self.log_test("Client Portal Test", False, "No partner token available")
            return
            
        headers = self.get_auth_headers(self.partner_token)
        
        # Test warehouse data for client portal
        try:
            response = requests.get(f"{API_BASE}/warehouses", headers=headers)
            if response.status_code == 200:
                warehouses = response.json()
                self.log_test("Client Portal Warehouses", True, f"Retrieved {len(warehouses)} warehouses for client portal")
                
                # Check if warehouses have required fields for enhanced portal
                if warehouses:
                    sample_warehouse = warehouses[0]
                    portal_fields = ['id', 'name', 'address', 'city', 'state', 'growe_represented']
                    missing_fields = [field for field in portal_fields if field not in sample_warehouse]
                    
                    if not missing_fields:
                        self.log_test("Portal Warehouse Data", True, "All required fields present for client portal")
                    else:
                        self.log_test("Portal Warehouse Data", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Client Portal Warehouses", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Client Portal Warehouses", False, f"Exception: {str(e)}")
            
        # Test lease data for client portal
        try:
            response = requests.get(f"{API_BASE}/leases", headers=headers)
            if response.status_code == 200:
                leases = response.json()
                self.log_test("Client Portal Leases", True, f"Retrieved {len(leases)} leases for client portal")
                
                # Check if leases support enhanced data structure
                if leases:
                    sample_lease = leases[0]
                    if 'lease_agreement' in sample_lease:
                        self.log_test("Enhanced Lease Data in Portal", True, "Lease agreements data available in client portal")
                    else:
                        self.log_test("Enhanced Lease Data in Portal", False, "Enhanced lease data not available in client portal")
            else:
                self.log_test("Client Portal Leases", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Client Portal Leases", False, f"Exception: {str(e)}")
            
        # Test shipper leads for client portal
        try:
            response = requests.get(f"{API_BASE}/shipper-leads", headers=headers)
            if response.status_code == 200:
                leads = response.json()
                self.log_test("Client Portal Leads", True, f"Retrieved {len(leads)} leads for client portal")
            else:
                self.log_test("Client Portal Leads", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Client Portal Leads", False, f"Exception: {str(e)}")
            
    def test_lease_action_items_api(self):
        """Test if there are specific endpoints for lease action items"""
        print("\n✅ Testing Lease Action Items API")
        print("-" * 60)
        
        if not self.admin_token:
            self.log_test("Action Items API Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        # Test if there's a specific endpoint for action items
        test_lease_id = "test-lease-123"
        
        try:
            response = requests.get(f"{API_BASE}/leases/{test_lease_id}/action-items", headers=headers)
            if response.status_code == 200:
                action_items = response.json()
                self.log_test("GET Action Items", True, f"Retrieved action items for lease")
            elif response.status_code == 404:
                self.log_test("GET Action Items", False, "Action items endpoint not implemented")
            else:
                self.log_test("GET Action Items", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("GET Action Items", False, f"Exception: {str(e)}")
            
        # Test updating action item status
        try:
            update_data = {
                "action_item_id": "item-123",
                "status": "completed"
            }
            response = requests.put(f"{API_BASE}/leases/{test_lease_id}/action-items", json=update_data, headers=headers)
            if response.status_code == 200:
                self.log_test("UPDATE Action Item", True, "Action item status updated successfully")
            elif response.status_code == 404:
                self.log_test("UPDATE Action Item", False, "Action item update endpoint not implemented")
            else:
                self.log_test("UPDATE Action Item", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("UPDATE Action Item", False, f"Exception: {str(e)}")
            
    def test_data_consistency_across_features(self):
        """Test data consistency between lease admin and client portal"""
        print("\n🔄 Testing Data Consistency Across Features")
        print("-" * 60)
        
        if not self.admin_token or not self.partner_token:
            self.log_test("Data Consistency Test", False, "Missing authentication tokens")
            return
            
        admin_headers = self.get_auth_headers(self.admin_token)
        partner_headers = self.get_auth_headers(self.partner_token)
        
        try:
            # Get leases from admin perspective
            admin_response = requests.get(f"{API_BASE}/leases", headers=admin_headers)
            
            # Get leases from partner perspective  
            partner_response = requests.get(f"{API_BASE}/leases", headers=partner_headers)
            
            if admin_response.status_code == 200 and partner_response.status_code == 200:
                admin_leases = admin_response.json()
                partner_leases = partner_response.json()
                
                # Check if data is consistent
                if len(admin_leases) == len(partner_leases):
                    self.log_test("Lease Data Consistency", True, f"Consistent lease data: {len(admin_leases)} leases")
                else:
                    self.log_test("Lease Data Consistency", False, f"Inconsistent data: admin={len(admin_leases)}, partner={len(partner_leases)}")
                    
                # Check if enhanced fields are available to both roles
                if admin_leases and partner_leases:
                    admin_has_enhanced = 'lease_agreement' in admin_leases[0]
                    partner_has_enhanced = 'lease_agreement' in partner_leases[0]
                    
                    if admin_has_enhanced and partner_has_enhanced:
                        self.log_test("Enhanced Data Access", True, "Enhanced lease data available to both admin and partner")
                    elif admin_has_enhanced and not partner_has_enhanced:
                        self.log_test("Enhanced Data Access", False, "Enhanced data only available to admin")
                    elif not admin_has_enhanced and not partner_has_enhanced:
                        self.log_test("Enhanced Data Access", False, "Enhanced lease data not available to either role")
                    else:
                        self.log_test("Enhanced Data Access", False, "Inconsistent enhanced data access")
                        
            else:
                self.log_test("Lease Data Consistency", False, f"Failed to retrieve data: admin={admin_response.status_code}, partner={partner_response.status_code}")
                
        except Exception as e:
            self.log_test("Data Consistency Test", False, f"Exception: {str(e)}")
            
    def test_api_health_after_enhancements(self):
        """Test that existing endpoints still work after enhancements"""
        print("\n🏥 Testing API Health After Enhancements")
        print("-" * 60)
        
        # Test all basic endpoints still work
        basic_endpoints = [
            "/health",
            "/3pls", 
            "/warehouses",
            "/leases",
            "/deals",
            "/shipper-leads",
            "/dashboard/stats"
        ]
        
        for endpoint in basic_endpoints:
            try:
                response = requests.get(f"{API_BASE}{endpoint}")
                if response.status_code in [200, 401, 403]:  # 401/403 are expected for protected endpoints
                    self.log_test(f"Endpoint Health {endpoint}", True, f"Endpoint responsive (HTTP {response.status_code})")
                else:
                    self.log_test(f"Endpoint Health {endpoint}", False, f"Unexpected status: HTTP {response.status_code}")
            except Exception as e:
                self.log_test(f"Endpoint Health {endpoint}", False, f"Exception: {str(e)}")
                
    def test_enhanced_lease_retrieval_performance(self):
        """Test performance of enhanced lease data retrieval"""
        print("\n⚡ Testing Enhanced Lease Retrieval Performance")
        print("-" * 60)
        
        if not self.admin_token:
            self.log_test("Performance Test", False, "No admin token available")
            return
            
        headers = self.get_auth_headers(self.admin_token)
        
        try:
            import time
            start_time = time.time()
            
            response = requests.get(f"{API_BASE}/leases", headers=headers)
            
            end_time = time.time()
            response_time = (end_time - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200:
                leases = response.json()
                self.log_test("Lease Retrieval Performance", True, f"Retrieved {len(leases)} leases in {response_time:.2f}ms")
                
                # Check if response time is reasonable (under 2 seconds)
                if response_time < 2000:
                    self.log_test("Performance Benchmark", True, f"Response time acceptable: {response_time:.2f}ms")
                else:
                    self.log_test("Performance Benchmark", False, f"Response time too slow: {response_time:.2f}ms")
            else:
                self.log_test("Lease Retrieval Performance", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Performance Test", False, f"Exception: {str(e)}")
            
    def run_enhanced_tests(self):
        """Run all enhanced functionality tests"""
        print("🚀 Starting Enhanced Growe Logistics Platform Backend Tests")
        print("=" * 70)
        
        if self.authenticate():
            self.test_enhanced_lease_data_structure()
            self.test_lease_filtering_and_sorting()
            self.test_industry_news_endpoints()
            self.test_enhanced_client_portal_data()
            self.test_lease_action_items_api()
            self.test_data_consistency_across_features()
            self.test_api_health_after_enhancements()
            self.test_enhanced_lease_retrieval_performance()
        else:
            print("❌ Authentication failed - skipping enhanced tests")
            
        # Summary
        print("\n" + "=" * 70)
        print("📊 ENHANCED FEATURES TEST SUMMARY")
        print("=" * 70)
        
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
            print("\n✅ ALL ENHANCED TESTS PASSED!")
            
        return passed == total

if __name__ == "__main__":
    tester = EnhancedGroweBackendTester()
    success = tester.run_enhanced_tests()
    exit(0 if success else 1)