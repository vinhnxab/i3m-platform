#!/bin/bash

# Script to optimize swap settings for better performance
echo "=== I3M Platform Swap Optimization ==="
echo "Current swap settings:"
echo

echo "=== Current Swap Status ==="
free -h
echo

echo "=== Current Swappiness ==="
cat /proc/sys/vm/swappiness
echo

echo "=== Current VFS Cache Pressure ==="
cat /proc/sys/vm/vfs_cache_pressure
echo

echo "=== Optimizing Swap Settings ==="
echo "Setting swappiness to 10 (default is 60)..."
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
echo

echo "Setting vfs_cache_pressure to 50 (default is 100)..."
sudo sysctl vm.vfs_cache_pressure=50
echo "vm.vfs_cache_pressure=50" | sudo tee -a /etc/sysctl.conf
echo

echo "Setting dirty_ratio to 15 (default is 20)..."
sudo sysctl vm.dirty_ratio=15
echo "vm.dirty_ratio=15" | sudo tee -a /etc/sysctl.conf
echo

echo "Setting dirty_background_ratio to 5 (default is 10)..."
sudo sysctl vm.dirty_background_ratio=5
echo "vm.dirty_background_ratio=5" | sudo tee -a /etc/sysctl.conf
echo

echo "=== Final Settings ==="
echo "Swappiness: $(cat /proc/sys/vm/swappiness)"
echo "VFS Cache Pressure: $(cat /proc/sys/vm/vfs_cache_pressure)"
echo "Dirty Ratio: $(cat /proc/sys/vm/dirty_ratio)"
echo "Dirty Background Ratio: $(cat /proc/sys/vm/dirty_background_ratio)"
echo

echo "=== Swap Optimization Complete ==="
echo "Settings optimized for better performance!"
echo "Changes will persist after reboot."

