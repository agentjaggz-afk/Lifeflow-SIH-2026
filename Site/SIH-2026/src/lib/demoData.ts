export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const BLOOD_COMPONENTS = [
  'Whole Blood', 'Plasma', 'Platelets', 'RBC'
] as const;

export type BloodComponent = (typeof BLOOD_COMPONENTS)[number];

export const URGENCY_LEVELS = [
  'Critical', 'Urgent', 'Normal'
] as const;

export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  created_at: string;
}

export interface BloodCamp {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  start_time: string;
  end_time: string;
  organizer: string | null;
  hospital_id: string | null;
  created_at: string;
}

export interface BloodInventory {
  id: string;
  hospital_id: string;
  blood_group: BloodGroup;
  component: BloodComponent;
  units_available: number;
  units_needed: number;
  last_updated: string;
}

export interface Donor {
  id: string;
  name: string;
  blood_group: BloodGroup;
  city: string;
  phone: string;
  email: string | null;
  latitude: number | null;
  longitude: number | null;
  is_available: boolean;
  last_donated: string | null;
  hospital_id: string | null;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: BloodGroup;
  units_needed: number;
  city: string;
  hospital_id: string | null;
  requester_name: string;
  requester_phone: string;
  urgency: UrgencyLevel;
  status: 'Open' | 'Fulfilled' | 'Cancelled';
  fulfilled_at: string | null;
  created_at: string;
}

export const demoHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'City Care Blood Centre & Hospital',
    address: 'Plot 12B, Saheed Nagar, Janpath Road',
    city: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    phone: '+91 674 254 8500',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h2',
    name: 'AIIMS Bhubaneswar Blood Centre',
    address: 'Sijua, Patrapada',
    city: 'Bhubaneswar',
    latitude: 20.2620,
    longitude: 85.7820,
    phone: '+91 674 247 6789',
    created_at: new Date().toISOString(),
  },
  {
    id: 'h3',
    name: 'SCB Medical College Blood Bank',
    address: 'Mangalabag',
    city: 'Cuttack',
    latitude: 20.4625,
    longitude: 85.8828,
    phone: '+91 671 241 4080',
    created_at: new Date().toISOString(),
  },
];

export const demoDonors: Donor[] = [
  {
    id: 'd1',
    name: 'Rahul Mohanty',
    blood_group: 'O+',
    city: 'Bhubaneswar',
    phone: '9876543210',
    email: 'rahul.mohanty@example.com',
    latitude: 20.2961,
    longitude: 85.8245,
    is_available: true,
    last_donated: null,
    hospital_id: 'h1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd2',
    name: 'Priyadarshini Rout',
    blood_group: 'A+',
    city: 'Bhubaneswar',
    phone: '9876543211',
    email: 'priya.rout@example.com',
    latitude: 20.2706,
    longitude: 85.8239,
    is_available: true,
    last_donated: null,
    hospital_id: 'h2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'd3',
    name: 'Arjun Das',
    blood_group: 'B+',
    city: 'Cuttack',
    phone: '9876543212',
    email: 'arjun.das@example.com',
    latitude: 20.4625,
    longitude: 85.8828,
    is_available: true,
    last_donated: null,
    hospital_id: 'h3',
    created_at: new Date().toISOString(),
  },
];

export const demoInventory: BloodInventory[] = [
  {
    id: 'i1',
    hospital_id: 'h1',
    blood_group: 'O+',
    component: 'Whole Blood',
    units_available: 12,
    units_needed: 8,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'i2',
    hospital_id: 'h1',
    blood_group: 'A+',
    component: 'Whole Blood',
    units_available: 7,
    units_needed: 10,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'i3',
    hospital_id: 'h2',
    blood_group: 'B+',
    component: 'Whole Blood',
    units_available: 5,
    units_needed: 6,
    last_updated: new Date().toISOString(),
  },
  {
    id: 'i4',
    hospital_id: 'h3',
    blood_group: 'AB+',
    component: 'Plasma',
    units_available: 9,
    units_needed: 4,
    last_updated: new Date().toISOString(),
  },
];

export const demoRequests: BloodRequest[] = [
  {
    id: 'r1',
    patient_name: 'Amit Patnaik',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Bhubaneswar',
    hospital_id: 'h1',
    requester_name: 'Neha Patnaik',
    requester_phone: '9876543220',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'r2',
    patient_name: 'Sneha Nayak',
    blood_group: 'A+',
    units_needed: 1,
    city: 'Cuttack',
    hospital_id: 'h2',
    requester_name: 'Vikram Nayak',
    requester_phone: '9876543221',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: new Date().toISOString(),
  },
];

export const demoCamps: BloodCamp[] = [
  {
    id: 'c1',
    name: 'Bhubaneswar Blood Donation Drive',
    address: 'Saheed Nagar Kalyan Mandap',
    city: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    date: '2026-09-22',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'LifeFlow & City Care',
    hospital_id: 'h1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    name: 'Twin City Emergency Blood Drive',
    address: 'Barabati Stadium Complex',
    city: 'Cuttack',
    latitude: 20.4810,
    longitude: 85.8680,
    date: '2026-09-25',
    start_time: '10:00',
    end_time: '15:00',
    organizer: 'LifeFlow & Red Cross Odisha',
    hospital_id: 'h2',
    created_at: new Date().toISOString(),
  },
];