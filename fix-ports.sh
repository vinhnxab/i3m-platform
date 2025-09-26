#!/bin/bash

# Script to fix all service ports according to documentation

echo "Fixing service ports in docker-compose.yml..."

# Backup original file
cp docker-compose.yml docker-compose.yml.backup

# ERP Services ports
sed -i 's/"3014:3014"/"3032:3032"/g' docker-compose.yml  # E-commerce Service
sed -i 's/"3015:3015"/"3033:3033"/g' docker-compose.yml  # CRM Service

# Analytics Services ports  
sed -i 's/"3016:3016"/"3017:3017"/g' docker-compose.yml  # AI Service
sed -i 's/"3017:3017"/"3018:3018"/g' docker-compose.yml  # ML Pipeline Service
sed -i 's/"3018:3018"/"3019:3019"/g' docker-compose.yml  # Analytics Service
sed -i 's/"3019:3019"/"3020:3020"/g' docker-compose.yml  # User Analytics Service

# Content Services ports
sed -i 's/"3020:3020"/"3021:3021"/g' docker-compose.yml  # Content Service
sed -i 's/"3021:3021"/"3022:3022"/g' docker-compose.yml  # Media Service
sed -i 's/"3022:3022"/"3023:3023"/g' docker-compose.yml  # Metadata Service

# Industry Services ports
sed -i 's/"3024:3024"/"3034:3034"/g' docker-compose.yml  # Healthcare Service
sed -i 's/"3025:3025"/"3035:3035"/g' docker-compose.yml  # Agriculture Service

# Infrastructure Services ports
sed -i 's/"3023:3023"/"3040:3040"/g' docker-compose.yml  # Security Service
sed -i 's/"3026:3026"/"3041:3041"/g' docker-compose.yml  # Observability Service
sed -i 's/"3027:3027"/"3042:3042"/g' docker-compose.yml  # Cost Optimization Service
sed -i 's/"3028:3028"/"3043:3043"/g' docker-compose.yml  # Load Balancer Service
sed -i 's/"3029:3029"/"3044:3044"/g' docker-compose.yml  # Secrets Management Service

# Integration Services ports
sed -i 's/"3036:3036"/"3050:3050"/g' docker-compose.yml  # API Documentation Service
sed -i 's/"3037:3037"/"3051:3051"/g' docker-compose.yml  # Integration Service
sed -i 's/"3038:3038"/"3052:3052"/g' docker-compose.yml  # Currency Exchange Service

# Marketplace Services ports
sed -i 's/"3028:3028"/"3060:3060"/g' docker-compose.yml  # Template Marketplace Service
sed -i 's/"3029:3029"/"3061:3061"/g' docker-compose.yml  # Template Installation Service
sed -i 's/"3030:3030"/"3062:3062"/g' docker-compose.yml  # Template Preview Service

# Shared Services ports
sed -i 's/"3031:3031"/"3070:3070"/g' docker-compose.yml  # Notification Service
sed -i 's/"3032:3032"/"3071:3071"/g' docker-compose.yml  # Workflow Service
sed -i 's/"3033:3033"/"3072:3072"/g' docker-compose.yml  # Billing Service

echo "Port fixes completed!"
echo "Backup saved as docker-compose.yml.backup"
