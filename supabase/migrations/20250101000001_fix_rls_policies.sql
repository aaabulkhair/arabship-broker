-- Fix RLS policies to allow anonymous users to submit forms

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Allow public insert on vessel_listings" ON vessel_listings;

-- Create new policies that allow anonymous (public) users to insert
CREATE POLICY "Enable insert for anonymous users on contact_submissions" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users on cargo_listings" ON cargo_listings
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users on vessel_listings" ON vessel_listings
  FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read all data
CREATE POLICY "Enable read for authenticated users on contact_submissions" ON contact_submissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read for authenticated users on cargo_listings" ON cargo_listings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read for authenticated users on vessel_listings" ON vessel_listings
  FOR SELECT TO authenticated USING (true); 