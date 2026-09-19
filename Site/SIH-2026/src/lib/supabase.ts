import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://unzwgotcdxolifbvrsxa.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuendnb3RjZHhvbGlmYnZyc3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTk2NjMsImV4cCI6MjEwNDI3NTY2M30.yaCpZrQY8c-YK2b7O3UVBe1pZ_OQnIy6SuXZKQbrBag';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: { params: { eventsPerSecond: 10 } },
});

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const BLOOD_COMPONENTS = ['Whole Blood', 'Plasma', 'Platelets', 'RBC'] as const;
export type BloodComponent = (typeof BLOOD_COMPONENTS)[number];

export const URGENCY_LEVELS = ['Critical', 'Urgent', 'Normal'] as const;
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
