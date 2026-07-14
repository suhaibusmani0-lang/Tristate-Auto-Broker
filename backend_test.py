#!/usr/bin/env python3
"""
Backend API Test Suite for Tri State Auto Brokers
Tests all backend endpoints as specified in the review request.
"""

import requests
import json
import io
from typing import Dict, Any, List

# Base URL from frontend/.env
BASE_URL = "https://tristate-auto-broker.onrender.com"

# Test results tracking
test_results = []


def log_test(test_name: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{status} | {test_name}"
    if details:
        result += f"\n    Details: {details}"
    test_results.append({"name": test_name, "passed": passed, "details": details})
    print(result)


def test_root_endpoint():
    """Test 1: GET /api/ - Root endpoint"""
    print("\n" + "="*80)
    print("TEST 1: Root Endpoint")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            expected_message = "Tri State Auto Brokers API"
            expected_cloudinary = False  # env keys are empty placeholders
            
            if data.get("message") == expected_message and data.get("cloudinary") == expected_cloudinary:
                log_test("Root endpoint", True, f"Correct response: {data}")
                return True
            else:
                log_test("Root endpoint", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("Root endpoint", False, f"Status {response.status_code}")
            return False
    except Exception as e:
        log_test("Root endpoint", False, f"Exception: {str(e)}")
        return False


def test_list_vehicles():
    """Test 2: GET /api/vehicles - List all vehicles"""
    print("\n" + "="*80)
    print("TEST 2: List Vehicles")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/vehicles")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            vehicles = response.json()
            print(f"Number of vehicles: {len(vehicles)}")
            
            if len(vehicles) == 15:
                # Check structure of first vehicle
                if vehicles:
                    v = vehicles[0]
                    required_fields = ['id', 'stock_number', 'year', 'make', 'model', 'trim', 
                                     'price', 'down_payment', 'mileage', 'engine', 'transmission',
                                     'drivetrain', 'vin', 'exterior_color', 'interior_color',
                                     'fuel_type', 'features', 'images']
                    
                    missing_fields = [f for f in required_fields if f not in v]
                    if not missing_fields:
                        print(f"Sample vehicle: {v['year']} {v['make']} {v['model']}")
                        log_test("List vehicles (15 seeded)", True, f"All {len(vehicles)} vehicles with correct structure")
                        return vehicles
                    else:
                        log_test("List vehicles", False, f"Missing fields: {missing_fields}")
                        return None
            else:
                log_test("List vehicles", False, f"Expected 15 vehicles, got {len(vehicles)}")
                return None
        else:
            log_test("List vehicles", False, f"Status {response.status_code}")
            return None
    except Exception as e:
        log_test("List vehicles", False, f"Exception: {str(e)}")
        return None


def test_vehicle_sorting():
    """Test 3: GET /api/vehicles with sort parameters"""
    print("\n" + "="*80)
    print("TEST 3: Vehicle Sorting")
    print("="*80)
    
    all_passed = True
    
    # Test year_asc
    try:
        response = requests.get(f"{BASE_URL}/vehicles?sort=year_asc")
        print(f"\nSort by year_asc - Status: {response.status_code}")
        
        if response.status_code == 200:
            vehicles = response.json()
            years = [v['year'] for v in vehicles]
            is_sorted = all(years[i] <= years[i+1] for i in range(len(years)-1))
            
            print(f"Years: {years[:5]}... (showing first 5)")
            if is_sorted:
                log_test("Sort by year_asc", True, f"Correctly sorted ascending")
            else:
                log_test("Sort by year_asc", False, f"Not sorted correctly")
                all_passed = False
        else:
            log_test("Sort by year_asc", False, f"Status {response.status_code}")
            all_passed = False
    except Exception as e:
        log_test("Sort by year_asc", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test mileage_asc
    try:
        response = requests.get(f"{BASE_URL}/vehicles?sort=mileage_asc")
        print(f"\nSort by mileage_asc - Status: {response.status_code}")
        
        if response.status_code == 200:
            vehicles = response.json()
            mileages = [v['mileage'] for v in vehicles]
            is_sorted = all(mileages[i] <= mileages[i+1] for i in range(len(mileages)-1))
            
            print(f"Mileages: {mileages[:5]}... (showing first 5)")
            if is_sorted:
                log_test("Sort by mileage_asc", True, f"Correctly sorted ascending")
            else:
                log_test("Sort by mileage_asc", False, f"Not sorted correctly")
                all_passed = False
        else:
            log_test("Sort by mileage_asc", False, f"Status {response.status_code}")
            all_passed = False
    except Exception as e:
        log_test("Sort by mileage_asc", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed


def test_get_vehicle_by_id(vehicle_id: str):
    """Test 4: GET /api/vehicles/{id} - Get single vehicle"""
    print("\n" + "="*80)
    print("TEST 4: Get Vehicle by ID")
    print("="*80)
    
    try:
        # Test valid ID
        response = requests.get(f"{BASE_URL}/vehicles/{vehicle_id}")
        print(f"Valid ID - Status: {response.status_code}")
        
        if response.status_code == 200:
            vehicle = response.json()
            print(f"Vehicle: {vehicle['year']} {vehicle['make']} {vehicle['model']}")
            log_test("Get vehicle by valid ID", True, f"Retrieved vehicle {vehicle_id}")
        else:
            log_test("Get vehicle by valid ID", False, f"Status {response.status_code}")
            return False
        
        # Test invalid ID (404)
        invalid_id = "invalid-uuid-12345"
        response = requests.get(f"{BASE_URL}/vehicles/{invalid_id}")
        print(f"\nInvalid ID - Status: {response.status_code}")
        
        if response.status_code == 404:
            log_test("Get vehicle by invalid ID (404)", True, "Correctly returns 404")
            return True
        else:
            log_test("Get vehicle by invalid ID (404)", False, f"Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Get vehicle by ID", False, f"Exception: {str(e)}")
        return False


def test_contact_form():
    """Test 5: POST /api/contact"""
    print("\n" + "="*80)
    print("TEST 5: Contact Form Submission")
    print("="*80)
    
    try:
        payload = {
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@example.com",
            "phone": "555-1234",
            "message": "I'm interested in your vehicles"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('success') == True:
                log_test("Contact form submission", True, f"Submission ID: {data['id']}")
                return True
            else:
                log_test("Contact form submission", False, f"Missing id or success field: {data}")
                return False
        else:
            log_test("Contact form submission", False, f"Status {response.status_code}")
            return False
    except Exception as e:
        log_test("Contact form submission", False, f"Exception: {str(e)}")
        return False


def test_vehicle_finder_form():
    """Test 6: POST /api/vehicle-finder"""
    print("\n" + "="*80)
    print("TEST 6: Vehicle Finder Form Submission")
    print("="*80)
    
    try:
        payload = {
            "firstName": "Jane",
            "lastName": "Doe",
            "email": "jane.doe@example.com",
            "dayPhone": "555-5678",
            "eveningPhone": "555-8765",
            "bestTime": "Morning",
            "year": "2020",
            "make": "Toyota",
            "model": "Camry",
            "engine": "V6",
            "mileage": "50000",
            "priceRange": "$20000-$25000",
            "notes": "Looking for a reliable sedan"
        }
        
        response = requests.post(f"{BASE_URL}/vehicle-finder", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('success') == True:
                log_test("Vehicle finder form submission", True, f"Submission ID: {data['id']}")
                return True
            else:
                log_test("Vehicle finder form submission", False, f"Missing id or success field: {data}")
                return False
        else:
            log_test("Vehicle finder form submission", False, f"Status {response.status_code}")
            return False
    except Exception as e:
        log_test("Vehicle finder form submission", False, f"Exception: {str(e)}")
        return False


def test_credit_application_form():
    """Test 7: POST /api/credit-application"""
    print("\n" + "="*80)
    print("TEST 7: Credit Application Form Submission")
    print("="*80)
    
    try:
        payload = {
            "firstName": "Robert",
            "lastName": "Johnson",
            "email": "robert.johnson@example.com",
            "data": {
                "address": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip": "10001",
                "ssn": "123-45-6789",
                "income": "75000"
            },
            "signature": "Robert Johnson"
        }
        
        response = requests.post(f"{BASE_URL}/credit-application", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('success') == True:
                log_test("Credit application form submission", True, f"Submission ID: {data['id']}")
                return True
            else:
                log_test("Credit application form submission", False, f"Missing id or success field: {data}")
                return False
        else:
            log_test("Credit application form submission", False, f"Status {response.status_code}")
            return False
    except Exception as e:
        log_test("Credit application form submission", False, f"Exception: {str(e)}")
        return False


def test_deposit_form():
    """Test 8: POST /api/deposit"""
    print("\n" + "="*80)
    print("TEST 8: Deposit Form Submission")
    print("="*80)
    
    try:
        payload = {
            "amount": "1000",
            "stock": "STK12345",
            "name": "Michael Brown"
        }
        
        response = requests.post(f"{BASE_URL}/deposit", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('success') == True:
                log_test("Deposit form submission", True, f"Submission ID: {data['id']}")
                return True
            else:
                log_test("Deposit form submission", False, f"Missing id or success field: {data}")
                return False
        else:
            log_test("Deposit form submission", False, f"Status {response.status_code}")
            return False
    except Exception as e:
        log_test("Deposit form submission", False, f"Exception: {str(e)}")
        return False


def test_vehicle_inquiry(vehicle_id: str):
    """Test 9: POST /api/vehicles/{id}/inquire"""
    print("\n" + "="*80)
    print("TEST 9: Vehicle Inquiry Submission")
    print("="*80)
    
    try:
        # Test with valid vehicle ID
        payload = {
            "firstName": "Sarah",
            "lastName": "Williams",
            "email": "sarah.williams@example.com",
            "phone": "555-9999",
            "message": "I'd like more information about this vehicle"
        }
        
        response = requests.post(f"{BASE_URL}/vehicles/{vehicle_id}/inquire", json=payload)
        print(f"Valid ID - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('success') == True:
                log_test("Vehicle inquiry with valid ID", True, f"Submission ID: {data['id']}")
            else:
                log_test("Vehicle inquiry with valid ID", False, f"Missing id or success field: {data}")
                return False
        else:
            log_test("Vehicle inquiry with valid ID", False, f"Status {response.status_code}")
            return False
        
        # Test with invalid vehicle ID (404)
        invalid_id = "invalid-uuid-99999"
        response = requests.post(f"{BASE_URL}/vehicles/{invalid_id}/inquire", json=payload)
        print(f"\nInvalid ID - Status: {response.status_code}")
        
        if response.status_code == 404:
            log_test("Vehicle inquiry with invalid ID (404)", True, "Correctly returns 404")
            return True
        else:
            log_test("Vehicle inquiry with invalid ID (404)", False, f"Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Vehicle inquiry", False, f"Exception: {str(e)}")
        return False


def test_cloudinary_upload(vehicle_id: str):
    """Test 10: POST /api/vehicles/{id}/images - Should return 503"""
    print("\n" + "="*80)
    print("TEST 10: Cloudinary Image Upload (Expected 503)")
    print("="*80)
    
    try:
        # Create a fake image file
        fake_image = io.BytesIO(b"fake image content")
        files = {'file': ('test.jpg', fake_image, 'image/jpeg')}
        
        response = requests.post(f"{BASE_URL}/vehicles/{vehicle_id}/images", files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 503:
            data = response.json()
            if "Cloudinary not configured" in data.get('detail', ''):
                log_test("Cloudinary upload (503 expected)", True, "Correctly returns 503 when Cloudinary not configured")
                return True
            else:
                log_test("Cloudinary upload (503 expected)", False, f"503 but unexpected message: {data}")
                return False
        else:
            log_test("Cloudinary upload (503 expected)", False, f"Expected 503, got {response.status_code}")
            return False
    except Exception as e:
        log_test("Cloudinary upload", False, f"Exception: {str(e)}")
        return False


def test_vehicle_crud(test_vehicle_id: str):
    """Test 11: Vehicle CRUD operations"""
    print("\n" + "="*80)
    print("TEST 11: Vehicle CRUD Operations")
    print("="*80)
    
    created_id = None
    
    try:
        # CREATE
        print("\n--- CREATE ---")
        create_payload = {
            "stock_number": "TEST001",
            "year": 2023,
            "make": "Test",
            "model": "Vehicle",
            "trim": "Base",
            "price": "$25000",
            "down_payment": "$2000",
            "mileage": 100,
            "engine": "2.0L I4",
            "transmission": "Automatic",
            "drivetrain": "FWD",
            "vin": "TEST123456789",
            "exterior_color": "Blue",
            "interior_color": "Black",
            "fuel_type": "Gasoline",
            "features": ["Test Feature 1", "Test Feature 2"],
            "images": []
        }
        
        response = requests.post(f"{BASE_URL}/vehicles", json=create_payload)
        print(f"Create Status: {response.status_code}")
        
        if response.status_code == 200:
            vehicle = response.json()
            created_id = vehicle.get('id')
            print(f"Created vehicle ID: {created_id}")
            log_test("Create vehicle", True, f"Created vehicle {created_id}")
        else:
            log_test("Create vehicle", False, f"Status {response.status_code}")
            return False
        
        # UPDATE
        print("\n--- UPDATE ---")
        update_payload = {
            "price": "$26000",
            "mileage": 150
        }
        
        response = requests.put(f"{BASE_URL}/vehicles/{created_id}", json=update_payload)
        print(f"Update Status: {response.status_code}")
        
        if response.status_code == 200:
            vehicle = response.json()
            if vehicle.get('price') == "$26000" and vehicle.get('mileage') == 150:
                log_test("Update vehicle", True, f"Updated vehicle {created_id}")
            else:
                log_test("Update vehicle", False, f"Update didn't apply correctly")
                return False
        else:
            log_test("Update vehicle", False, f"Status {response.status_code}")
            return False
        
        # DELETE
        print("\n--- DELETE ---")
        response = requests.delete(f"{BASE_URL}/vehicles/{created_id}")
        print(f"Delete Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') == True:
                log_test("Delete vehicle", True, f"Deleted vehicle {created_id}")
            else:
                log_test("Delete vehicle", False, f"Delete didn't return success")
                return False
        else:
            log_test("Delete vehicle", False, f"Status {response.status_code}")
            return False
        
        # VERIFY DELETE (should get 404)
        print("\n--- VERIFY DELETE ---")
        response = requests.get(f"{BASE_URL}/vehicles/{created_id}")
        print(f"Get deleted vehicle Status: {response.status_code}")
        
        if response.status_code == 404:
            log_test("Verify vehicle deleted (404)", True, "Correctly returns 404 for deleted vehicle")
            return True
        else:
            log_test("Verify vehicle deleted (404)", False, f"Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        log_test("Vehicle CRUD", False, f"Exception: {str(e)}")
        return False


def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for r in test_results if r['passed'])
    total = len(test_results)
    
    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    
    if total - passed > 0:
        print("\n❌ FAILED TESTS:")
        for r in test_results:
            if not r['passed']:
                print(f"  - {r['name']}")
                if r['details']:
                    print(f"    {r['details']}")
    
    print("\n" + "="*80)


def main():
    """Run all tests"""
    print("="*80)
    print("TRI STATE AUTO BROKERS - BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    # Test 1: Root endpoint
    test_root_endpoint()
    
    # Test 2: List vehicles
    vehicles = test_list_vehicles()
    
    # Test 3: Sorting
    test_vehicle_sorting()
    
    # Get a vehicle ID for subsequent tests
    vehicle_id = None
    if vehicles and len(vehicles) > 0:
        vehicle_id = vehicles[0]['id']
        print(f"\nUsing vehicle ID for tests: {vehicle_id}")
    
    if vehicle_id:
        # Test 4: Get vehicle by ID
        test_get_vehicle_by_id(vehicle_id)
    
    # Test 5-8: Form submissions
    test_contact_form()
    test_vehicle_finder_form()
    test_credit_application_form()
    test_deposit_form()
    
    if vehicle_id:
        # Test 9: Vehicle inquiry
        test_vehicle_inquiry(vehicle_id)
        
        # Test 10: Cloudinary upload (expect 503)
        test_cloudinary_upload(vehicle_id)
    
    # Test 11: CRUD operations
    if vehicle_id:
        test_vehicle_crud(vehicle_id)
    
    # Print summary
    print_summary()
    
    # Return exit code
    passed = sum(1 for r in test_results if r['passed'])
    total = len(test_results)
    return 0 if passed == total else 1


if __name__ == "__main__":
    exit(main())
