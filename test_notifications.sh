#!/bin/bash

# Test script for notification system
echo "Testing Notification System..."

# Base URL
BASE_URL="http://127.0.0.1:8000/api"

# Test credentials (you may need to adjust these)
EMAIL="admin@example.com"
PASSWORD="password"

echo "1. Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Please check credentials."
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Login successful"

echo "2. Testing notification endpoints..."

# Test get unread notifications
echo "Testing GET /notifications/unread..."
UNREAD_RESPONSE=$(curl -s -X GET \
  "$BASE_URL/notifications/unread" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "✅ Unread notifications response: $UNREAD_RESPONSE"

# Test get all notifications
echo "Testing GET /notifications..."
ALL_RESPONSE=$(curl -s -X GET \
  "$BASE_URL/notifications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "✅ All notifications response: $ALL_RESPONSE"

echo "3. Testing ticket creation to trigger notifications..."

# Create a test ticket
TICKET_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/tickets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification Ticket",
    "description": "This ticket is created to test the notification system",
    "priority": "MEDIUM",
    "location": "Test Location"
  }')

echo "✅ Ticket creation response: $TICKET_RESPONSE"

TICKET_ID=$(echo $TICKET_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ ! -z "$TICKET_ID" ]; then
    echo "✅ Created ticket with ID: $TICKET_ID"
    
    echo "4. Testing ticket workflow actions..."
    
    # Acquire ticket
    echo "Testing ticket acquire..."
    ACQUIRE_RESPONSE=$(curl -s -X POST \
      "$BASE_URL/tickets/$TICKET_ID/acquire" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    echo "✅ Acquire response: $ACQUIRE_RESPONSE"
    
    # Set to in progress
    echo "Testing ticket set to in progress..."
    PROGRESS_RESPONSE=$(curl -s -X POST \
      "$BASE_URL/tickets/$TICKET_ID/progress" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    echo "✅ Progress response: $PROGRESS_RESPONSE"
    
    # Resolve ticket
    echo "Testing ticket resolve..."
    RESOLVE_RESPONSE=$(curl -s -X POST \
      "$BASE_URL/tickets/$TICKET_ID/resolve" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"note": "Test resolution note"}')
    
    echo "✅ Resolve response: $RESOLVE_RESPONSE"
    
    echo "5. Checking for new notifications..."
    
    # Check notifications again
    FINAL_UNREAD_RESPONSE=$(curl -s -X GET \
      "$BASE_URL/notifications/unread" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    echo "✅ Final unread notifications: $FINAL_UNREAD_RESPONSE"
    
else
    echo "❌ Failed to create ticket"
fi

echo "🎉 Notification system test completed!"
