-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cargo_listings table
CREATE TABLE cargo_listings (
  id BIGSERIAL PRIMARY KEY,
  cargo_type TEXT NOT NULL,
  origin_port TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  cargo_weight DECIMAL,
  cargo_volume DECIMAL,
  preferred_vessel_type TEXT,
  loading_date DATE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  company TEXT,
  additional_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vessel_listings table
CREATE TABLE vessel_listings (
  id BIGSERIAL PRIMARY KEY,
  vessel_name TEXT NOT NULL,
  vessel_type TEXT NOT NULL,
  dwt DECIMAL,
  length DECIMAL,
  beam DECIMAL,
  draft DECIMAL,
  year_built INTEGER,
  flag TEXT,
  current_location TEXT,
  availability_date DATE,
  daily_rate DECIMAL,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  company TEXT,
  additional_specs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_listings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public insert access (for form submissions)
-- but restrict read access to authenticated users only

-- Contact submissions policies
CREATE POLICY "Allow public insert on contact_submissions" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact_submissions" ON contact_submissions
  FOR SELECT TO authenticated USING (true);

-- Cargo listings policies
CREATE POLICY "Allow public insert on cargo_listings" ON cargo_listings
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read cargo_listings" ON cargo_listings
  FOR SELECT TO authenticated USING (true);

-- Vessel listings policies
CREATE POLICY "Allow public insert on vessel_listings" ON vessel_listings
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read vessel_listings" ON vessel_listings
  FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

CREATE INDEX idx_cargo_listings_created_at ON cargo_listings(created_at DESC);
CREATE INDEX idx_cargo_listings_origin_port ON cargo_listings(origin_port);
CREATE INDEX idx_cargo_listings_destination_port ON cargo_listings(destination_port);
CREATE INDEX idx_cargo_listings_cargo_type ON cargo_listings(cargo_type);

CREATE INDEX idx_vessel_listings_created_at ON vessel_listings(created_at DESC);
CREATE INDEX idx_vessel_listings_vessel_type ON vessel_listings(vessel_type);
CREATE INDEX idx_vessel_listings_current_location ON vessel_listings(current_location);
CREATE INDEX idx_vessel_listings_availability_date ON vessel_listings(availability_date); 