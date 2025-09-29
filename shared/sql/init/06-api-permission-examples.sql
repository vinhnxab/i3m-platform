-- API Permission Examples for Multi-Group Users
-- This script demonstrates how API permissions work with multi-group users

-- Create test API endpoints in the system
INSERT INTO core.api_endpoints (
    id,
    endpoint,
    method,
    description,
    created_at,
    updated_at
) VALUES 
    (gen_random_uuid(), '/api/v1/users', 'GET', 'List all users', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/users', 'POST', 'Create new user', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/users/:id', 'PUT', 'Update user', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/users/:id', 'DELETE', 'Delete user', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/groups', 'GET', 'List all groups', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/groups', 'POST', 'Create new group', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/erp/finance', 'GET', 'View finance data', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/erp/finance', 'POST', 'Create finance record', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/marketplace/apps', 'GET', 'List marketplace apps', NOW(), NOW()),
    (gen_random_uuid(), '/api/v1/marketplace/apps', 'POST', 'Create marketplace app', NOW(), NOW())
ON CONFLICT (endpoint, method) DO NOTHING;

-- Display the API permission matrix for our test users
SELECT 
    'John Developer (Multi-Group User)' as user_description,
    u.email,
    u.role as primary_role,
    jsonb_agg(
        jsonb_build_object(
            'group_name', g.name,
            'group_role', uga.role,
            'group_permissions', g.permissions
        )
    ) as group_memberships
FROM core.users u
JOIN core.user_group_assignments uga ON u.id = uga.user_id
JOIN core.user_groups g ON uga.group_id = g.id
WHERE u.email = 'john.developer@i3m-platform.com'
GROUP BY u.id, u.email, u.role

UNION ALL

SELECT 
    'Sarah Johnson (Multi-Group User)' as user_description,
    u.email,
    u.role as primary_role,
    jsonb_agg(
        jsonb_build_object(
            'group_name', g.name,
            'group_role', uga.role,
            'group_permissions', g.permissions
        )
    ) as group_memberships
FROM core.users u
JOIN core.user_group_assignments uga ON u.id = uga.user_id
JOIN core.user_groups g ON uga.group_id = g.id
WHERE u.email = 'sarah.hr@i3m-platform.com'
GROUP BY u.id, u.email, u.role;

-- Show API permission scenarios
SELECT 
    'API Permission Scenarios' as scenario_type,
    'GET /api/v1/users' as api_endpoint,
    'John Developer' as user,
    'marketplace_developers (developer)' as primary_group,
    'none' as permission_level,
    'Cannot access user management' as explanation

UNION ALL

SELECT 
    'API Permission Scenarios',
    'GET /api/v1/users',
    'John Developer',
    'management_users (customer_service_user)',
    'read',
    'Can view users for customer service'

UNION ALL

SELECT 
    'API Permission Scenarios',
    'POST /api/v1/users',
    'John Developer',
    'management_users (customer_service_user)',
    'none',
    'Cannot create users (needs admin role)'

UNION ALL

SELECT 
    'API Permission Scenarios',
    'GET /api/v1/marketplace/apps',
    'John Developer',
    'marketplace_developers (developer)',
    'read',
    'Can view marketplace apps'

UNION ALL

SELECT 
    'API Permission Scenarios',
    'POST /api/v1/marketplace/apps',
    'John Developer',
    'marketplace_developers (developer)',
    'write',
    'Can create marketplace apps'

UNION ALL

SELECT 
    'API Permission Scenarios',
    'GET /api/v1/erp/finance',
    'Sarah Johnson',
    'management_users (hr_manager)',
    'read',
    'Can view finance data as management user'

UNION ALL

SELECT 
    'API Permission Scenarios',
    'POST /api/v1/erp/finance',
    'Sarah Johnson',
    'management_users (hr_manager)',
    'write',
    'Can create finance records as management user';
