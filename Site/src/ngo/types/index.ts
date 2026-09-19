export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const BLOOD_COMPONENTS = ['Whole Blood', 'Packed RBC', 'Fresh Frozen Plasma', 'Platelets', 'Cryoprecipitate'] as const;
export type BloodComponent = (typeof BLOOD_COMPONENTS)[number];

export type BloodUnitStatus = 
  | 'Available' 
  | 'Reserved' 
  | 'Dispatched' 
  | 'Delivered' 
  | 'Expired' 
  | 'Damaged' 
  | 'Quarantined';

export interface BloodUnitLifecycleEvent {
  timestamp: string;
  action: string;
  performedBy: string;
  location?: string;
  notes?: string;
}

export interface BloodUnit {
  id: string; // e.g. BL-IND-0001842
  bloodGroup: BloodGroup;
  rhFactor: '+' | '-';
  component: BloodComponent;
  collectionDate: string;
  expiryDate: string;
  donorId: string;
  collectionCenter: string;
  storageLocation: string; // e.g. Refrigerator A / Rack 03
  status: BloodUnitStatus;
  volumeMl: number;
  destinationHospital?: string;
  shipmentId?: string;
  lastUpdated: string;
  lifecycle: BloodUnitLifecycleEvent[];
}

export interface BloodInventoryItem {
  bloodGroup: BloodGroup;
  currentUnits: number;
  minThreshold: number;
  maxCapacity: number;
  lastUpdated: string;
  status: 'Healthy' | 'Approaching' | 'Critical';
}

export interface ConnectedHospital {
  id: string;
  name: string;
  location: string;
  city: string;
  distanceKm: number;
  contactPerson: string;
  phone: string;
  emergencyPhone: string;
  bloodRequirements: BloodGroup[];
  currentRequestStatus: 'Active' | 'None' | 'Pending';
  lastShipment: string;
  connectionStatus: 'Connected' | 'Pending' | 'Offline' | 'Emergency';
  coordinates: { lat: number; lng: number };
}

export type RequestPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type RequestStatus = 'Pending' | 'Accepted' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Rejected';

export interface HospitalRequest {
  id: string; // REQ-10492
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  requiredUnits: number;
  priority: RequestPriority;
  requiredBy: string; // e.g. "7:30 PM Today"
  location: string;
  contactPhone: string;
  status: RequestStatus;
  notes?: string;
  createdAt: string;
  urgencyReason?: string;
}

export type ShipmentStatus = 'Preparing' | 'Picked Up' | 'In Transit' | 'Arriving' | 'Delivered' | 'Cancelled';

export interface Shipment {
  id: string; // SHP-10492
  requestId?: string;
  hospitalId: string;
  hospitalName: string;
  destination: string;
  origin: string;
  bloodGroup: BloodGroup;
  units: number;
  unitIds: string[];
  courier: string;
  driverName: string;
  driverContact: string;
  vehicleNumber: string;
  estimatedArrival: string;
  distanceRemainingKm: number;
  currentLocationName: string;
  status: ShipmentStatus;
  routeProgress: number; // 0 - 100
  timeline: { time: string; status: string; note: string }[];
  createdAt: string;
}

export interface SosAlert {
  id: string;
  isActive: boolean;
  bloodGroup: BloodGroup;
  requiredUnits: number;
  availableUnits: number;
  shortageUnits: number;
  hospitalName: string;
  requiredBy: string;
  message: string;
  activatedAt: string;
  activatedBy: string;
  notifiedHospitals: number;
  notifiedNgos: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  bloodGroup?: BloodGroup;
  quantity?: number;
  user: string;
  details: string;
  type: 'add' | 'remove' | 'dispatch' | 'sos' | 'threshold' | 'system' | 'update';
}

export type NotificationCategory = 'Inventory' | 'Emergency' | 'Hospital Requests' | 'Shipments' | 'Expiry' | 'System';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actionLink?: string;
}

export interface NgoProfile {
  id: string;
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  adminName: string;
  verificationStatus: 'verified' | 'pending' | 'suspended';
  operatingHours: string;
  emergencyHotline: string;
  isEmergencyMode: boolean;
}

export interface NgoNetworkPeer {
  id: string;
  name: string;
  location: string;
  city: string;
  distanceKm: number;
  availableGroups: { group: BloodGroup; units: number; status: 'Healthy' | 'Approaching' | 'Critical' }[];
  contact: string;
  phone: string;
  lastSync: string;
  verified: boolean;
}

export type UserRole = 'Super Admin' | 'NGO Administrator' | 'Inventory Manager' | 'Dispatch Manager' | 'Staff';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  status: 'active' | 'inactive';
  lastActive: string;
}

export type ActiveNavPage = 
  | 'dashboard'
  | 'inventory'
  | 'blood-units'
  | 'scan'
  | 'hospitals'
  | 'requests'
  | 'shipments'
  | 'shipment-detail'
  | 'emergency'
  | 'analytics'
  | 'network'
  | 'notifications'
  | 'activity'
  | 'users'
  | 'settings'
  | 'login'
  | 'register';
