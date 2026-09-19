# Hospital Blood Bank Management System: Schemas & Data Models

## 1. Relational Database Schema (SQLite / PostgreSQL)

### 1.1 Blood Inventory Model (`blood_inventory`)
Stores stock levels and threshold configurations for each blood group.
```sql
CREATE TABLE blood_inventory (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    blood_group TEXT NOT NULL,          -- 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    component TEXT NOT NULL,            -- 'Whole Blood & PRBC', 'Platelets', 'FFP', etc.
    units_available INTEGER NOT NULL,
    units_needed INTEGER NOT NULL,
    safe_min_threshold INTEGER DEFAULT 14,     -- Green: > 13
    warning_threshold INTEGER DEFAULT 6,       -- Yellow: > 6 and <= 13; Red: <= 6
    critical_shortage_limit INTEGER DEFAULT 5, -- Severe Alert Trigger: < 5
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, blood_group, component)
);
```

### 1.2 Blood Units & QR Code Entity (`blood_units`)
Tracks individual blood bags with cryptographic checksum verification.
```sql
CREATE TABLE blood_units (
    unit_id TEXT PRIMARY KEY,           -- e.g. 'BB-2026-8812'
    blood_group TEXT NOT NULL,
    component TEXT NOT NULL,
    collection_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    hospital_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('Available', 'Quarantined', 'Reserved', 'Transfused', 'Expired')),
    volume_ml INTEGER DEFAULT 450,
    serology_status TEXT DEFAULT 'Negative - Cleared',
    qr_payload TEXT NOT NULL,          -- Serialized JSON metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);
```

### 1.3 NGO Accreditation Entity (`ngos`)
Maintains accredited blood-donation NGOs with active capacity and verified license credentials.
```sql
CREATE TABLE ngos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL, -- e.g. 'NGO-DL-8821'
    accreditation_body TEXT,            -- NBTC / SBTC
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    distance_km REAL NOT NULL,
    active_stock_units INTEGER DEFAULT 0,
    donor_capacity INTEGER DEFAULT 100,
    verified_status INTEGER DEFAULT 1,  -- 1: Verified, 0: Suspended
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.4 Hospital-NGO Licensing Connection (`hospital_ngo_connections`)
Maps institutional partnerships validated via license numbers.
```sql
CREATE TABLE hospital_ngo_connections (
    id TEXT PRIMARY KEY,
    hospital_id TEXT NOT NULL,
    ngo_id TEXT NOT NULL,
    license_number TEXT NOT NULL,
    connection_status TEXT CHECK(connection_status IN ('Pending', 'Active', 'Verified', 'Revoked')),
    partnership_type TEXT DEFAULT 'Emergency Blood Supply & Donor Mobilization',
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id),
    FOREIGN KEY (ngo_id) REFERENCES ngos(id),
    UNIQUE(hospital_id, ngo_id)
);
```

---

## 2. Dynamic Threshold Logic & Specifications

| Tier | Unit Volume Range | Color Indicator | Label | System Action |
| :--- | :--- | :--- | :--- | :--- |
| **Critical** | $\text{units} \le 6$ | **Red** (`#DC2626`) | Critical Alert | Immediate restocking required; highlighted on dashboard |
| **Moderate** | $6 < \text{units} \le 13$ | **Yellow** (`#D97706`) | Moderate Warning | Stock low/moderate; monitoring recommended |
| **Adequate** | $\text{units} > 13$ | **Green** (`#16A34A`) | Adequate Stock | Standard reserve volume maintained |
| **Severe Shortage** | $\text{units} < 5$ | **Red Flashing** | **CRITICAL SHORTAGE** | Triggers high-priority alert banner & audio/toast notification across hospital portal |

### JavaScript / TypeScript Implementation:
```typescript
export function getInventoryStatusColor(units: number) {
  if (units <= 6) {
    return { color: 'red', tier: 'critical', label: 'Critical Alert', badgeClass: 'badge-threshold-red' };
  } else if (units <= 13) {
    return { color: 'yellow', tier: 'moderate', label: 'Moderate Warning', badgeClass: 'badge-threshold-yellow' };
  } else {
    return { color: 'green', tier: 'adequate', label: 'Adequate Stock', badgeClass: 'badge-threshold-green' };
  }
}

export function isSevereShortage(units: number): boolean {
  return units < 5;
}
```

---

## 3. QR Code Metadata Payload Schema (ISBT-128 Aligned)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "BloodUnitQRMetadata",
  "type": "object",
  "properties": {
    "unitId": { "type": "string", "example": "BB-2026-8812" },
    "bloodGroup": { "type": "string", "enum": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Bombay Oh", "Rh-null"] },
    "collectionDate": { "type": "string", "format": "date", "example": "2026-09-08" },
    "expiryDate": { "type": "string", "format": "date", "example": "2026-10-20" },
    "hospitalId": { "type": "string", "example": "HOSP-001" },
    "status": { "type": "string", "enum": ["Available", "Quarantined", "Reserved", "Transfused", "Expired"] },
    "volumeMl": { "type": "integer", "default": 450 },
    "component": { "type": "string", "example": "Packed Red Blood Cells (PRBC)" },
    "checksum": { "type": "string", "description": "HMAC-SHA256 verification signature" }
  },
  "required": ["unitId", "bloodGroup", "collectionDate", "expiryDate", "hospitalId", "status"]
}
```
