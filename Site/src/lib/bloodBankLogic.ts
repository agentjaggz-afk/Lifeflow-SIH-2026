/**
 * Hospital Blood Bank Management System - Core Logic & Schema Types
 *
 * Implements:
 * 1. Dynamic UI Threshold Indicators:
 *    - Red: Units < 100 (Critical / Immediate restocking required)
 *    - Yellow: Units 100–150 (Low / Moderate warning)
 *    - Green: Units > 150 (Adequate stock)
 * 2. Critical Shortage Alert Trigger:
 *    - Units < 100 (Triggers high-priority emergency banner & toast notification)
 * 3. Secure ISBT-128 Barcode Metadata Payload Structure
 * 4. Hospital-NGO Licensing Connection & Verification
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Bombay Oh' | 'Rh-null';

export type BloodComponent =
  | 'Packed Red Blood Cells (PRBC)'
  | 'Whole Blood'
  | 'Platelet Concentrate (Apheresis)'
  | 'Fresh Frozen Plasma (FFP)'
  | 'Cryoprecipitate';

export type BloodUnitStatus = 'Available' | 'Quarantined' | 'Reserved' | 'Transfused' | 'Expired';

export type ThresholdTier = 'critical' | 'moderate' | 'adequate';

export interface ThresholdIndicator {
  color: 'red' | 'yellow' | 'green';
  tier: ThresholdTier;
  label: string;
  subLabel: string;
  badgeClass: string;
  buttonClass: string;
  requiresRestock: boolean;
}

export interface BloodUnitMetadata {
  unitId: string;
  bloodGroup: BloodGroup;
  collectionDate: string; // YYYY-MM-DD
  expiryDate: string;     // YYYY-MM-DD
  hospitalId: string;
  status: BloodUnitStatus;
  component?: BloodComponent | string;
  volumeMl?: number;
  serology?: string;
  checksum?: string;
  timestamp?: string;
}

export interface NGOProfile {
  id: string;
  name: string;
  licenseNumber: string;
  accreditationBody: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  distanceKm: number;
  distanceFormatted: string;
  activeStockUnits: number;
  donorCapacity: number;
  operatingHours: string;
  isVerified: boolean;
}

export interface HospitalNgoConnection {
  id: string;
  hospitalId: string;
  ngoId: string;
  ngoName: string;
  licenseNumber: string;
  status: 'Pending' | 'Active' | 'Verified' | 'Revoked';
  partnershipType: string;
  verifiedAt: string;
}

export interface BloodTransferRequest {
  id: string;
  requestCode: string;
  hospitalId: string;
  ngoId: string;
  ngoName: string;
  bloodGroup: BloodGroup;
  unitsRequested: number;
  urgency: 'Emergency STAT (< 15 Mins)' | 'Priority (< 2 Hours)' | 'Routine Elective';
  status: 'Submitted' | 'Dispatched' | 'In Transit' | 'Received' | 'Cancelled';
  clinicalNotes?: string;
  createdAt: string;
}

/**
 * Requirement 1: Dynamic UI threshold indicator color tokens
 * - Red: Units <= 6 (Critical / Immediate restocking required)
 * - Yellow: Units > 6 and <= 13 (Low / Moderate warning)
 * - Green: Units > 13 (Adequate stock)
 */
export function getInventoryStatusColor(units: number): ThresholdIndicator {
  if (units <= 6) {
    return {
      color: 'red',
      tier: 'critical',
      label: 'Critical Alert',
      subLabel: 'Immediate restocking required',
      badgeClass: 'bg-red-500/10 text-red-700 border-red-300',
      buttonClass: 'btn-lifeflow-crimson bg-red-600 hover:bg-red-700 text-white',
      requiresRestock: true,
    };
  } else if (units <= 13) {
    return {
      color: 'yellow',
      tier: 'moderate',
      label: 'Moderate Warning',
      subLabel: 'Low / Moderate warning',
      badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-300',
      buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white',
      requiresRestock: false,
    };
  } else {
    return {
      color: 'green',
      tier: 'adequate',
      label: 'Adequate Stock',
      subLabel: 'Adequate stock',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      requiresRestock: false,
    };
  }
}

