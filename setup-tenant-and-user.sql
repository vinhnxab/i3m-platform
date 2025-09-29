-- Setup tenant and user assignment
-- This script will create a tenant and assign the user to it

-- First, let's check current user
SELECT id, email, tenant_id, role, primary_role 
FROM core.users 
WHERE email = 'test@example.com';

-- Create a test tenant
INSERT INTO core.tenants (id, name, domain, status, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Test Tenant',
    'test-tenant.local',
    'active',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Update user to assign to tenant
UPDATE core.users 
SET 
    tenant_id = '11111111-1111-1111-1111-111111111111',
    primary_role = 'TENANT_ADMIN',
    updated_at = NOW()
WHERE email = 'test@example.com';

-- Create a primary group for the tenant
INSERT INTO core.user_groups (id, name, description, permissions, priority, is_active, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'tenant_admins',
    'Tenant administrators with full access',
    '{"admin": true, "manage_users": true, "manage_tenants": true, "view_analytics": true}',
    1,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Assign user to the primary group
INSERT INTO core.user_group_assignments (id, user_id, group_id, role, is_primary, assigned_at, created_at, updated_at)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '84350800-6c4b-4718-8afb-fa3615250593',
    '22222222-2222-2222-2222-222222222222',
    'admin',
    true,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 
    u.id,
    u.email,
    u.tenant_id,
    u.primary_role,
    t.name as tenant_name,
    ug.name as group_name,
    uga.role as group_role,
    uga.is_primary
FROM core.users u
LEFT JOIN core.tenants t ON u.tenant_id = t.id
LEFT JOIN core.user_group_assignments uga ON u.id = uga.user_id
LEFT JOIN core.user_groups ug ON uga.group_id = ug.id
WHERE u.email = 'test@example.com';
