-- Create test user with real password hash
-- Password: "password123" -> bcrypt hash

-- Delete existing test users
DELETE FROM core.user_group_assignments WHERE user_id IN (
    SELECT id FROM core.users WHERE email IN ('john.developer@i3m-platform.com', 'sarah.hr@i3m-platform.com')
);

DELETE FROM core.users WHERE email IN ('john.developer@i3m-platform.com', 'sarah.hr@i3m-platform.com');

-- Create John Developer with real password hash
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
    'john.developer@i3m-platform.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
    'John',
    'Developer',
    'MARKETPLACE_DEVELOPER',
    'active',
    '{"language": "en", "timezone": "UTC", "multi_group": true}',
    NOW(),
    NOW()
);

-- Create Sarah Johnson with real password hash
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
    'sarah.hr@i3m-platform.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password123
    'Sarah',
    'Johnson',
    'MANAGEMENT_USER',
    'active',
    '{"language": "en", "timezone": "UTC", "multi_group": true}',
    NOW(),
    NOW()
);

-- Get the user IDs for assignment
WITH user_ids AS (
    SELECT 
        u.id as user_id,
        u.email,
        u.role as primary_role
    FROM core.users u
    WHERE u.email IN ('john.developer@i3m-platform.com', 'sarah.hr@i3m-platform.com')
),
group_ids AS (
    SELECT 
        g.id as group_id,
        g.name as group_name
    FROM core.user_groups g
    WHERE g.name IN ('marketplace_developers', 'management_users', 'tenant_users')
)
-- Assign John to multiple groups:
-- 1. MARKETPLACE_DEVELOPERS as developer
-- 2. MANAGEMENT_USERS as customer_service_user (support role)
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
        -- John's assignments
        WHEN ui.email = 'john.developer@i3m-platform.com' AND gi.group_name = 'marketplace_developers' THEN 'developer'
        WHEN ui.email = 'john.developer@i3m-platform.com' AND gi.group_name = 'management_users' THEN 'customer_service_user'
        
        -- Sarah's assignments  
        WHEN ui.email = 'sarah.hr@i3m-platform.com' AND gi.group_name = 'management_users' THEN 'hr_manager'
        WHEN ui.email = 'sarah.hr@i3m-platform.com' AND gi.group_name = 'marketplace_developers' THEN 'developer'
        
        ELSE 'user'
    END,
    NOW()
FROM user_ids ui
CROSS JOIN group_ids gi
WHERE 
    -- John: Developer + Customer Service Support
    (ui.email = 'john.developer@i3m-platform.com' AND gi.group_name IN ('marketplace_developers', 'management_users'))
    OR
    -- Sarah: HR Manager + Developer
    (ui.email = 'sarah.hr@i3m-platform.com' AND gi.group_name IN ('management_users', 'marketplace_developers'))
ON CONFLICT (user_id, group_id) DO NOTHING;

-- Display the multi-group assignments
SELECT 
    u.email,
    u.first_name,
    u.last_name,
    u.role as primary_role,
    g.name as group_name,
    uga.role as group_role,
    g.description as group_description,
    uga.assigned_at
FROM core.users u
JOIN core.user_group_assignments uga ON u.id = uga.user_id
JOIN core.user_groups g ON uga.group_id = g.id
WHERE u.email IN ('john.developer@i3m-platform.com', 'sarah.hr@i3m-platform.com')
ORDER BY u.email, g.priority DESC;
