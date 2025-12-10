-- Fix RLS policy for admin_users table to allow login
-- The issue is that RLS is enabled but no policies exist, blocking all access

-- Option 1: Disable RLS on admin_users (simpler for admin table)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'admin_users';
