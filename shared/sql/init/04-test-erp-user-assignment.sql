-- Test ERP User Assignment
-- This script creates a test user and assigns them to MANAGEMENT_USERS group with ERP roles

-- Create a test ERP manager user
INSERT INTO core.users (
    id,
    tenant_id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    preferences,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'erp.manager@i3m-platform.com',
    '$2a$10$example.hash.for.testing.purposes.only',
    'ERP',
    'Manager',
    'MANAGEMENT_USER',
    'active',
    '{"language": "en", "timezone": "UTC"}',
    NOW(),
    NOW()
) ON CONFLICT (email, tenant_id) DO NOTHING;

-- Create a test ERP finance user
INSERT INTO core.users (
    id,
    tenant_id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    status,
    preferences,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'finance.user@i3m-platform.com',
    '$2a$10$example.hash.for.testing.purposes.only',
    'Finance',
    'User',
    'TENANT_USER',
    'active',
    '{"language": "en", "timezone": "UTC"}',
    NOW(),
    NOW()
) ON CONFLICT (email, tenant_id) DO NOTHING;

-- Get the user IDs for assignment
WITH user_ids AS (
    SELECT 
        u.id as user_id,
        u.email,
        u.role
    FROM core.users u
    WHERE u.email IN ('erp.manager@i3m-platform.com', 'finance.user@i3m-platform.com')
),
group_ids AS (
    SELECT 
        g.id as group_id,
        g.name as group_name
    FROM core.user_groups g
    WHERE g.name IN ('management_users', 'tenant_users')
)
-- Assign ERP Manager to MANAGEMENT_USERS group with admin role
INSERT INTO core.user_group_assignments (
    id,
    user_id,
    group_id,
    role,
    assigned_at
)
SELECT 
    gen_random_uuid(),
    ui.user_id,
    gi.group_id,
    CASE 
        WHEN ui.email = 'erp.manager@i3m-platform.com' AND gi.group_name = 'management_users' THEN 'admin'
        WHEN ui.email = 'finance.user@i3m-platform.com' AND gi.group_name = 'tenant_users' THEN 'finance_manager'
        ELSE 'user'
    END,
    NOW()
FROM user_ids ui
CROSS JOIN group_ids gi
WHERE (ui.email = 'erp.manager@i3m-platform.com' AND gi.group_name = 'management_users')
   OR (ui.email = 'finance.user@i3m-platform.com' AND gi.group_name = 'tenant_users')
ON CONFLICT (user_id, group_id) DO NOTHING;

-- Display the assignments
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    u.role as user_role,
    g.name as group_name,
    uga.role as group_role,
    uga.assigned_at
FROM core.users u
JOIN core.user_group_assignments uga ON u.id = uga.user_id
JOIN core.user_groups g ON uga.group_id = g.id
WHERE u.email IN ('erp.manager@i3m-platform.com', 'finance.user@i3m-platform.com')
ORDER BY u.email, g.name;
