-- Add primary_role column to users table
-- Migration: 09-add-primary-role.sql

-- Add primary_role column
ALTER TABLE core.users 
ADD COLUMN primary_role VARCHAR(100);

-- Add comment
COMMENT ON COLUMN core.users.primary_role IS 'Primary role for user, can be different from role field';

-- Create index for performance
CREATE INDEX idx_users_primary_role ON core.users(primary_role);

-- Update existing users to have primary_role = role if not set
UPDATE core.users 
SET primary_role = role 
WHERE primary_role IS NULL;
