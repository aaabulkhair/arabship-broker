/*
  # Initial Schema for Arab ShipBroker v2

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text, nullable)
      - `phone` (text, nullable)
      - `company` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cargo` - Cargo listings
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to profiles)
      - Cargo details (name, quantity, type, etc.)
      - Routing information (ports, dates)
      - `status` (enum: active, matched, completed)
      - Timestamps
    
    - `vessels` - Vessel listings
      - `id` (uuid, primary key)
      - `owner_id` (uuid, foreign key to profiles)
      - Vessel details (name, type, dwt, etc.)
      - Availability information
      - `status` (enum: active, matched, completed)
      - Timestamps
    
    - `matches` - Cargo-vessel matches
      - `id` (uuid, primary key)
      - `cargo_id` (uuid, foreign key)
      - `vessel_id` (uuid, foreign key)
      - `score` (numeric, match score 0-1)
      - `status` (enum: pending, accepted, rejected)
      - Timestamps
    
    - `newsletter_subscribers` - Newsletter subscriptions
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text, nullable)
      - `subscribed_at` (timestamp)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Public read access for newsletter subscriptions (admin only)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cargo table
CREATE TABLE IF NOT EXISTS cargo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cargo_name text NOT NULL,
  quantity text NOT NULL,
  quantity_unit text NOT NULL,
  imsbc_type text NOT NULL,
  stowage_factor text,
  loading_port text NOT NULL,
  discharging_port text NOT NULL,
  laycan_from date NOT NULL,
  laycan_to date NOT NULL,
  target_freight text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'matched', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vessels table
CREATE TABLE IF NOT EXISTS vessels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vessel_name text NOT NULL,
  vessel_type text NOT NULL,
  dwt text NOT NULL,
  year_built text NOT NULL,
  flag text NOT NULL,
  has_gear boolean DEFAULT false,
  gear_details text,
  fuel_consumption text,
  current_location text NOT NULL,
  availability date NOT NULL,
  preferred_trade text,
  target_rate text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'matched', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo_id uuid REFERENCES cargo(id) ON DELETE CASCADE NOT NULL,
  vessel_id uuid REFERENCES vessels(id) ON DELETE CASCADE NOT NULL,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 1),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cargo_id, vessel_id)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Cargo policies
CREATE POLICY "Users can read own cargo"
  ON cargo
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own cargo"
  ON cargo
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own cargo"
  ON cargo
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own cargo"
  ON cargo
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Vessels policies
CREATE POLICY "Users can read own vessels"
  ON vessels
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own vessels"
  ON vessels
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own vessels"
  ON vessels
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own vessels"
  ON vessels
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Matches policies (users can see matches for their cargo/vessels)
CREATE POLICY "Users can read matches for their listings"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cargo WHERE cargo.id = matches.cargo_id AND cargo.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vessels WHERE vessels.id = matches.vessel_id AND vessels.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update matches for their listings"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cargo WHERE cargo.id = matches.cargo_id AND cargo.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM vessels WHERE vessels.id = matches.vessel_id AND vessels.owner_id = auth.uid()
    )
  );

-- Newsletter policies (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cargo_updated_at
  BEFORE UPDATE ON cargo
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vessels_updated_at
  BEFORE UPDATE ON vessels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Reset and fix RLS policies completely

-- First, disable RLS temporarily to clean up
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_listings DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Allow public insert on vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "Enable insert for anonymous users on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Enable insert for anonymous users on vessel_listings" ON vessel_listings;
DROP POLICY IF EXISTS "Enable read access for authenticated users on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable read access for authenticated users on cargo_listings" ON cargo_listings;
DROP POLICY IF EXISTS "Enable read access for authenticated users on vessel_listings" ON vessel_listings;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_listings ENABLE ROW LEVEL SECURITY;

-- Create simple policies that allow anyone to insert
CREATE POLICY "public_insert_contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_cargo" ON cargo_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_vessel" ON vessel_listings FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users to read
CREATE POLICY "auth_read_contact" ON contact_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_cargo" ON cargo_listings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "auth_read_vessel" ON vessel_listings FOR SELECT USING (auth.role() = 'authenticated');