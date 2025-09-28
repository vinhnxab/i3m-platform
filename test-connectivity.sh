#!/bin/bash

# I3M Platform Connectivity Test Script
echo "=== I3M Platform Connectivity Test ==="
echo "Timestamp: $(date)"
echo

# Test Kubernetes cluster connectivity
echo "=== Kubernetes Cluster Status ==="
kubectl cluster-info
echo

# Test pod connectivity
echo "=== Pod Connectivity Test ==="
echo "Testing auth-service..."
kubectl exec -n i3m-platform deployment/auth-service -- curl -s http://localhost:3008/health || echo "Auth service not responding"
echo

echo "Testing user-service..."
kubectl exec -n i3m-platform deployment/user-service -- curl -s http://localhost:3009/health || echo "User service not responding"
echo

# Test service-to-service communication
echo "=== Service-to-Service Communication ==="
echo "Testing auth-service to postgres..."
kubectl exec -n i3m-platform deployment/auth-service -- nc -zv postgres-service 5432 || echo "Postgres connection failed"
echo

echo "Testing auth-service to redis..."
kubectl exec -n i3m-platform deployment/auth-service -- nc -zv redis-service 6379 || echo "Redis connection failed"
echo

# Test ingress connectivity
echo "=== Ingress Connectivity Test ==="
echo "Testing ingress controller..."
kubectl get ingress -n i3m-platform
echo

# Port forwarding test
echo "=== Port Forwarding Test ==="
echo "Starting port forwarding for testing..."
echo "You can test the following endpoints:"
echo "- Auth Service: kubectl port-forward -n i3m-platform service/auth-service 3008:3008"
echo "- User Service: kubectl port-forward -n i3m-platform service/user-service 3009:3009"
echo "- API Gateway: kubectl port-forward -n i3m-platform service/api-gateway-service 3004:3004"
echo

# Test external access
echo "=== External Access Test ==="
echo "To test external access, add to /etc/hosts:"
echo "127.0.0.1 i3m-platform.local"
echo
echo "Then test with:"
echo "curl -H 'Host: i3m-platform.local' http://localhost/api/v1/auth/health"
echo

echo "=== Connectivity Test Complete ==="
