#!/bin/bash

# I3M Platform Resource Monitoring Script
echo "=== I3M Platform Resource Monitoring ==="
echo "Timestamp: $(date)"
echo

# System Resources
echo "=== System Resources ==="
echo "Memory Usage:"
free -h
echo

echo "Disk Usage:"
df -h | head -5
echo

echo "CPU Load:"
uptime
echo

# Docker Resources
echo "=== Docker Resources ==="
echo "Docker System Usage:"
docker system df
echo

echo "Top Docker Containers by Memory:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -10
echo

# Kubernetes Resources
echo "=== Kubernetes Resources ==="
echo "Kubernetes Nodes:"
kubectl get nodes -o wide
echo

echo "Kubernetes Pods Status:"
kubectl get pods -n i3m-platform -o wide
echo

echo "Kubernetes Services:"
kubectl get services -n i3m-platform
echo

echo "Kubernetes Deployments:"
kubectl get deployments -n i3m-platform
echo

echo "Kubernetes Ingress:"
kubectl get ingress -n i3m-platform
echo

# Resource Alerts
echo "=== Resource Alerts ==="
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
SWAP_USAGE=$(free | grep Swap | awk '{printf "%.0f", $3/$2 * 100.0}')
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

if [ "$MEMORY_USAGE" -gt 80 ]; then
    echo "⚠️  WARNING: Memory usage is ${MEMORY_USAGE}%"
fi

if [ "$SWAP_USAGE" -gt 90 ]; then
    echo "⚠️  WARNING: Swap usage is ${SWAP_USAGE}%"
fi

if [ "$DISK_USAGE" -gt 80 ]; then
    echo "⚠️  WARNING: Disk usage is ${DISK_USAGE}%"
fi

echo "Memory: ${MEMORY_USAGE}% | Swap: ${SWAP_USAGE}% | Disk: ${DISK_USAGE}%"
echo
echo "=== Monitoring Complete ==="
