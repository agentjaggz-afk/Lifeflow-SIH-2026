import sqlite3

conn = sqlite3.connect('backend/lifeflow_bloodbank.db')
cur = conn.cursor()

# Check partnership_requests
row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='partnership_requests'").fetchone()
if row and 'ACTIVE_AFFILIATE' not in row[0]:
    print("Migrating partnership_requests table...")
    cur.execute("""
        CREATE TABLE partnership_requests_new (
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
        )
    """)
    cur.execute("INSERT INTO partnership_requests_new SELECT * FROM partnership_requests")
    cur.execute("DROP TABLE partnership_requests")
    cur.execute("ALTER TABLE partnership_requests_new RENAME TO partnership_requests")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_partnership_status ON partnership_requests(status)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_partnership_token ON partnership_requests(verification_token)")
    print("Migrated partnership_requests successfully!")

# Check emergency_sos
row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='emergency_sos'").fetchone()
if row and 'IN_DISPATCH' not in row[0]:
    print("Migrating emergency_sos table...")
    cur.execute("""
        CREATE TABLE emergency_sos_new (
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
        )
    """)
    cur.execute("INSERT INTO emergency_sos_new SELECT * FROM emergency_sos")
    cur.execute("DROP TABLE emergency_sos")
    cur.execute("ALTER TABLE emergency_sos_new RENAME TO emergency_sos")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_emergency_sos_status ON emergency_sos(status)")
    print("Migrated emergency_sos successfully!")

conn.commit()
conn.close()
print("Migration check complete.")
