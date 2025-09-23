/*
  # Car Painting Quotation Database Schema

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `phone` (text)
      - `car_name` (text)
      - `car_year` (text)
      - `car_segment` (text)
      - `license_plate` (text)
      - `customer_source` (text)
      - `created_at` (timestamp)

    - `car_segments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `display_name` (text)
      - `created_at` (timestamp)

    - `car_parts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `display_name` (text)
      - `category` (text)
      - `created_at` (timestamp)

    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `display_name` (text)
      - `type` (text) -- required, optional
      - `created_at` (timestamp)

    - `removable_parts`
      - `id` (uuid, primary key)
      - `car_part_id` (uuid, foreign key)
      - `name` (text)
      - `display_name` (text)
      - `created_at` (timestamp)

    - `pricing`
      - `id` (uuid, primary key)
      - `car_segment_id` (uuid, foreign key)
      - `item_type` (text) -- car_part, service, removable_part, panel_painting
      - `item_id` (uuid)
      - `price` (numeric)
      - `created_at` (timestamp)

    - `quotations`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `service_type` (text) -- spot_painting, panel_painting, color_change, touch_up
      - `total_amount` (numeric)
      - `quotation_data` (jsonb)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create car_segments table
CREATE TABLE IF NOT EXISTS car_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  car_name text NOT NULL,
  car_year text NOT NULL,
  car_segment_id uuid REFERENCES car_segments(id) NOT NULL,
  license_plate text,
  customer_source text,
  created_at timestamptz DEFAULT now()
);

-- Create car_parts table
CREATE TABLE IF NOT EXISTS car_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  category text DEFAULT 'main',
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('required', 'optional')),
  created_at timestamptz DEFAULT now()
);

-- Create removable_parts table
CREATE TABLE IF NOT EXISTS removable_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_part_id uuid REFERENCES car_parts(id) NOT NULL,
  name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_segment_id uuid REFERENCES car_segments(id) NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('car_part', 'service', 'removable_part', 'panel_painting')),
  item_id uuid,
  price numeric(10,0) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(car_segment_id, item_type, item_id)
);

-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('spot_painting', 'panel_painting', 'color_change', 'touch_up')),
  total_amount numeric(12,0) NOT NULL DEFAULT 0,
  quotation_data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE car_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE removable_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on car_segments" ON car_segments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on car_parts" ON car_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on removable_parts" ON removable_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pricing" ON pricing FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);