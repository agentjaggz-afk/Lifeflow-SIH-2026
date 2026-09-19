import { BloodGroup, BloodUnit, BloodComponent } from '../types';
import { ngoStateService } from './ngoStateService';

export interface PresetBarcode {
  barcode: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  donorId: string;
  collectionCenter: string;
  storageLocation: string;
  description: string;
}

export const PRESET_BARCODES: PresetBarcode[] = [
  {
    barcode: 'BL-IND-0001842',
    bloodGroup: 'O+',
    component: 'Packed RBC',
    donorId: 'DNR-88291-MOHANTY',
    collectionCenter: 'LifeFlow Red Cross Camp - Master Canteen Square, Bhubaneswar',
    storageLocation: 'Refrigerator A / Rack 03',
    description: 'Universal Donor PRBC (450ml)'
  },
  {
    barcode: 'BL-IND-0009214',
    bloodGroup: 'O-',
    component: 'Whole Blood',
    donorId: 'DNR-91024-PATNAIK',
    collectionCenter: 'Mobile Blood Van - KIIT & Silicon Campus, Patia',
    storageLocation: 'Refrigerator B / Rack 01',
    description: 'Rare Universal Emergency Blood (350ml)'
  },
  {
    barcode: 'BL-IND-0003310',
    bloodGroup: 'A+',
    component: 'Platelets',
    donorId: 'DNR-33104-DAS',
    collectionCenter: 'Central Blood Bank Room 1 - SCB Medical College, Cuttack',
    storageLocation: 'Agitator Unit 01',
    description: 'Apheresis Single Donor Platelet Unit (250ml)'
  },
  {
    barcode: 'BL-IND-0004521',
    bloodGroup: 'B+',
    component: 'Packed RBC',
    donorId: 'DNR-45210-ROUT',
    collectionCenter: 'Utkal University Voluntary Blood Drive - Vani Vihar, Bhubaneswar',
    storageLocation: 'Refrigerator A / Rack 04',
    description: 'Screened B+ RBC (450ml)'
  },
  {
    barcode: 'BL-IND-0007823',
    bloodGroup: 'AB-',
    component: 'Fresh Frozen Plasma',
    donorId: 'DNR-78231-MOHAPATRA',
    collectionCenter: 'Odisha Red Cross Center - Sachivalaya Marg, Bhubaneswar',
    storageLocation: 'Cryo Vault / Rack 04',
    description: 'Ultra-rare AB- Cryo-preserved Plasma (200ml)'
  },
  {
    barcode: 'BL-IND-0006209',
    bloodGroup: 'B-',
    component: 'Packed RBC',
    donorId: 'DNR-62091-NAYAK',
    collectionCenter: 'Ravenshaw University Blood Drive - College Square, Cuttack',
    storageLocation: 'Refrigerator B / Rack 02',
    description: 'Critical Reserve B- Unit (450ml)'
  }
];

export class BarcodeService {
  /**
   * Validate barcode pattern (Supports ISBT-128 standard or BL-IND-XXXXXXX)
   */
  public static validateBarcode(code: string): { valid: boolean; reason?: string } {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { valid: false, reason: 'Barcode cannot be empty.' };
    }
    if (clean.length < 6) {
      return { valid: false, reason: 'Barcode length must be at least 6 characters.' };
    }
    // Match alphanumeric with hyphens or underscores
    const validChars = /^[A-Z0-9\-_]+$/;
    if (!validChars.test(clean)) {
      return { valid: false, reason: 'Barcode contains invalid characters. Use alphanumeric characters and hyphens.' };
    }
    return { valid: true };
  }

  /**
   * Check if unit with this barcode already exists in the system
   */
  public static checkDuplicate(barcode: string): boolean {
    const clean = barcode.trim().toUpperCase();
    const existing = ngoStateService.getBloodUnits();
    return existing.some((u) => u.id.trim().toUpperCase() === clean);
  }

  /**
   * Generate blood unit information based on scanned barcode and preset or random parameters
   */
  public static createBloodUnitFromBarcode(
    barcode: string,
    overrides?: Partial<BloodUnit>
  ): BloodUnit {
    const clean = barcode.trim().toUpperCase();
    const matchedPreset = PRESET_BARCODES.find((p) => p.barcode === clean);

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 42); // standard 42 days for PRBC

    const bloodGroup: BloodGroup = overrides?.bloodGroup || matchedPreset?.bloodGroup || 'O+';
    const component: BloodComponent = overrides?.component || matchedPreset?.component || 'Packed RBC';

    return {
      id: clean,
      bloodGroup,
      rhFactor: bloodGroup.endsWith('+') ? '+' : '-',
      component,
      collectionDate: overrides?.collectionDate || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: overrides?.expiryDate || expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      donorId: overrides?.donorId || matchedPreset?.donorId || `DNR-${Math.floor(10000 + Math.random() * 90000)}-VOL`,
      collectionCenter: overrides?.collectionCenter || matchedPreset?.collectionCenter || 'LifeFlow NGO Blood Donation Camp',
      storageLocation: overrides?.storageLocation || matchedPreset?.storageLocation || 'Refrigerator A / Rack 03',
      status: 'Available',
      volumeMl: component === 'Platelets' ? 250 : (component === 'Fresh Frozen Plasma' ? 200 : 450),
      lastUpdated: 'Just now',
      lifecycle: [
        {
          timestamp: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Collected at Donation Drive',
          performedBy: 'Phlebotomist / Clinical Staff',
          location: matchedPreset?.collectionCenter || 'Mobile Van'
        },
        {
          timestamp: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'NAT & Pathogen Screening Passed',
          performedBy: 'Blood Bank Pathologist',
          notes: 'Tested non-reactive for HBV, HCV, HIV 1 & 2, Syphilis and Malaria'
        }
      ]
    };
  }
}
