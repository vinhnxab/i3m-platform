#!/bin/bash

# Script to increase swap from 4GB to 12GB
echo "=== I3M Platform Swap Increase to 12GB Script ==="
echo "Current swap status:"
free -h
echo

echo "Current swap file:"
ls -la /swap.img
echo

echo "Disk space available:"
df -h / | tail -1
echo

echo "=== Step 1: Disable current swap ==="
sudo swapoff /swap.img
echo "Swap disabled"
echo

echo "=== Step 2: Backup current swap file ==="
sudo cp /swap.img /swap.img.backup
echo "Backup created: /swap.img.backup"
echo

echo "=== Step 3: Remove old swap file ==="
sudo rm /swap.img
echo "Old swap file removed"
echo

echo "=== Step 4: Create new 12GB swap file ==="
sudo fallocate -l 12G /swap.img
echo "New 12GB swap file created"
echo

echo "=== Step 5: Set correct permissions ==="
sudo chmod 600 /swap.img
echo "Permissions set"
echo

echo "=== Step 6: Format as swap ==="
sudo mkswap /swap.img
echo "Swap file formatted"
echo

echo "=== Step 7: Enable new swap ==="
sudo swapon /swap.img
echo "New swap enabled"
echo

echo "=== Step 8: Update fstab ==="
echo "Updating /etc/fstab..."
sudo sed -i 's|/swap.img|/swap.img|g' /etc/fstab
echo "fstab updated"
echo

echo "=== Final Status ==="
echo "New swap status:"
free -h
echo

echo "Swap file info:"
ls -la /swap.img
echo

echo "=== Swap Increase Complete ==="
echo "Swap increased from 4GB to 12GB successfully!"
echo "System will now have significantly more virtual memory available."