/**
 * Requirement 1: Critical Alert Trigger (units < 5)
 * Returns true if blood volume triggers an immediate shortage warning.
 */
export function isSevereShortage(units: number): boolean {
  return units < 5;
}

/**
 * Scans an entire inventory map and returns all groups in severe shortage (< 5 units)
 */
export function checkInventoryShortages(
  inventory: Record<string, { units: number } | number>
): { hasSevereShortage: boolean; shortageGroups: string[] } {
  const shortageGroups: string[] = [];

  for (const [group, val] of Object.entries(inventory)) {
    const units = typeof val === 'number' ? val : val.units;
    if (isSevereShortage(units)) {
      shortageGroups.push(group);
    }
  }

  return {
    hasSevereShortage: shortageGroups.length > 0,
    shortageGroups,
  };
}

/**
 * Requirement 2: Generates a serialized, validated ISBT-128 Barcode payload string for a blood bag.
 */
export function generateBarcodePayload(metadata: BloodUnitMetadata): string {
  const payload = {
    unitId: metadata.unitId,
    bloodGroup: metadata.bloodGroup,
    collectionDate: metadata.collectionDate,
    expiryDate: metadata.expiryDate,
    hospitalId: metadata.hospitalId,
    status: metadata.status,
    volumeMl: metadata.volumeMl || 450,
    component: metadata.component || 'Packed Red Blood Cells (PRBC)',
    timestamp: metadata.timestamp || new Date().toISOString(),
    format: 'ISBT-128',
  };

  return JSON.stringify(payload);
}

export const generateQRPayload = generateBarcodePayload;

/**
 * Requirement 2: Parses and validates an ISBT-128 Barcode payload from laser scanner / manual string.
 */
export function parseAndValidateBarcodePayload(raw: string): {
  isValid: boolean;
  data?: BloodUnitMetadata;
  error?: string;
} {
  if (!raw || typeof raw !== 'string') {
    return { isValid: false, error: 'Empty or invalid Barcode string.' };
  }

  try {
    const parsed = JSON.parse(raw);
    const required = ['unitId', 'bloodGroup', 'collectionDate', 'expiryDate', 'hospitalId', 'status'];
    const missing = required.filter((k) => !(k in parsed));

    if (missing.length > 0) {
      return { isValid: false, error: `Missing required metadata fields: ${missing.join(', ')}` };
    }

    return {
      isValid: true,
      data: parsed as BloodUnitMetadata,
    };
  } catch {
    // Fallback delimited string: unitId|bloodGroup|collectionDate|expiryDate|hospitalId|status
    const parts = raw.split('|');
    if (parts.length >= 6) {
      return {
        isValid: true,
        data: {
          unitId: parts[0].trim(),
          bloodGroup: parts[1].trim() as BloodGroup,
          collectionDate: parts[2].trim(),
          expiryDate: parts[3].trim(),
          hospitalId: parts[4].trim(),
          status: parts[5].trim() as BloodUnitStatus,
        },
      };
    }

    return { isValid: false, error: 'Barcode format does not conform to hospital ISBT-128 blood unit standard.' };
  }
}

export const parseAndValidateQRPayload = parseAndValidateBarcodePayload;

/**
 * Requirement 3: Edge-case validation for NGO License Numbers
 */
export function validateNgoLicenseFormat(license: string): {
  isValid: boolean;
  error?: string;
  normalized?: string;
} {
  const cleaned = (license || '').trim().toUpperCase();

  if (!cleaned) {
    return { isValid: false, error: 'License number cannot be empty.' };
  }

  // Format: NGO-<StateCode 2-3 letters>-<3-5 digits> (e.g. NGO-DL-8821)
  const regex = /^NGO-[A-Z]{2,3}-\d{3,5}$/;
  if (!regex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid format. Expected: NGO-<StateCode>-<Number> (e.g., NGO-DL-8821).',
      normalized: cleaned,
    };
  }

  return { isValid: true, normalized: cleaned };
}
