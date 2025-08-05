#!/usr/bin/env python3
import requests
import json

# Get admin token
login_response = requests.post("http://localhost:8001/api/auth/login", json={
    "email": "admin@growe.com",
    "password": "admin123"
})

if login_response.status_code == 200:
    token = login_response.json()["token"]
    print(f"Got token: {token[:50]}...")
    
    # Try simple POST
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    simple_data = {
        "company_name": "Simple Test Co",
        "primary_contact": "Test User",
        "email": "test@example.com",
        "phone": "123-456-7890"
    }
    
    print("Sending POST request...")
    response = requests.post("http://localhost:8001/api/3pls", json=simple_data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
else:
    print(f"Login failed: {login_response.status_code} - {login_response.text}")