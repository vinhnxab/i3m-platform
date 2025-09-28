#!/bin/bash

# I3M Platform - Docker-Kubernetes Monitoring Script
# Usage: ./scripts/docker-k8s-monitor.sh [--continuous]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
NAMESPACE="i3m-platform"
REGISTRY_URL="localhost:5000"

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  I3M DOCKER-K8S MONITOR${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

check_docker_status() {
    echo -e "${PURPLE}[DOCKER STATUS]${NC}"
    echo "Docker Engine: $(docker version --format '{{.Server.Version}}' 2>/dev/null || echo 'Not running')"
    echo "Docker Containers: $(docker ps -q | wc -l) running"
    echo "Docker Images: $(docker images -q | wc -l) total"
    echo "Local Registry: $(docker ps --filter name=local-registry --format '{{.Status}}' || echo 'Not running')"
    echo ""
}

check_k8s_status() {
    echo -e "${PURPLE}[KUBERNETES STATUS]${NC}"
    echo "Cluster: $(kubectl config current-context 2>/dev/null || echo 'Not connected')"
    echo "Nodes: $(kubectl get nodes --no-headers 2>/dev/null | wc -l || echo '0') ready"
    echo "Namespaces: $(kubectl get namespaces --no-headers 2>/dev/null | wc -l || echo '0') total"
    
    if kubectl get namespace "$NAMESPACE" &>/dev/null; then
        local pods_ready=$(kubectl get pods -n "$NAMESPACE" --no-headers 2>/dev/null | grep -c "1/1" || echo "0")
        local pods_total=$(kubectl get pods -n "$NAMESPACE" --no-headers 2>/dev/null | wc -l || echo "0")
        echo "Pods in $NAMESPACE: $pods_ready/$pods_total ready"
    else
        echo "Namespace $NAMESPACE: Not found"
    fi
    echo ""
}

check_image_sync() {
    echo -e "${PURPLE}[IMAGE SYNCHRONIZATION]${NC}"
    
    local docker_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep "i3m-platform" | sort)
    local k8s_images=$(kubectl get pods -n "$NAMESPACE" -o jsonpath='{range .items[*]}{.spec.containers[0].image}{"\n"}{end}' 2>/dev/null | sort | uniq)
    
    echo "Docker Images (i3m-platform):"
    echo "$docker_images" | head -5
    if [ $(echo "$docker_images" | wc -l) -gt 5 ]; then
        echo "... and $(($(echo "$docker_images" | wc -l) - 5)) more"
    fi
    echo ""
    
    echo "K8s Pod Images:"
    echo "$k8s_images" | head -5
    if [ $(echo "$k8s_images" | wc -l) -gt 5 ]; then
        echo "... and $(($(echo "$k8s_images" | wc -l) - 5)) more"
    fi
    echo ""
}

check_networking() {
    echo -e "${PURPLE}[NETWORKING]${NC}"
    echo "Docker Networks:"
    docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}" | grep -E "(kind|i3m-platform|bridge)" || echo "No relevant networks found"
    echo ""
    
    echo "K8s Services (top 5):"
    kubectl get services -n "$NAMESPACE" --no-headers 2>/dev/null | head -5 | awk '{print $1 "\t" $2 "\t" $3 "\t" $5}' || echo "No services found"
    echo ""
}

check_storage() {
    echo -e "${PURPLE}[STORAGE]${NC}"
    echo "Persistent Volumes:"
    kubectl get pv 2>/dev/null | tail -n +2 || echo "No PVs found"
    echo ""
    
    echo "Persistent Volume Claims:"
    kubectl get pvc -n "$NAMESPACE" 2>/dev/null | tail -n +2 || echo "No PVCs found"
    echo ""
}

