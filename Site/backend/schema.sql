-- =====================================================
-- Hospital Blood Bank Management System: Relational Schema
-- Database: SQLite / PostgreSQL Compatible DDL
-- =====================================================

-- 1. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'Government / Super-Speciality',
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    emergency_hotline TEXT DEFAULT '+91 11 2658 8500',
    email TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    photo_url TEXT DEFAULT '',
    photo_data TEXT DEFAULT '',
    storage_facilities TEXT DEFAULT '["Walk-in Cold Room (2°C - 6°C)", "Platelet Agitator & Incubator (22°C)", "Deep Freezer -80°C (Cryopreservation)", "Component Separation Centrifuge"]',
    trauma_center_level TEXT DEFAULT 'Level 1 Apex Trauma Centre',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blood Donation NGOs Table
CREATE TABLE IF NOT EXISTS ngos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    accreditation_body TEXT DEFAULT 'National Blood Transfusion Council (NBTC)',
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    distance_km REAL NOT NULL,
    active_stock_units INTEGER DEFAULT 0,
    donor_capacity INTEGER DEFAULT 100,
    operating_hours TEXT DEFAULT '24/7 Emergency Dispatch',
    verified_status INTEGER DEFAULT 1, -- 1: Verified, 0: Pending/Suspended
    latitude REAL,
    longitude REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Blood Inventory Aggregate Table
-- Tracks current stock volume and dynamic threshold levels per blood group
CREATE TABLE IF NOT EXISTS blood_inventory (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    blood_group TEXT NOT NULL, -- A+, A-, B+, B-, AB+, AB-, O+, O-
    component TEXT NOT NULL,   -- Whole Blood, PRBC, FFP, Platelets
    units_available INTEGER NOT NULL DEFAULT 0,
    units_needed INTEGER NOT NULL DEFAULT 0,
    safe_min_threshold INTEGER DEFAULT 14,     -- Green: > 13
    warning_threshold INTEGER DEFAULT 6,       -- Yellow: > 6 and <= 13; Red: <= 6
    critical_shortage_limit INTEGER DEFAULT 5, -- Alert Banner Trigger: < 5
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, blood_group, component)
);

-- 4. Blood Units Table (Individual Bags with Secure QR Metadata)
CREATE TABLE IF NOT EXISTS blood_units (
    unit_id TEXT PRIMARY KEY,
    blood_group TEXT NOT NULL,
    component TEXT NOT NULL,
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    hospital_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Available', 'Quarantined', 'Reserved', 'Transfused', 'Expired')),
    volume_ml INTEGER DEFAULT 450,
    anticoagulant TEXT DEFAULT 'CPDA-1',
    serology_status TEXT DEFAULT 'Negative - Cleared',
    storage_temp_celsius REAL DEFAULT 4.0,
    qr_payload TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

-- 5. Hospital-NGO Licensing Partnership Table
CREATE TABLE IF NOT EXISTS hospital_ngo_connections (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    ngo_id TEXT NOT NULL,
    license_number TEXT NOT NULL,
    connection_status TEXT NOT NULL CHECK(connection_status IN ('Pending', 'Active', 'Verified', 'Revoked')) DEFAULT 'Active',
    partnership_type TEXT DEFAULT 'Emergency Blood Supply & Donor Mobilization',
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (ngo_id) REFERENCES ngos(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, ngo_id)
);

-- 6. Hospital-NGO Partnership Verification Requests Table (Formal Memorandum & Magic Link Flow)
CREATE TABLE IF NOT EXISTS partnership_requests (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    license_no TEXT NOT NULL,
    hospital_address TEXT NOT NULL,
    hospital_phone TEXT,
    contact_email TEXT NOT NULL,
    target_ngo_id TEXT NOT NULL,
    target_ngo_license TEXT NOT NULL,
    target_ngo_email TEXT NOT NULL,
    verification_token TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'ACCEPTED', 'ACTIVE_AFFILIATE', 'REJECTED', 'EXPIRED')) DEFAULT 'PENDING',
    verified_at TIMESTAMP,
    action_source TEXT CHECK(action_source IN ('EMAIL_MAGIC_LINK', 'DASHBOARD_DIRECT', NULL)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (target_ngo_id) REFERENCES ngos(id) ON DELETE CASCADE
);

-- 7. Hospital-to-Hospital Peer Connections Table
CREATE TABLE IF NOT EXISTS hospital_hospital_connections (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    peer_hospital_id TEXT NOT NULL,
    license_number TEXT NOT NULL,
    connection_status TEXT NOT NULL CHECK(connection_status IN ('Pending', 'Active', 'Verified', 'Revoked')),
    mutual_assistance_terms TEXT DEFAULT 'Emergency Inventory Sharing & Inter-Hospital Trauma Dispatch',
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (peer_hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, peer_hospital_id)
);

-- 8. Emergency SOS Blood Broadcasts & Immediate Acceptance Table (Atomic Claiming)
CREATE TABLE IF NOT EXISTS emergency_sos (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    units_required INTEGER NOT NULL,
    urgency_level TEXT NOT NULL DEFAULT 'CRITICAL_OT',
    patient_case_id TEXT,
    clinical_notes TEXT,
    status TEXT NOT NULL CHECK(status IN ('BROADCASTED', 'IN_TRANSIT', 'IN_DISPATCH', 'ACCEPTED', 'CANCELLED')) DEFAULT 'BROADCASTED',
    accepted_by_ngo_id TEXT,
    accepted_by_ngo_name TEXT,
    accepted_at TIMESTAMP,
    signed_sos_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    FOREIGN KEY (accepted_by_ngo_id) REFERENCES ngos(id) ON DELETE SET NULL
);

-- 9. Transactional Dispatched Emails Outbox Table (Audit & Verification)
CREATE TABLE IF NOT EXISTS dispatched_emails (
    id TEXT PRIMARY KEY,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    html_body TEXT NOT NULL,
    token TEXT,
    email_type TEXT NOT NULL CHECK(email_type IN ('PARTNERSHIP_MEMORANDUM', 'EMERGENCY_SOS_ALERT')),
    status TEXT NOT NULL DEFAULT 'DISPATCHED',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inv_hosp_group ON blood_inventory(hospital_id, blood_group);
CREATE INDEX IF NOT EXISTS idx_units_hosp_status ON blood_units(hospital_id, status);
CREATE INDEX IF NOT EXISTS idx_ngo_license ON ngos(license_number);
CREATE INDEX IF NOT EXISTS idx_hosp_license ON hospitals(license_number);
CREATE INDEX IF NOT EXISTS idx_partnership_status ON partnership_requests(status);
CREATE INDEX IF NOT EXISTS idx_partnership_token ON partnership_requests(verification_token);
CREATE INDEX IF NOT EXISTS idx_emergency_sos_status ON emergency_sos(status);
CREATE INDEX IF NOT EXISTS idx_dispatched_emails_type ON dispatched_emails(email_type);
