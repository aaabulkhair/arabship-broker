-- Clean up duplicate RLS policies - keep only the working ones

-- Remove the old duplicate policies
DROP POLICY IF EXISTS "Allow authenticated users to read contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Allow authenticated users to read vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "Enable read for authenticated users on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable read for authenticated users on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Enable read for authenticated users on vessel_listings" ON vessel_listings;

-- Keep only the new clean policies:
-- allow_public_insert_contact_submissions (for INSERT)
-- allow_authenticated_read_contact_submissions (for SELECT)
-- (and similar for cargo_listings and vessel_listings)

-- Verify clean policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'cargo_listings', 'vessel_listings')
ORDER BY tablename, policyname; 