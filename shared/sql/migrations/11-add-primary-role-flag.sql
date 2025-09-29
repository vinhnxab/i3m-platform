-- Add is_primary column to user_group_assignments table for roles
-- Migration: 11-add-primary-role-flag.sql

-- Add is_primary_role column to user_group_assignments
ALTER TABLE core.user_group_assignments 
ADD COLUMN is_primary_role BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN core.user_group_assignments.is_primary_role IS 'Primary role for user, only one role can be primary per user';

-- Create unique constraint to ensure only one primary role per user
CREATE UNIQUE INDEX idx_user_primary_role ON core.user_group_assignments(user_id) 
WHERE is_primary_role = TRUE;

-- Update existing assignments to have first role as primary
UPDATE core.user_group_assignments 
SET is_primary_role = TRUE 
WHERE id IN (
    SELECT DISTINCT ON (user_id) id 
    FROM core.user_group_assignments 
    ORDER BY user_id, assigned_at ASC
);
