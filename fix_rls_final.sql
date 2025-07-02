-- FINAL FIX: Completely reset and fix RLS policies for anonymous form submissions

-- Step 1: Drop ALL existing policies completely
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Allow public insert on vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "Enable insert for anonymous users on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Enable insert for anonymous users on vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "Enable read access for authenticated users on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Enable read access for authenticated users on vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "public_insert_contact" ON contact_submissions;
DROP POLICY IF EXISTS "public_insert_cargo" ON cargo_listings;
DROP POLICY IF EXISTS "public_insert_vessel" ON vessel_listings;
DROP POLICY IF EXISTS "auth_read_contact" ON contact_submissions;
DROP POLICY IF EXISTS "auth_read_cargo" ON cargo_listings;
DROP POLICY IF EXISTS "auth_read_vessel" ON vessel_listings;

-- Step 2: Temporarily disable RLS to clean everything up
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_listings DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_listings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, working policies that allow public INSERT operations
-- These policies allow anyone (including anonymous users) to insert data
CREATE POLICY "allow_public_insert_contact_submissions" 
ON contact_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "allow_public_insert_cargo_listings" 
ON cargo_listings 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "allow_public_insert_vessel_listings" 
ON vessel_listings 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Step 5: Create policies for authenticated users to read data (admin access)
CREATE POLICY "allow_authenticated_read_contact_submissions" 
ON contact_submissions 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "allow_authenticated_read_cargo_listings" 
ON cargo_listings 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "allow_authenticated_read_vessel_listings" 
ON vessel_listings 
FOR SELECT 
TO authenticated 
USING (true);

-- Verification query to check policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'cargo_listings', 'vessel_listings')
ORDER BY tablename, policyname; 