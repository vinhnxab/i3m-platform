#!/bin/bash

# Test script for backend login with primary group/role and tenant token

echo "🧪 Testing Backend Login Integration"
echo "====================================="

# Configuration
AUTH_SERVICE_URL="http://localhost:3008"
API_GATEWAY_URL="http://localhost:3004"

# Test data
EMAIL="admin@i3m.com"
PASSWORD="admin123"

echo "📡 Testing Auth Service Health..."
curl -s "$AUTH_SERVICE_URL/health" | jq '.' || echo "❌ Auth service not responding"

echo ""
echo "📡 Testing API Gateway Health..."
curl -s "$API_GATEWAY_URL/health" | jq '.' || echo "❌ API Gateway not responding"

echo ""
echo "🔐 Testing Login with Enhanced Response..."
echo "Email: $EMAIL"
echo "Password: $PASSWORD"

# Test login
RESPONSE=$(curl -s -X POST "$AUTH_SERVICE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo ""
echo "📋 Login Response:"
echo "$RESPONSE" | jq '.' || echo "❌ Invalid JSON response"

# Extract tokens
ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token // empty')
TENANT_TOKEN=$(echo "$RESPONSE" | jq -r '.tenant_token // empty')
PRIMARY_GROUP=$(echo "$RESPONSE" | jq -r '.primary_group // empty')

echo ""
echo "🔑 Extracted Data:"
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo "Tenant Token: ${TENANT_TOKEN:0:50}..."
echo "Primary Group: $PRIMARY_GROUP"

if [ -n "$ACCESS_TOKEN" ]; then
    echo ""
    echo "🔍 Testing Token Validation..."
    PROFILE_RESPONSE=$(curl -s -X GET "$AUTH_SERVICE_URL/api/v1/auth/profile" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "Profile Response:"
    echo "$PROFILE_RESPONSE" | jq '.' || echo "❌ Profile request failed"
fi

echo ""
echo "✅ Backend Login Test Completed"