check_resource_usage() {
    echo -e "${PURPLE}[RESOURCE USAGE]${NC}"
    
    # Docker resource usage
    echo "Docker Container Resources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -6
    echo ""
    
    # K8s resource usage
    echo "K8s Node Resources:"
    kubectl top nodes 2>/dev/null || echo "Metrics server not available"
    echo ""
    
    echo "K8s Pod Resources (top 5):"
    kubectl top pods -n "$NAMESPACE" 2>/dev/null | head -6 || echo "Metrics server not available"
    echo ""
}

check_health() {
    echo -e "${PURPLE}[HEALTH CHECK]${NC}"
    
    # Check Kind cluster health
    if kind get clusters | grep -q "i3m-platform"; then
        echo -e "${GREEN}✓${NC} Kind cluster 'i3m-platform' is running"
    else
        echo -e "${RED}✗${NC} Kind cluster 'i3m-platform' not found"
    fi
    
    # Check local registry
    if docker ps | grep -q local-registry; then
        echo -e "${GREEN}✓${NC} Local registry is running"
        # Test registry connectivity
        if curl -s http://localhost:5000/v2/ > /dev/null; then
            echo -e "${GREEN}✓${NC} Local registry is accessible"
        else
            echo -e "${YELLOW}⚠${NC} Local registry not responding"
        fi
    else
        echo -e "${RED}✗${NC} Local registry not running"
    fi
    
    # Check critical pods
    local critical_pods=("postgres" "mongodb" "redis" "api-gateway" "auth-service")
    for pod in "${critical_pods[@]}"; do
        if kubectl get pods -n "$NAMESPACE" 2>/dev/null | grep -q "$pod.*1/1.*Running"; then
            echo -e "${GREEN}✓${NC} $pod is healthy"
        else
            echo -e "${RED}✗${NC} $pod is not healthy"
        fi
    done
    echo ""
}

generate_recommendations() {
    echo -e "${PURPLE}[RECOMMENDATIONS]${NC}"
    
    local recommendations=()
    
    # Check if local registry is running
    if ! docker ps | grep -q local-registry; then
        recommendations+=("Start local registry: docker run -d -p 5000:5000 --name local-registry registry:2")
    fi
    
    # Check for persistent storage
    local pv_count=$(kubectl get pv 2>/dev/null | wc -l)
    if [ "$pv_count" -lt 2 ]; then
        recommendations+=("Add persistent storage: kubectl apply -f k8s-improvements/persistent-storage.yaml")
    fi
    
    # Check for failed pods
    local failed_pods=$(kubectl get pods -n "$NAMESPACE" 2>/dev/null | grep -v "1/1.*Running" | wc -l)
    if [ "$failed_pods" -gt 1 ]; then
        recommendations+=("Fix failed pods: kubectl get pods -n $NAMESPACE | grep -v Running")
    fi
    
    # Check resource usage
    local high_cpu_containers=$(docker stats --no-stream --format "{{.CPUPerc}}" | sed 's/%//' | awk '$1 > 80 {count++} END {print count+0}')
    if [ "$high_cpu_containers" -gt 0 ]; then
        recommendations+=("Monitor high CPU usage containers")
    fi
    
    if [ ${#recommendations[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ System is running optimally!${NC}"
    else
        for rec in "${recommendations[@]}"; do
            echo -e "${YELLOW}⚠${NC} $rec"
        done
    fi
    echo ""
}

run_continuous_monitoring() {
    echo -e "${BLUE}Starting continuous monitoring... (Press Ctrl+C to stop)${NC}"
    echo ""
    
    while true; do
        clear
        print_header
        echo "Last updated: $(date)"
        echo ""
        
        check_docker_status
        check_k8s_status
        check_health
        check_resource_usage
        
        sleep 30
    done
}

main() {
    if [ "$1" = "--continuous" ]; then
        run_continuous_monitoring
    else
        print_header
        check_docker_status
        check_k8s_status
        check_image_sync
        check_networking
        check_storage
        check_resource_usage
        check_health
        generate_recommendations
    fi
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${BLUE}Monitoring stopped.${NC}"; exit 0' INT

main "$@"
