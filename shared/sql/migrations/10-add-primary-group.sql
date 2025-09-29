-- Add is_primary column to user_group_assignments table
-- Migration: 10-add-primary-group.sql

-- Add is_primary column
ALTER TABLE core.user_group_assignments 
ADD COLUMN is_primary BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN core.user_group_assignments.is_primary IS 'Primary group for user, only one group can be primary per user';

-- Create unique constraint to ensure only one primary group per user
CREATE UNIQUE INDEX idx_user_primary_group ON core.user_group_assignments(user_id) 
WHERE is_primary = TRUE;

-- Update existing assignments to have first group as primary
UPDATE core.user_group_assignments 
SET is_primary = TRUE 
WHERE id IN (
    SELECT DISTINCT ON (user_id) id 
    FROM core.user_group_assignments 
    ORDER BY user_id, assigned_at ASC
);
