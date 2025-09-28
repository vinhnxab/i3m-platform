#!/bin/bash

echo "=== I3M Platform Health Check ==="
echo "Timestamp: $(date)"
echo ""

echo "=== Kubernetes Pods Status ==="
kubectl get pods -n i3m-platform
echo ""

echo "=== Service Health Checks ==="
echo "API Gateway:"
kubectl port-forward -n i3m-platform service/api-gateway-service 3004:3004 > /dev/null 2>&1 &
sleep 2
curl -s http://localhost:3004/health || echo "API Gateway not responding"
pkill -f "port-forward.*3004" 2>/dev/null || true
echo ""

echo "Auth Service:"
kubectl port-forward -n i3m-platform service/auth-service 3008:3008 > /dev/null 2>&1 &
sleep 2
curl -s http://localhost:3008/health || echo "Auth Service not responding"
pkill -f "port-forward.*3008" 2>/dev/null || true
echo ""

echo "User Service:"
kubectl port-forward -n i3m-platform service/user-service 3009:3009 > /dev/null 2>&1 &
sleep 2
curl -s http://localhost:3009/actuator/health || echo "User Service not responding"
pkill -f "port-forward.*3009" 2>/dev/null || true
echo ""

echo "=== Health Check Complete ==="
