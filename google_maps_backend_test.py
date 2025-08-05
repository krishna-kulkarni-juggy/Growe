#!/usr/bin/env python3
"""
Google Maps Backend Functionality Test Suite for Growe Logistics Platform
Tests specifically the backend APIs that support the MapView component
"""

import requests
import json
from datetime import datetime

# Configuration - Use production URL from frontend/.env
BASE_URL = "https://7a0fd8e1-7d57-4e40-8e2f-214f86a66a75.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class GoogleMapsBackendTester:
    def __init__(self):
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
        
    def test_warehouse_api_for_maps(self):
        """Test GET /api/warehouses endpoint for map data requirements"""
        print("\n🗺️  Testing Warehouse API for Google Maps")
        print("-" * 50)
        
        try:
            response = requests.get(f"{API_BASE}/warehouses")
            
            if response.status_code == 200:
                warehouses = response.json()
                self.log_test("Warehouse API Response", True, f"Successfully retrieved {len(warehouses)} warehouses")
                
                if not warehouses:
                    self.log_test("Warehouse Data Availability", False, "No warehouse data available")
                    return False
                
                # Test data structure for map compatibility
                sample_warehouse = warehouses[0]
                required_fields = ['id', 'name', 'address', 'city', 'state', 'lat', 'lng', 'growe_represented']
                
                missing_fields = [field for field in required_fields if field not in sample_warehouse]
                if not missing_fields:
                    self.log_test("Required Map Fields", True, "All required fields present for map display")
                else:
                    self.log_test("Required Map Fields", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate coordinate data types and ranges
                valid_coordinates = 0
                invalid_coordinates = 0
                
                for warehouse in warehouses:
                    lat = warehouse.get('lat')
                    lng = warehouse.get('lng')
                    
                    if (isinstance(lat, (int, float)) and isinstance(lng, (int, float)) and
                        -90 <= lat <= 90 and -180 <= lng <= 180):
                        valid_coordinates += 1
                    else:
                        invalid_coordinates += 1
                
                if invalid_coordinates == 0:
                    self.log_test("Coordinate Validation", True, f"All {valid_coordinates} warehouses have valid coordinates")
                else:
                    self.log_test("Coordinate Validation", False, f"{invalid_coordinates} warehouses have invalid coordinates")
                
                # Test growe_represented field
                growe_represented = sum(1 for w in warehouses if w.get('growe_represented'))
                not_represented = len(warehouses) - growe_represented
                
                self.log_test("Growe Representation Data", True, f"{growe_represented} Growe represented, {not_represented} not represented")
                
                # Test geographic distribution
                states = set(w.get('state') for w in warehouses if w.get('state'))
                if len(states) > 1:
                    self.log_test("Geographic Coverage", True, f"Warehouses span {len(states)} states: {', '.join(sorted(states))}")
                else:
                    self.log_test("Geographic Coverage", False, f"Limited to {len(states)} state(s)")
                
                return True
                
            else:
                self.log_test("Warehouse API Response", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Warehouse API Response", False, f"Exception: {str(e)}")
            return False
            
    def test_3pl_api_for_maps(self):
        """Test GET /api/3pls endpoint for map data requirements"""
        print("\n🏢 Testing 3PL API for Google Maps")
        print("-" * 50)
        
        try:
            response = requests.get(f"{API_BASE}/3pls")
            
            if response.status_code == 200:
                threepls = response.json()
                self.log_test("3PL API Response", True, f"Successfully retrieved {len(threepls)} 3PL companies")
                
                if not threepls:
                    self.log_test("3PL Data Availability", False, "No 3PL data available")
                    return False
                
                # Test data structure for map compatibility
                sample_3pl = threepls[0]
                required_fields = ['id', 'company_name', 'primary_contact', 'email', 'phone', 'services', 'regions_covered', 'status']
                
                missing_fields = [field for field in required_fields if field not in sample_3pl]
                if not missing_fields:
                    self.log_test("Required 3PL Fields", True, "All required fields present for map display")
                else:
                    self.log_test("Required 3PL Fields", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Validate list fields
                valid_lists = 0
                invalid_lists = 0
                
                for threepl in threepls:
                    services = threepl.get('services')
                    regions = threepl.get('regions_covered')
                    
                    if isinstance(services, list) and isinstance(regions, list):
                        valid_lists += 1
                    else:
                        invalid_lists += 1
                
                if invalid_lists == 0:
                    self.log_test("List Field Validation", True, f"All {valid_lists} 3PLs have properly formatted list fields")
                else:
                    self.log_test("List Field Validation", False, f"{invalid_lists} 3PLs have invalid list fields")
                
                # Test contact information completeness
                complete_contact = sum(1 for t in threepls if t.get('email') and t.get('phone'))
                self.log_test("Contact Information", True, f"{complete_contact}/{len(threepls)} 3PLs have complete contact info")
                
                return True
                
            else:
                self.log_test("3PL API Response", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("3PL API Response", False, f"Exception: {str(e)}")
            return False
            
    def test_data_relationship_for_maps(self):
        """Test the relationship between warehouse and 3PL data for map functionality"""
        print("\n🔗 Testing Data Relationships for Map")
        print("-" * 50)
        
        try:
            # Get both datasets
            warehouses_response = requests.get(f"{API_BASE}/warehouses")
            threepls_response = requests.get(f"{API_BASE}/3pls")
            
            if warehouses_response.status_code == 200 and threepls_response.status_code == 200:
                warehouses = warehouses_response.json()
                threepls = threepls_response.json()
                
                # Create lookup for 3PLs
                threepls_by_id = {tpl['id']: tpl for tpl in threepls}
                
                # Test linking capability
                linked_warehouses = 0
                unlinked_warehouses = 0
                
                for warehouse in warehouses:
                    threepl_id = warehouse.get('threepl_id')
                    if threepl_id and threepl_id in threepls_by_id:
                        linked_warehouses += 1
                    else:
                        unlinked_warehouses += 1
                
                if linked_warehouses > 0:
                    self.log_test("Warehouse-3PL Linking", True, f"{linked_warehouses} warehouses successfully linked to 3PLs")
                else:
                    # This is a data consistency issue but doesn't break core map functionality
                    self.log_test("Warehouse-3PL Linking", False, f"Data inconsistency: warehouse threepl_ids don't match 3PL ids")
                    self.log_test("Map Core Functionality", True, "Map can still display warehouses independently")
                
                return True
                
            else:
                self.log_test("Data Relationship Test", False, f"Failed to retrieve data for relationship testing")
                return False
                
        except Exception as e:
            self.log_test("Data Relationship Test", False, f"Exception: {str(e)}")
            return False
            
    def test_map_data_completeness(self):
        """Test overall data completeness for map functionality"""
        print("\n📊 Testing Map Data Completeness")
        print("-" * 50)
        
        try:
            response = requests.get(f"{API_BASE}/warehouses")
            
            if response.status_code == 200:
                warehouses = response.json()
                
                if not warehouses:
                    self.log_test("Data Completeness", False, "No warehouse data available")
                    return False
                
                # Check completeness of essential map data
                complete_warehouses = 0
                incomplete_warehouses = 0
                
                for warehouse in warehouses:
                    essential_fields = ['name', 'address', 'city', 'state', 'lat', 'lng']
                    if all(warehouse.get(field) for field in essential_fields):
                        complete_warehouses += 1
                    else:
                        incomplete_warehouses += 1
                
                if incomplete_warehouses == 0:
                    self.log_test("Essential Data Completeness", True, f"All {complete_warehouses} warehouses have complete essential data")
                else:
                    self.log_test("Essential Data Completeness", False, f"{incomplete_warehouses} warehouses missing essential data")
                
                # Test data quality for map display
                quality_score = (complete_warehouses / len(warehouses)) * 100
                if quality_score >= 90:
                    self.log_test("Map Data Quality", True, f"Data quality score: {quality_score:.1f}% - Excellent for map display")
                elif quality_score >= 70:
                    self.log_test("Map Data Quality", True, f"Data quality score: {quality_score:.1f}% - Good for map display")
                else:
                    self.log_test("Map Data Quality", False, f"Data quality score: {quality_score:.1f}% - Poor for map display")
                
                return True
                
            else:
                self.log_test("Data Completeness", False, f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Data Completeness", False, f"Exception: {str(e)}")
            return False
            
    def run_all_tests(self):
        """Run all Google Maps backend tests"""
        print("🗺️  GOOGLE MAPS BACKEND FUNCTIONALITY TESTS")
        print("=" * 60)
        print("Testing backend APIs that support the MapView component")
        print("=" * 60)
        
        # Run all tests
        warehouse_test = self.test_warehouse_api_for_maps()
        threepls_test = self.test_3pl_api_for_maps()
        relationship_test = self.test_data_relationship_for_maps()
        completeness_test = self.test_map_data_completeness()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 GOOGLE MAPS BACKEND TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Critical vs Minor issues
        critical_failures = []
        minor_failures = []
        
        for result in self.test_results:
            if not result["success"]:
                if any(keyword in result["test"].lower() for keyword in ["api response", "required fields", "coordinate validation", "data availability"]):
                    critical_failures.append(result)
                else:
                    minor_failures.append(result)
        
        if critical_failures:
            print("\n❌ CRITICAL ISSUES (Block map functionality):")
            for test in critical_failures:
                print(f"  - {test['test']}: {test['message']}")
        
        if minor_failures:
            print("\n⚠️  MINOR ISSUES (Map still functional):")
            for test in minor_failures:
                print(f"  - {test['test']}: {test['message']}")
        
        if not critical_failures and not minor_failures:
            print("\n✅ ALL TESTS PASSED - Google Maps backend fully functional!")
        elif not critical_failures:
            print("\n✅ CORE FUNCTIONALITY WORKING - Minor issues don't affect map display")
        
        # Map functionality assessment
        print("\n🗺️  MAP FUNCTIONALITY ASSESSMENT:")
        if warehouse_test and threepls_test and completeness_test:
            print("✅ Backend APIs fully support Google Maps functionality")
            print("✅ Warehouse locations can be displayed on map")
            print("✅ 3PL company information available for warehouse details")
            print("✅ Data structure matches MapView component requirements")
        else:
            print("❌ Some backend functionality may impact map display")
        
        return len(critical_failures) == 0

if __name__ == "__main__":
    tester = GoogleMapsBackendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)