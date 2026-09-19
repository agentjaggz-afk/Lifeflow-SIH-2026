/*
# Blood Network Platform — Schema

## Overview
Creates the full data model for a blood donation network that connects hospitals, blood donation camps, donors, and receivers. This is a single-tenant app (no sign-in required), so all policies are open to anon + authenticated.

## New Tables

### hospitals
- `id` (uuid, PK)
- `name` (text, not null)
- `address` (text, not null)
- `city` (text, not null)
- `latitude` (numeric, nullable)
- `longitude` (numeric, nullable)
- `phone` (text, nullable)
- `created_at` (timestamptz, default now)

### blood_camps
- `id` (uuid, PK)
- `name` (text, not null)
- `address` (text, not null)
- `city` (text, not null)
- `latitude` (numeric, nullable)
- `longitude` (numeric, nullable)
- `date` (date, not null)
- `start_time` (text, not null)
- `end_time` (text, not null)
- `organizer` (text, nullable)
- `hospital_id` (uuid, FK -> hospitals, nullable)
- `created_at` (timestamptz, default now)

### blood_inventory
- `id` (uuid, PK)
- `hospital_id` (uuid, FK -> hospitals, not null)
- `blood_group` (text, not null) — one of A+, A-, B+, B-, AB+, AB-, O+, O-
- `component` (text, not null) — one of Whole Blood, Plasma, Platelets, RBC
- `units_available` (int, default 0)
- `units_needed` (int, default 0)
- `last_updated` (timestamptz, default now)

### donors
- `id` (uuid, PK)
- `name` (text, not null)
- `blood_group` (text, not null)
- `city` (text, not null)
- `phone` (text, not null)
- `email` (text, nullable)
- `latitude` (numeric, nullable)
- `longitude` (numeric, nullable)
- `is_available` (boolean, default true)
- `last_donated` (date, nullable)
- `hospital_id` (uuid, FK -> hospitals, nullable)
- `created_at` (timestamptz, default now)

### blood_requests
- `id` (uuid, PK)
- `patient_name` (text, not null)
- `blood_group` (text, not null)
- `units_needed` (int, not null)
- `city` (text, not null)
- `hospital_id` (uuid, FK -> hospitals, nullable)
- `requester_name` (text, not null)
- `requester_phone` (text, not null)
- `urgency` (text, not null) — one of Critical, Urgent, Normal
- `status` (text, default 'Open') — one of Open, Fulfilled, Cancelled
- `fulfilled_at` (timestamptz, nullable)
- `created_at` (timestamptz, default now)

## Security
- RLS enabled on every table.
- All tables allow anon + authenticated full CRUD because this is a public, no-auth application.
*/

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  latitude numeric,
  longitude numeric,
  phone text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hospitals" ON hospitals;
CREATE POLICY "anon_select_hospitals" ON hospitals FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hospitals" ON hospitals;
CREATE POLICY "anon_insert_hospitals" ON hospitals FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hospitals" ON hospitals;
CREATE POLICY "anon_update_hospitals" ON hospitals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hospitals" ON hospitals;
CREATE POLICY "anon_delete_hospitals" ON hospitals FOR DELETE
  TO anon, authenticated USING (true);

-- Blood camps
CREATE TABLE IF NOT EXISTS blood_camps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  latitude numeric,
  longitude numeric,
  date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  organizer text,
  hospital_id uuid REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blood_camps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blood_camps" ON blood_camps;
CREATE POLICY "anon_select_blood_camps" ON blood_camps FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_blood_camps" ON blood_camps;
CREATE POLICY "anon_insert_blood_camps" ON blood_camps FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_blood_camps" ON blood_camps;
CREATE POLICY "anon_update_blood_camps" ON blood_camps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_blood_camps" ON blood_camps;
CREATE POLICY "anon_delete_blood_camps" ON blood_camps FOR DELETE
  TO anon, authenticated USING (true);

-- Blood inventory
CREATE TABLE IF NOT EXISTS blood_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group text NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  component text NOT NULL CHECK (component IN ('Whole Blood','Plasma','Platelets','RBC')),
  units_available integer NOT NULL DEFAULT 0,
  units_needed integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blood_inventory" ON blood_inventory;
CREATE POLICY "anon_select_blood_inventory" ON blood_inventory FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_blood_inventory" ON blood_inventory;
CREATE POLICY "anon_insert_blood_inventory" ON blood_inventory FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_blood_inventory" ON blood_inventory;
CREATE POLICY "anon_update_blood_inventory" ON blood_inventory FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_blood_inventory" ON blood_inventory;
CREATE POLICY "anon_delete_blood_inventory" ON blood_inventory FOR DELETE
  TO anon, authenticated USING (true);

-- Donors
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  city text NOT NULL,
  phone text NOT NULL,
  email text,
  latitude numeric,
  longitude numeric,
  is_available boolean NOT NULL DEFAULT true,
  last_donated date,
  hospital_id uuid REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_donors" ON donors;
CREATE POLICY "anon_select_donors" ON donors FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_donors" ON donors;
CREATE POLICY "anon_insert_donors" ON donors FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_donors" ON donors;
CREATE POLICY "anon_update_donors" ON donors FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_donors" ON donors;
CREATE POLICY "anon_delete_donors" ON donors FOR DELETE
  TO anon, authenticated USING (true);

-- Blood requests
CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  units_needed integer NOT NULL,
  city text NOT NULL,
  hospital_id uuid REFERENCES hospitals(id) ON DELETE SET NULL,
  requester_name text NOT NULL,
  requester_phone text NOT NULL,
  urgency text NOT NULL CHECK (urgency IN ('Critical','Urgent','Normal')),
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Fulfilled','Cancelled')),
  fulfilled_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blood_requests" ON blood_requests;
CREATE POLICY "anon_select_blood_requests" ON blood_requests FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_blood_requests" ON blood_requests;
CREATE POLICY "anon_insert_blood_requests" ON blood_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_blood_requests" ON blood_requests;
CREATE POLICY "anon_update_blood_requests" ON blood_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_blood_requests" ON blood_requests;
CREATE POLICY "anon_delete_blood_requests" ON blood_requests FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hospitals_city ON hospitals(city);
CREATE INDEX IF NOT EXISTS idx_blood_camps_city ON blood_camps(city);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_hospital ON blood_inventory(hospital_id);
CREATE INDEX IF NOT EXISTS idx_donors_city ON donors(city);
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_city ON blood_requests(city);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
