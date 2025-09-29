-- ERP Groups and Roles Template Data
-- This script creates comprehensive ERP department roles for MANAGEMENT_USERS and TENANT_USERS groups

-- Create TENANT_USERS group if it doesn't exist
INSERT INTO core.user_groups (
    id, 
    tenant_id, 
    name, 
    description, 
    permissions, 
    priority, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'tenant_users',
    'Tenant users group with ERP department access',
    '{"tenant_access": true, "erp_access": true, "department_roles": true}',
    5,
    true,
    NOW(),
    NOW()
) ON CONFLICT (name, tenant_id) DO NOTHING;

-- Update MANAGEMENT_USERS group with comprehensive ERP permissions
UPDATE core.user_groups 
SET 
    description = 'Management users group with full ERP department access and administrative privileges',
    permissions = '{
        "admin": true,
        "manage_users": true,
        "manage_groups": true,
        "manage_tenants": true,
        "view_analytics": true,
        "erp_access": true,
        "department_roles": {
            "finance": {
                "manager": true,
                "user": true,
                "permissions": ["view_finance", "edit_finance", "approve_finance", "report_finance"]
            },
            "accounting": {
                "manager": true,
                "user": true,
                "permissions": ["view_accounting", "edit_accounting", "approve_accounting", "report_accounting"]
            },
            "hr": {
                "manager": true,
                "user": true,
                "permissions": ["view_hr", "edit_hr", "approve_hr", "report_hr"]
            },
            "sales": {
                "manager": true,
                "user": true,
                "permissions": ["view_sales", "edit_sales", "approve_sales", "report_sales"]
            },
            "marketing": {
                "manager": true,
                "user": true,
                "permissions": ["view_marketing", "edit_marketing", "approve_marketing", "report_marketing"]
            },
            "inventory": {
                "manager": true,
                "user": true,
                "permissions": ["view_inventory", "edit_inventory", "approve_inventory", "report_inventory"]
            },
            "purchasing": {
                "manager": true,
                "user": true,
                "permissions": ["view_purchasing", "edit_purchasing", "approve_purchasing", "report_purchasing"]
            },
            "production": {
                "manager": true,
                "user": true,
                "permissions": ["view_production", "edit_production", "approve_production", "report_production"]
            },
            "quality": {
                "manager": true,
                "user": true,
                "permissions": ["view_quality", "edit_quality", "approve_quality", "report_quality"]
            },
            "it": {
                "manager": true,
                "user": true,
                "permissions": ["view_it", "edit_it", "approve_it", "report_it"]
            },
            "customer_service": {
                "manager": true,
                "user": true,
                "permissions": ["view_customer_service", "edit_customer_service", "approve_customer_service", "report_customer_service"]
            },
            "logistics": {
                "manager": true,
                "user": true,
                "permissions": ["view_logistics", "edit_logistics", "approve_logistics", "report_logistics"]
            },
            "legal": {
                "manager": true,
                "user": true,
                "permissions": ["view_legal", "edit_legal", "approve_legal", "report_legal"]
            }
        }
    }',
    updated_at = NOW()
WHERE name = 'management_users' AND tenant_id = '00000000-0000-0000-0000-000000000000';

-- Update TENANT_USERS group with comprehensive ERP permissions
UPDATE core.user_groups 
SET 
    description = 'Tenant users group with ERP department access for tenant-specific operations',
    permissions = '{
        "tenant_access": true,
        "erp_access": true,
        "department_roles": {
            "finance": {
                "manager": true,
                "user": true,
                "permissions": ["view_finance", "edit_finance", "report_finance"]
            },
            "accounting": {
                "manager": true,
                "user": true,
                "permissions": ["view_accounting", "edit_accounting", "report_accounting"]
            },
            "hr": {
                "manager": true,
                "user": true,
                "permissions": ["view_hr", "edit_hr", "report_hr"]
            },
            "sales": {
                "manager": true,
                "user": true,
                "permissions": ["view_sales", "edit_sales", "report_sales"]
            },
            "marketing": {
                "manager": true,
                "user": true,
                "permissions": ["view_marketing", "edit_marketing", "report_marketing"]
            },
            "inventory": {
                "manager": true,
                "user": true,
                "permissions": ["view_inventory", "edit_inventory", "report_inventory"]
            },
            "purchasing": {
                "manager": true,
                "user": true,
                "permissions": ["view_purchasing", "edit_purchasing", "report_purchasing"]
            },
            "production": {
                "manager": true,
                "user": true,
                "permissions": ["view_production", "edit_production", "report_production"]
            },
            "quality": {
                "manager": true,
                "user": true,
                "permissions": ["view_quality", "edit_quality", "report_quality"]
            },
            "it": {
                "manager": true,
                "user": true,
                "permissions": ["view_it", "edit_it", "report_it"]
            },
            "customer_service": {
                "manager": true,
                "user": true,
                "permissions": ["view_customer_service", "edit_customer_service", "report_customer_service"]
            },
            "logistics": {
                "manager": true,
                "user": true,
                "permissions": ["view_logistics", "edit_logistics", "report_logistics"]
            },
            "legal": {
                "manager": true,
                "user": true,
                "permissions": ["view_legal", "edit_legal", "report_legal"]
            }
        }
    }',
    updated_at = NOW()
WHERE name = 'tenant_users' AND tenant_id = '00000000-0000-0000-0000-000000000000';

-- Create MARKETPLACE_DEVELOPERS group if it doesn't exist
INSERT INTO core.user_groups (
    id, 
    tenant_id, 
    name, 
    description, 
    permissions, 
    priority, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'marketplace_developers',
    'Marketplace developers group with development and marketplace access',
    '{
        "developer": true,
        "marketplace_access": true,
        "development_tools": true,
        "api_access": true,
        "permissions": ["create_apps", "manage_apps", "publish_apps", "view_analytics", "access_apis"]
    }',
    8,
    true,
    NOW(),
    NOW()
) ON CONFLICT (name, tenant_id) DO NOTHING;

-- Create TENANT_CUSTOMERS group if it doesn't exist
INSERT INTO core.user_groups (
    id, 
    tenant_id, 
    name, 
    description, 
    permissions, 
    priority, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'tenant_customers',
    'Tenant customers group with customer access to tenant services',
    '{
        "customer": true,
        "tenant_customer": true,
        "service_access": true,
        "permissions": ["view_services", "use_services", "view_billing", "support_access"]
    }',
    3,
    true,
    NOW(),
    NOW()
) ON CONFLICT (name, tenant_id) DO NOTHING;

-- Display the updated groups
SELECT 
    name,
    description,
    permissions,
    priority,
    is_active
FROM core.user_groups 
WHERE tenant_id = '00000000-0000-0000-0000-000000000000'
ORDER BY priority DESC;
