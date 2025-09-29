-- Setup user primary group and role
-- This script will set the current group as primary for the user

-- First, let's check current user and groups
SELECT 
    u.id,
    u.email,
    u.tenant_id,
    u.primary_role,
    t.name as tenant_name,
    ug.name as group_name,
    uga.role as group_role,
    uga.is_primary,
    uga.is_primary_role
FROM core.users u
LEFT JOIN core.tenants t ON u.tenant_id = t.id
LEFT JOIN core.user_group_assignments uga ON u.id = uga.user_id
LEFT JOIN core.user_groups ug ON uga.group_id = ug.id
WHERE u.email = 'test@example.com';

-- Update user to have null tenant_id (no tenant)
UPDATE core.users 
SET 
    tenant_id = NULL,
    primary_role = 'admin',
    updated_at = NOW()
WHERE email = 'test@example.com';

-- Set the current group as primary
UPDATE core.user_group_assignments 
SET 
    is_primary = true,
    is_primary_role = true
WHERE user_id = '84350800-6c4b-4718-8afb-fa3615250593' 
  AND group_id = '63a678e7-1d33-46ec-9f0d-faa9bfcb0e1a';

-- Verify the setup
SELECT 
    u.id,
    u.email,
    u.tenant_id,
    u.primary_role,
    t.name as tenant_name,
    ug.name as group_name,
    uga.role as group_role,
    uga.is_primary,
    uga.is_primary_role
FROM core.users u
LEFT JOIN core.tenants t ON u.tenant_id = t.id
LEFT JOIN core.user_group_assignments uga ON u.id = uga.user_id
LEFT JOIN core.user_groups ug ON uga.group_id = ug.id
WHERE u.email = 'test@example.com';
