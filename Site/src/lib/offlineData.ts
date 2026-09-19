import {
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  type BloodGroup,
  type BloodComponent,
  type Hospital,
  type BloodCamp,
  type BloodInventory,
  type Donor,
  type BloodRequest,
} from './supabase';

export const OFFLINE_HOSPITALS: Hospital[] = [
  // 1. Bhubaneswar (5 hospitals)
  {
    id: 'hosp-bbsr-aiims',
    name: 'AIIMS Bhubaneswar',
    address: 'Sijua, Patia',
    city: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    phone: '0674-2476001',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bbsr-sum',
    name: 'SUM Hospital',
    address: 'Kalinga Nagar, Ghatikia',
    city: 'Bhubaneswar',
    latitude: 20.2760,
    longitude: 85.8450,
    phone: '0674-2380800',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bbsr-apollo',
    name: 'Apollo Hospitals Bhubaneswar',
    address: 'Plot No. 251, Sainik School Road, Unit 15',
    city: 'Bhubaneswar',
    latitude: 20.3082,
    longitude: 85.8340,
    phone: '0674-6661016',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bbsr-kims',
    name: 'KIMS Hospital',
    address: 'KIIT Campus 5, Patia',
    city: 'Bhubaneswar',
    latitude: 20.3540,
    longitude: 85.8180,
    phone: '0674-7105300',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bbsr-capital',
    name: 'Capital Hospital',
    address: 'Unit 6, Ganga Nagar',
    city: 'Bhubaneswar',
    latitude: 20.2642,
    longitude: 85.8174,
    phone: '0674-2391983',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 2. Cuttack (5 hospitals)
  {
    id: 'hosp-ctc-scb',
    name: 'SCB Medical College',
    address: 'Manglabag, Cuttack',
    city: 'Cuttack',
    latitude: 20.4625,
    longitude: 85.8828,
    phone: '0671-2303501',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-ctc-ashwini',
    name: 'Ashwini Hospital',
    address: 'Sector 1, CDA, Cuttack',
    city: 'Cuttack',
    latitude: 20.4850,
    longitude: 85.8420,
    phone: '0671-2363007',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-ctc-shanti',
    name: 'Shanti Memorial Hospital',
    address: 'Patpur, Jail Road, Cuttack',
    city: 'Cuttack',
    latitude: 20.4710,
    longitude: 85.8730,
    phone: '0671-2415124',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-ctc-city',
    name: 'City Hospital Cuttack',
    address: 'Dargah Bazar, Cuttack',
    city: 'Cuttack',
    latitude: 20.4600,
    longitude: 85.8650,
    phone: '0671-2512100',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-ctc-sadguru',
    name: 'Sadguru Medical Centre',
    address: 'Jagatsinghpur Road, Cuttack',
    city: 'Cuttack',
    latitude: 20.4500,
    longitude: 85.8900,
    phone: '0671-2321155',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 3. Berhampur (4 hospitals)
  {
    id: 'hosp-bam-mkcg',
    name: 'MKCG Medical College',
    address: 'Medical Campus, Ganjam, Berhampur',
    city: 'Berhampur',
    latitude: 19.3140,
    longitude: 84.7941,
    phone: '0680-2290037',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bam-city',
    name: 'City Hospital Berhampur',
    address: 'Old Bus Stand Road, Berhampur',
    city: 'Berhampur',
    latitude: 19.3120,
    longitude: 84.7890,
    phone: '0680-2220145',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bam-amit',
    name: 'Amit Hospital',
    address: 'Gandhi Nagar 3rd Line, Berhampur',
    city: 'Berhampur',
    latitude: 19.3210,
    longitude: 84.8010,
    phone: '0680-2204567',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-bam-christian',
    name: 'Christian Hospital Berhampur',
    address: 'Hillpatna, Berhampur',
    city: 'Berhampur',
    latitude: 19.3180,
    longitude: 84.7980,
    phone: '0680-2250234',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 4. Rourkela (4 hospitals)
  {
    id: 'hosp-rkl-igh',
    name: 'Ispat General Hospital (IGH)',
    address: 'Sector 19, Rourkela',
    city: 'Rourkela',
    latitude: 22.2570,
    longitude: 84.8620,
    phone: '0661-2646200',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-rkl-hitech',
    name: 'Hi-Tech Medical College & Hospital',
    address: 'Health Park, Panposh, Rourkela',
    city: 'Rourkela',
    latitude: 22.2350,
    longitude: 84.8210,
    phone: '0661-2400522',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-rkl-rgh',
    name: 'Rourkela Government Hospital (RGH)',
    address: 'Panposh Road, Udit Nagar, Rourkela',
    city: 'Rourkela',
    latitude: 22.2280,
    longitude: 84.8450,
    phone: '0661-2500120',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-rkl-shanti',
    name: 'Shanti Memorial Hospital Rourkela',
    address: 'Near Old Taxi Stand, Udit Nagar, Rourkela',
    city: 'Rourkela',
    latitude: 22.2240,
    longitude: 84.8510,
    phone: '0661-2510345',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 5. Sambalpur (4 hospitals)
  {
    id: 'hosp-sbp-vimsar',
    name: 'VIMSAR Burla',
    address: 'Medical Road, Burla, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.5030,
    longitude: 83.8740,
    phone: '0663-2430768',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-sbp-dhh',
    name: 'District Headquarters Hospital Sambalpur',
    address: 'Modipara, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4670,
    longitude: 83.9780,
    phone: '0663-2400102',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-sbp-sanjivani',
    name: 'Sanjivani Hospital Sambalpur',
    address: 'Dhanupali Road, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4550,
    longitude: 83.9920,
    phone: '0663-2541800',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-sbp-ashoka',
    name: 'Ashoka Hospital',
    address: 'Budharaja, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4790,
    longitude: 83.9850,
    phone: '0663-2533200',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 6. Puri (4 hospitals)
  {
    id: 'hosp-puri-dhh',
    name: 'District Headquarters Hospital Puri',
    address: 'Grand Road, Balagandi, Puri',
    city: 'Puri',
    latitude: 19.8080,
    longitude: 85.8260,
    phone: '06752-222044',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-puri-e24',
    name: 'E24 Hospital Puri',
    address: 'Atharanala, Puri Bypass, Puri',
    city: 'Puri',
    latitude: 19.8220,
    longitude: 85.8340,
    phone: '06752-255100',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-puri-jagannath',
    name: 'Jagannath Hospital Puri',
    address: 'VIP Road, Police Line, Puri',
    city: 'Puri',
    latitude: 19.8150,
    longitude: 85.8410,
    phone: '06752-230550',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-puri-mch',
    name: 'Mother & Child Health Centre Puri',
    address: 'Badasankha, Puri',
    city: 'Puri',
    latitude: 19.8120,
    longitude: 85.8290,
    phone: '06752-224890',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 7. Kolkata (4 hospitals)
  {
    id: 'hosp-kol-sskm',
    name: 'SSKM Hospital (IPGMER)',
    address: '1, AJC Bose Road, Bhowanipore, Kolkata',
    city: 'Kolkata',
    latitude: 22.5380,
    longitude: 88.3440,
    phone: '033-22231589',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-kol-apollo',
    name: 'Apollo Multispeciality Hospitals Kolkata',
    address: '58, Canal Circular Road, Kadapara, Kolkata',
    city: 'Kolkata',
    latitude: 22.5690,
    longitude: 88.3970,
    phone: '033-23203040',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-kol-fortis',
    name: 'Fortis Hospital Anandapur',
    address: '730, Anandapur, E.M. Bypass Road, Kolkata',
    city: 'Kolkata',
    latitude: 22.5180,
    longitude: 88.4020,
    phone: '033-66284444',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-kol-cmc',
    name: 'Calcutta Medical College & Hospital',
    address: '88, College Street, Bowbazar, Kolkata',
    city: 'Kolkata',
    latitude: 22.5740,
    longitude: 88.3610,
    phone: '033-22551600',
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 8. Delhi (4 hospitals)
  {
    id: 'hosp-del-aiims',
    name: 'AIIMS New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    city: 'Delhi',
    latitude: 28.5672,
    longitude: 77.2100,
    phone: '011-26588500',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-del-safdarjung',
    name: 'Safdarjung Hospital',
    address: 'Ansari Nagar West, Ring Road, New Delhi',
    city: 'Delhi',
    latitude: 28.5700,
    longitude: 77.2080,
    phone: '011-26165060',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-del-max',
    name: 'Max Super Speciality Hospital Saket',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    city: 'Delhi',
    latitude: 28.5270,
    longitude: 77.2130,
    phone: '011-26515050',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'hosp-del-fortis',
    name: 'Fortis Memorial Hospital Vasant Kunj',
    address: 'Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj, New Delhi',
    city: 'Delhi',
    latitude: 28.5290,
    longitude: 77.1510,
    phone: '011-42776222',
    created_at: '2026-09-01T00:00:00.000Z',
  },
];

// Map of hospital name (lowercase) to Hospital object for quick linkage
const hospitalByName = new Map<string, Hospital>();
OFFLINE_HOSPITALS.forEach((h) => {
  hospitalByName.set(h.name.toLowerCase(), h);
  hospitalByName.set(h.id.toLowerCase(), h);
});

// Deterministic inventory generation matching seed_hospitals.cjs
function calculateInventory(hospital: Hospital): BloodInventory[] {
  const inv: BloodInventory[] = [];
  for (const group of BLOOD_GROUPS) {
    for (const component of BLOOD_COMPONENTS) {
      const seed = (hospital.name.length * 37 + group.charCodeAt(0) * 17 + component.length * 11) % 100;
      let baseAvail = 10;

      // Green (> 150 total units across 5 components): O+, A+, B+ (3 blood groups)
      if (group === 'O+') {
        baseAvail = 34 + (seed % 4);
      } else if (group === 'A+') {
        baseAvail = 32 + (seed % 3);
      } else if (group === 'B+') {
        baseAvail = 31 + (seed % 3);
      }
      // Yellow (100–150 total units across 5 components): A-, B-, AB+ (3 blood groups)
      else if (group === 'A-') {
        baseAvail = 24 + (seed % 3);
      } else if (group === 'B-') {
        baseAvail = 22 + (seed % 3);
      } else if (group === 'AB+') {
        baseAvail = 26 + (seed % 3);
      }
      // Red (< 100 total units across 5 components): O-, AB- (2 blood groups)
      else if (group === 'O-') {
        baseAvail = 8 + (seed % 3);
      } else if (group === 'AB-') {
        baseAvail = 5 + (seed % 3);
      }

      const units_available = Math.max(0, baseAvail);
      const units_needed = Math.max(0, Math.floor((seed % 10) - 4));

      inv.push({
        id: `inv-${hospital.id}-${group}-${component.replace(/\s+/g, '')}`,
        hospital_id: hospital.id,
        blood_group: group,
        component: component,
        units_available,
        units_needed,
        last_updated: '2026-09-12T00:00:00.000Z',
      });
    }
  }
  return inv;
}

export const OFFLINE_INVENTORY: BloodInventory[] = OFFLINE_HOSPITALS.flatMap((h) => calculateInventory(h));

// 32 Authentic Donation Camps across all 8 regions
export const OFFLINE_CAMPS: (BloodCamp & { hospital?: Hospital })[] = [
  // 1. Bhubaneswar (4 camps)
  {
    id: 'camp-bbsr-1',
    name: 'Red Cross Mega Blood Drive',
    address: 'KIIT Convention Center, Patia',
    city: 'Bhubaneswar',
    latitude: 20.3540,
    longitude: 85.8180,
    date: '2026-09-16',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Indian Red Cross Society, Odisha',
    hospital_id: 'hosp-bbsr-kims',
    hospital: hospitalByName.get('kims hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bbsr-2',
    name: 'Youth For Life Donation Camp',
    address: 'Utkal University Campus, Vani Vihar',
    city: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    date: '2026-09-22',
    start_time: '10:00',
    end_time: '17:00',
    organizer: 'Rotaract Club of Bhubaneswar',
    hospital_id: 'hosp-bbsr-aiims',
    hospital: hospitalByName.get('aiims bhubaneswar'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bbsr-3',
    name: 'Corporate Blood Drive - Infocity',
    address: 'DLF Cybercity, Patia',
    city: 'Bhubaneswar',
    latitude: 20.2760,
    longitude: 85.8450,
    date: '2026-09-28',
    start_time: '09:30',
    end_time: '15:30',
    organizer: 'IT Employees Welfare Association',
    hospital_id: 'hosp-bbsr-sum',
    hospital: hospitalByName.get('sum hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bbsr-4',
    name: 'Janata Maidan Community Blood Camp',
    address: 'Janata Maidan, Chandrasekharpur',
    city: 'Bhubaneswar',
    latitude: 20.2642,
    longitude: 85.8174,
    date: '2026-10-05',
    start_time: '08:30',
    end_time: '14:00',
    organizer: 'Lions Club Bhubaneswar',
    hospital_id: 'hosp-bbsr-capital',
    hospital: hospitalByName.get('capital hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 2. Cuttack (4 camps)
  {
    id: 'camp-ctc-1',
    name: 'Silver City Annual Blood Drive',
    address: 'Barabati Stadium Complex, Buxi Bazar',
    city: 'Cuttack',
    latitude: 20.4625,
    longitude: 85.8828,
    date: '2026-09-17',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Cuttack Citizen Forum',
    hospital_id: 'hosp-ctc-scb',
    hospital: hospitalByName.get('scb medical college'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-ctc-2',
    name: 'Ravenshaw University Voluntary Camp',
    address: 'Ravenshaw Ground, College Square',
    city: 'Cuttack',
    latitude: 20.4850,
    longitude: 85.8420,
    date: '2026-09-24',
    start_time: '10:00',
    end_time: '15:30',
    organizer: 'Ravenshaw NSS Unit',
    hospital_id: 'hosp-ctc-ashwini',
    hospital: hospitalByName.get('ashwini hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-ctc-3',
    name: 'Mahanadi Community Blood Collection',
    address: 'Chahata Ghat Community Hall',
    city: 'Cuttack',
    latitude: 20.4710,
    longitude: 85.8730,
    date: '2026-10-02',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Red Ribbon Club Cuttack',
    hospital_id: 'hosp-ctc-shanti',
    hospital: hospitalByName.get('shanti memorial hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-ctc-4',
    name: 'Millennium City Blood Drive',
    address: 'Choudwar Community Centre',
    city: 'Cuttack',
    latitude: 20.4600,
    longitude: 85.8650,
    date: '2026-10-10',
    start_time: '09:30',
    end_time: '15:00',
    organizer: 'Marwari Yuva Manch Cuttack',
    hospital_id: 'hosp-ctc-city',
    hospital: hospitalByName.get('city hospital cuttack'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 3. Berhampur (4 camps)
  {
    id: 'camp-bam-1',
    name: 'Silk City Voluntary Blood Camp',
    address: 'Town Hall, Gandhi Nagar',
    city: 'Berhampur',
    latitude: 19.3140,
    longitude: 84.7941,
    date: '2026-09-18',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Ganjam Youth Association',
    hospital_id: 'hosp-bam-mkcg',
    hospital: hospitalByName.get('mkcg medical college'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bam-2',
    name: 'Khallikote University Blood Drive',
    address: 'Khallikote Unitary Campus',
    city: 'Berhampur',
    latitude: 19.3120,
    longitude: 84.7890,
    date: '2026-09-25',
    start_time: '09:30',
    end_time: '16:00',
    organizer: 'Khallikote Red Cross Wing',
    hospital_id: 'hosp-bam-city',
    hospital: hospitalByName.get('city hospital berhampur'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bam-3',
    name: 'Gopalpur Beach Road Blood Camp',
    address: 'Marine Drive Community Center',
    city: 'Berhampur',
    latitude: 19.3210,
    longitude: 84.8010,
    date: '2026-10-03',
    start_time: '08:30',
    end_time: '13:30',
    organizer: 'Rotary Club of Berhampur',
    hospital_id: 'hosp-bam-amit',
    hospital: hospitalByName.get('amit hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-bam-4',
    name: 'Brahmapur Rotary Blood Express',
    address: 'Giri Market Hall',
    city: 'Berhampur',
    latitude: 19.3180,
    longitude: 84.7980,
    date: '2026-10-12',
    start_time: '10:00',
    end_time: '16:00',
    organizer: 'Lions Club of Silk City',
    hospital_id: 'hosp-bam-christian',
    hospital: hospitalByName.get('christian hospital berhampur'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 4. Rourkela (4 camps)
  {
    id: 'camp-rkl-1',
    name: 'Steel City Lifesavers Camp',
    address: 'Civic Centre, Sector 19',
    city: 'Rourkela',
    latitude: 22.2570,
    longitude: 84.8620,
    date: '2026-09-19',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'SAIL Rourkela Steel Plant',
    hospital_id: 'hosp-rkl-igh',
    hospital: hospitalByName.get('ispat general hospital (igh)'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-rkl-2',
    name: 'NIT Rourkela Annual Blood Drive',
    address: 'Student Activity Centre (SAC), NIT Rourkela',
    city: 'Rourkela',
    latitude: 22.2350,
    longitude: 84.8210,
    date: '2026-09-26',
    start_time: '09:30',
    end_time: '17:00',
    organizer: 'Rotaract Club NIT Rourkela',
    hospital_id: 'hosp-rkl-hitech',
    hospital: hospitalByName.get('hi-tech medical college & hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-rkl-3',
    name: 'Koel Nagar Community Blood Camp',
    address: 'Community Hall, Koel Nagar',
    city: 'Rourkela',
    latitude: 22.2280,
    longitude: 84.8450,
    date: '2026-10-04',
    start_time: '08:30',
    end_time: '14:00',
    organizer: 'Rourkela Blood Donors Club',
    hospital_id: 'hosp-rkl-rgh',
    hospital: hospitalByName.get('rourkela government hospital (rgh)'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-rkl-4',
    name: 'Panposh Voluntary Donation Drive',
    address: 'Biju Patnaik Hockey Stadium Annex',
    city: 'Rourkela',
    latitude: 22.2240,
    longitude: 84.8510,
    date: '2026-10-14',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Red Cross Rourkela',
    hospital_id: 'hosp-rkl-shanti',
    hospital: hospitalByName.get('shanti memorial hospital rourkela'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 5. Sambalpur (4 camps)
  {
    id: 'camp-sbp-1',
    name: 'Hirakud Reservoir Blood Drive',
    address: 'Town Hall, Modipara',
    city: 'Sambalpur',
    latitude: 21.4670,
    longitude: 83.9780,
    date: '2026-09-20',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Sambalpur Citizens Council',
    hospital_id: 'hosp-sbp-dhh',
    hospital: hospitalByName.get('district headquarters hospital sambalpur'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-sbp-2',
    name: 'VSSUT Burla Lifeline Camp',
    address: 'VSSUT Campus, Burla',
    city: 'Sambalpur',
    latitude: 21.5030,
    longitude: 83.8740,
    date: '2026-09-27',
    start_time: '10:00',
    end_time: '16:30',
    organizer: 'NSS VSSUT Burla',
    hospital_id: 'hosp-sbp-vimsar',
    hospital: hospitalByName.get('vimsar burla'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-sbp-3',
    name: 'Dhanupali Community Blood Drive',
    address: 'Kalyan Mandap, Dhanupali',
    city: 'Sambalpur',
    latitude: 21.4550,
    longitude: 83.9920,
    date: '2026-10-06',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Sambalpur Youth Forum',
    hospital_id: 'hosp-sbp-sanjivani',
    hospital: hospitalByName.get('sanjivani hospital sambalpur'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-sbp-4',
    name: 'Maa Samaleswari Charitable Camp',
    address: 'Samaleswari Temple Complex Hall',
    city: 'Sambalpur',
    latitude: 21.4790,
    longitude: 83.9850,
    date: '2026-10-15',
    start_time: '08:30',
    end_time: '14:30',
    organizer: 'Samaleswari Trust & Blood Bank',
    hospital_id: 'hosp-sbp-ashoka',
    hospital: hospitalByName.get('ashoka hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 6. Puri (4 camps)
  {
    id: 'camp-puri-1',
    name: 'Shree Jagannath Seva Blood Camp',
    address: 'Town Hall, Grand Road',
    city: 'Puri',
    latitude: 19.8080,
    longitude: 85.8260,
    date: '2026-09-19',
    start_time: '08:30',
    end_time: '15:00',
    organizer: 'Puri Sevayat Welfare Association',
    hospital_id: 'hosp-puri-dhh',
    hospital: hospitalByName.get('district headquarters hospital puri'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-puri-2',
    name: 'Golden Beach Lifesavers Drive',
    address: 'Blue Flag Beach Promenade',
    city: 'Puri',
    latitude: 19.8220,
    longitude: 85.8340,
    date: '2026-09-27',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Puri Eco-Tourism & Red Cross',
    hospital_id: 'hosp-puri-e24',
    hospital: hospitalByName.get('e24 hospital puri'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-puri-3',
    name: 'Atharanala Pilgrims Blood Drive',
    address: 'Atharanala Toll Community Hall',
    city: 'Puri',
    latitude: 19.8150,
    longitude: 85.8410,
    date: '2026-10-05',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Lions Club of Puri',
    hospital_id: 'hosp-puri-jagannath',
    hospital: hospitalByName.get('jagannath hospital puri'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-puri-4',
    name: 'SCS College Youth Blood Drive',
    address: 'Samanta Chandra Sekhar College Campus',
    city: 'Puri',
    latitude: 19.8120,
    longitude: 85.8290,
    date: '2026-10-13',
    start_time: '10:00',
    end_time: '15:30',
    organizer: 'SCS College Red Ribbon Club',
    hospital_id: 'hosp-puri-mch',
    hospital: hospitalByName.get('mother & child health centre puri'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 7. Kolkata (4 camps)
  {
    id: 'camp-kol-1',
    name: 'Park Street Community Blood Drive',
    address: 'Rotary Sadan, Park Street',
    city: 'Kolkata',
    latitude: 22.5380,
    longitude: 88.3440,
    date: '2026-09-18',
    start_time: '09:30',
    end_time: '16:30',
    organizer: 'Rotary Club of Calcutta',
    hospital_id: 'hosp-kol-sskm',
    hospital: hospitalByName.get('sskm hospital (ipgmer)'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-kol-2',
    name: 'Salt Lake Sector V Tech Blood Camp',
    address: 'Saltlake IT Park Complex, Sector V',
    city: 'Kolkata',
    latitude: 22.5690,
    longitude: 88.3970,
    date: '2026-09-25',
    start_time: '09:00',
    end_time: '17:00',
    organizer: 'Bengal IT Associates',
    hospital_id: 'hosp-kol-apollo',
    hospital: hospitalByName.get('apollo multispeciality hospitals kolkata'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-kol-3',
    name: 'Howrah Bridge City Blood Drive',
    address: 'Rabindra Sadan Cultural Center',
    city: 'Kolkata',
    latitude: 22.5740,
    longitude: 88.3610,
    date: '2026-10-02',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Kolkata Voluntary Blood Donors Forum',
    hospital_id: 'hosp-kol-cmc',
    hospital: hospitalByName.get('calcutta medical college & hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-kol-4',
    name: 'South Kolkata Lifesavers Camp',
    address: 'Jadavpur University Campus',
    city: 'Kolkata',
    latitude: 22.5180,
    longitude: 88.4020,
    date: '2026-10-11',
    start_time: '10:00',
    end_time: '16:00',
    organizer: 'JU Student Welfare Board',
    hospital_id: 'hosp-kol-fortis',
    hospital: hospitalByName.get('fortis hospital anandapur'),
    created_at: '2026-09-01T00:00:00.000Z',
  },

  // 8. Delhi (4 camps)
  {
    id: 'camp-del-1',
    name: 'Connaught Place Mega Blood Drive',
    address: 'Central Park, Connaught Place',
    city: 'Delhi',
    latitude: 28.5672,
    longitude: 77.2100,
    date: '2026-09-20',
    start_time: '09:00',
    end_time: '17:00',
    organizer: 'Delhi Red Cross Mission',
    hospital_id: 'hosp-del-aiims',
    hospital: hospitalByName.get('aiims new delhi'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-del-2',
    name: 'Delhi University North Campus Camp',
    address: 'Faculty of Arts Auditorium, DU',
    city: 'Delhi',
    latitude: 28.5700,
    longitude: 77.2080,
    date: '2026-09-26',
    start_time: '09:30',
    end_time: '16:00',
    organizer: 'DU Student Union & Rotary Club',
    hospital_id: 'hosp-del-safdarjung',
    hospital: hospitalByName.get('safdarjung hospital'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-del-3',
    name: 'South Extension Community Blood Camp',
    address: 'NDMC Community Hall, South Ext 1',
    city: 'Delhi',
    latitude: 28.5270,
    longitude: 77.2130,
    date: '2026-10-03',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Lions Club Delhi Central',
    hospital_id: 'hosp-del-max',
    hospital: hospitalByName.get('max super speciality hospital saket'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'camp-del-4',
    name: 'Dwarka City Blood Donation Express',
    address: 'Sector 10 Community Center, Dwarka',
    city: 'Delhi',
    latitude: 28.5290,
    longitude: 77.1510,
    date: '2026-10-12',
    start_time: '09:00',
    end_time: '15:30',
    organizer: 'Dwarka Residents Welfare Federation',
    hospital_id: 'hosp-del-fortis',
    hospital: hospitalByName.get('fortis memorial hospital vasant kunj'),
    created_at: '2026-09-01T00:00:00.000Z',
  },
];

// 32 Authentic Donors across all 8 regions
export const OFFLINE_DONORS: Donor[] = [
  // 1. Bhubaneswar (4 donors)
  {
    id: 'donor-bbsr-1',
    name: 'Dr. Debasish Patnaik',
    blood_group: 'O+',
    city: 'Bhubaneswar',
    phone: '+91 94370 12345',
    email: 'debasish.patnaik@example.com',
    latitude: 20.2961,
    longitude: 85.8245,
    is_available: true,
    last_donated: '2026-05-10',
    hospital_id: null,
    created_at: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'donor-bbsr-2',
    name: 'Priyanka Senapati',
    blood_group: 'A+',
    city: 'Bhubaneswar',
    phone: '+91 98610 88776',
    email: 'priyanka.s@example.com',
    latitude: 20.3082,
    longitude: 85.8340,
    is_available: true,
    last_donated: '2026-06-22',
    hospital_id: null,
    created_at: '2026-09-02T11:30:00.000Z',
  },
  {
    id: 'donor-bbsr-3',
    name: 'Ashutosh Tripathy',
    blood_group: 'B-',
    city: 'Bhubaneswar',
    phone: '+91 70081 44552',
    email: 'ashu.trip@example.com',
    latitude: 20.3540,
    longitude: 85.8180,
    is_available: true,
    last_donated: '2026-04-18',
    hospital_id: null,
    created_at: '2026-09-03T09:15:00.000Z',
  },
  {
    id: 'donor-bbsr-4',
    name: 'Smrutirekha Mohanty',
    blood_group: 'AB+',
    city: 'Bhubaneswar',
    phone: '+91 82490 33211',
    email: 'smruti.m@example.com',
    latitude: 20.2760,
    longitude: 85.8450,
    is_available: true,
    last_donated: '2026-08-15',
    hospital_id: null,
    created_at: '2026-09-04T14:20:00.000Z',
  },

  // 2. Cuttack (4 donors)
  {
    id: 'donor-ctc-1',
    name: 'Bishnu Charan Sahoo',
    blood_group: 'B+',
    city: 'Cuttack',
    phone: '+91 94372 65432',
    email: 'bishnu.sahoo@example.com',
    latitude: 20.4625,
    longitude: 85.8828,
    is_available: true,
    last_donated: '2026-05-30',
    hospital_id: null,
    created_at: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'donor-ctc-2',
    name: 'Lipsa Routray',
    blood_group: 'O-',
    city: 'Cuttack',
    phone: '+91 97760 99881',
    email: 'lipsa.r@example.com',
    latitude: 20.4850,
    longitude: 85.8420,
    is_available: true,
    last_donated: '2026-06-05',
    hospital_id: null,
    created_at: '2026-09-02T13:45:00.000Z',
  },
  {
    id: 'donor-ctc-3',
    name: 'Tapan Kumar Das',
    blood_group: 'A+',
    city: 'Cuttack',
    phone: '+91 78942 11223',
    email: 'tapan.das@example.com',
    latitude: 20.4710,
    longitude: 85.8730,
    is_available: true,
    last_donated: '2026-03-20',
    hospital_id: null,
    created_at: '2026-09-03T16:10:00.000Z',
  },
  {
    id: 'donor-ctc-4',
    name: 'Satyabrata Pradhan',
    blood_group: 'AB-',
    city: 'Cuttack',
    phone: '+91 99371 45678',
    email: 'satyabrata.p@example.com',
    latitude: 20.4600,
    longitude: 85.8650,
    is_available: true,
    last_donated: '2026-07-12',
    hospital_id: null,
    created_at: '2026-09-04T12:00:00.000Z',
  },

  // 3. Berhampur (4 donors)
  {
    id: 'donor-bam-1',
    name: 'K. Raghunath Reddy',
    blood_group: 'O+',
    city: 'Berhampur',
    phone: '+91 94380 55667',
    email: 'raghunath.reddy@example.com',
    latitude: 19.3140,
    longitude: 84.7941,
    is_available: true,
    last_donated: '2026-06-01',
    hospital_id: null,
    created_at: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'donor-bam-2',
    name: 'Sunita Padhy',
    blood_group: 'B+',
    city: 'Berhampur',
    phone: '+91 88950 12456',
    email: 'sunita.padhy@example.com',
    latitude: 19.3120,
    longitude: 84.7890,
    is_available: true,
    last_donated: '2026-07-04',
    hospital_id: null,
    created_at: '2026-09-02T10:30:00.000Z',
  },
  {
    id: 'donor-bam-3',
    name: 'B. Manoj Kumar',
    blood_group: 'A-',
    city: 'Berhampur',
    phone: '+91 91240 77889',
    email: 'manoj.kumar@example.com',
    latitude: 19.3210,
    longitude: 84.8010,
    is_available: true,
    last_donated: '2026-04-25',
    hospital_id: null,
    created_at: '2026-09-03T15:00:00.000Z',
  },
  {
    id: 'donor-bam-4',
    name: 'Gitanjali Muni',
    blood_group: 'AB+',
    city: 'Berhampur',
    phone: '+91 96920 33445',
    email: 'gitanjali.m@example.com',
    latitude: 19.3180,
    longitude: 84.7980,
    is_available: true,
    last_donated: '2026-08-20',
    hospital_id: null,
    created_at: '2026-09-04T17:15:00.000Z',
  },

  // 4. Rourkela (4 donors)
  {
    id: 'donor-rkl-1',
    name: 'Amitabh Mukherjee',
    blood_group: 'A+',
    city: 'Rourkela',
    phone: '+91 94371 88990',
    email: 'amitabh.m@example.com',
    latitude: 22.2570,
    longitude: 84.8620,
    is_available: true,
    last_donated: '2026-05-18',
    hospital_id: null,
    created_at: '2026-09-01T11:00:00.000Z',
  },
  {
    id: 'donor-rkl-2',
    name: 'Suman Minz',
    blood_group: 'O+',
    city: 'Rourkela',
    phone: '+91 98612 33441',
    email: 'suman.minz@example.com',
    latitude: 22.2350,
    longitude: 84.8210,
    is_available: true,
    last_donated: '2026-06-19',
    hospital_id: null,
    created_at: '2026-09-02T14:10:00.000Z',
  },
  {
    id: 'donor-rkl-3',
    name: 'Rajat Kispotta',
    blood_group: 'B+',
    city: 'Rourkela',
    phone: '+91 79780 22334',
    email: 'rajat.k@example.com',
    latitude: 22.2280,
    longitude: 84.8450,
    is_available: true,
    last_donated: '2026-04-12',
    hospital_id: null,
    created_at: '2026-09-03T16:30:00.000Z',
  },
  {
    id: 'donor-rkl-4',
    name: 'Neelam Swarnakar',
    blood_group: 'AB-',
    city: 'Rourkela',
    phone: '+91 88955 66778',
    email: 'neelam.s@example.com',
    latitude: 22.2240,
    longitude: 84.8510,
    is_available: true,
    last_donated: '2026-07-28',
    hospital_id: null,
    created_at: '2026-09-04T11:20:00.000Z',
  },

  // 5. Sambalpur (4 donors)
  {
    id: 'donor-sbp-1',
    name: 'Pradeep Meher',
    blood_group: 'B+',
    city: 'Sambalpur',
    phone: '+91 94373 44556',
    email: 'pradeep.meher@example.com',
    latitude: 21.4670,
    longitude: 83.9780,
    is_available: true,
    last_donated: '2026-05-24',
    hospital_id: null,
    created_at: '2026-09-01T08:30:00.000Z',
  },
  {
    id: 'donor-sbp-2',
    name: 'Swagatika Barik',
    blood_group: 'O-',
    city: 'Sambalpur',
    phone: '+91 99372 77881',
    email: 'swagatika.b@example.com',
    latitude: 21.5030,
    longitude: 83.8740,
    is_available: true,
    last_donated: '2026-06-11',
    hospital_id: null,
    created_at: '2026-09-02T09:40:00.000Z',
  },
  {
    id: 'donor-sbp-3',
    name: 'Dharmendra Gartia',
    blood_group: 'A+',
    city: 'Sambalpur',
    phone: '+91 78941 66554',
    email: 'dharmendra.g@example.com',
    latitude: 21.4550,
    longitude: 83.9920,
    is_available: true,
    last_donated: '2026-04-05',
    hospital_id: null,
    created_at: '2026-09-03T13:25:00.000Z',
  },
  {
    id: 'donor-sbp-4',
    name: 'Mamata Bishi',
    blood_group: 'AB+',
    city: 'Sambalpur',
    phone: '+91 82492 11990',
    email: 'mamata.bishi@example.com',
    latitude: 21.4790,
    longitude: 83.9850,
    is_available: true,
    last_donated: '2026-07-15',
    hospital_id: null,
    created_at: '2026-09-04T15:50:00.000Z',
  },

  // 6. Puri (4 donors)
  {
    id: 'donor-puri-1',
    name: 'Damodar Mohapatra',
    blood_group: 'O+',
    city: 'Puri',
    phone: '+91 94374 88221',
    email: 'damodar.m@example.com',
    latitude: 19.8080,
    longitude: 85.8260,
    is_available: true,
    last_donated: '2026-05-15',
    hospital_id: null,
    created_at: '2026-09-01T07:45:00.000Z',
  },
  {
    id: 'donor-puri-2',
    name: 'Subhadra Gochikar',
    blood_group: 'B+',
    city: 'Puri',
    phone: '+91 98615 44332',
    email: 'subhadra.g@example.com',
    latitude: 19.8220,
    longitude: 85.8340,
    is_available: true,
    last_donated: '2026-06-25',
    hospital_id: null,
    created_at: '2026-09-02T12:00:00.000Z',
  },
  {
    id: 'donor-puri-3',
    name: 'Jagannath Khuntia',
    blood_group: 'A+',
    city: 'Puri',
    phone: '+91 70083 99112',
    email: 'jagannath.k@example.com',
    latitude: 19.8150,
    longitude: 85.8410,
    is_available: true,
    last_donated: '2026-04-30',
    hospital_id: null,
    created_at: '2026-09-03T14:35:00.000Z',
  },
  {
    id: 'donor-puri-4',
    name: 'Anusaya Mishra',
    blood_group: 'A-',
    city: 'Puri',
    phone: '+91 97762 55443',
    email: 'anusaya.m@example.com',
    latitude: 19.8120,
    longitude: 85.8290,
    is_available: true,
    last_donated: '2026-08-10',
    hospital_id: null,
    created_at: '2026-09-04T16:15:00.000Z',
  },

  // 7. Kolkata (4 donors)
  {
    id: 'donor-kol-1',
    name: 'Sourav Banerjee',
    blood_group: 'B+',
    city: 'Kolkata',
    phone: '+91 98300 12345',
    email: 'sourav.banerjee@example.com',
    latitude: 22.5380,
    longitude: 88.3440,
    is_available: true,
    last_donated: '2026-05-20',
    hospital_id: null,
    created_at: '2026-09-01T10:15:00.000Z',
  },
  {
    id: 'donor-kol-2',
    name: 'Ananya Chatterjee',
    blood_group: 'O+',
    city: 'Kolkata',
    phone: '+91 98311 98765',
    email: 'ananya.c@example.com',
    latitude: 22.5690,
    longitude: 88.3970,
    is_available: true,
    last_donated: '2026-06-18',
    hospital_id: null,
    created_at: '2026-09-02T11:45:00.000Z',
  },
  {
    id: 'donor-kol-3',
    name: 'Subir Chakraborty',
    blood_group: 'AB+',
    city: 'Kolkata',
    phone: '+91 94330 45678',
    email: 'subir.c@example.com',
    latitude: 22.5740,
    longitude: 88.3610,
    is_available: true,
    last_donated: '2026-04-10',
    hospital_id: null,
    created_at: '2026-09-03T15:30:00.000Z',
  },
  {
    id: 'donor-kol-4',
    name: 'Deblina Ghosh',
    blood_group: 'A-',
    city: 'Kolkata',
    phone: '+91 89102 33445',
    email: 'deblina.ghosh@example.com',
    latitude: 22.5180,
    longitude: 88.4020,
    is_available: true,
    last_donated: '2026-07-22',
    hospital_id: null,
    created_at: '2026-09-04T18:00:00.000Z',
  },

  // 8. Delhi (4 donors)
  {
    id: 'donor-del-1',
    name: 'Vikramaditya Sharma',
    blood_group: 'O+',
    city: 'Delhi',
    phone: '+91 98110 55443',
    email: 'vikram.sharma@example.com',
    latitude: 28.5672,
    longitude: 77.2100,
    is_available: true,
    last_donated: '2026-05-28',
    hospital_id: null,
    created_at: '2026-09-01T09:20:00.000Z',
  },
  {
    id: 'donor-del-2',
    name: 'Jaspreet Kaur',
    blood_group: 'B+',
    city: 'Delhi',
    phone: '+91 98101 22334',
    email: 'jaspreet.kaur@example.com',
    latitude: 28.5700,
    longitude: 77.2080,
    is_available: true,
    last_donated: '2026-06-30',
    hospital_id: null,
    created_at: '2026-09-02T13:10:00.000Z',
  },
  {
    id: 'donor-del-3',
    name: 'Mohammad Arshad',
    blood_group: 'A+',
    city: 'Delhi',
    phone: '+91 98712 66778',
    email: 'm.arshad@example.com',
    latitude: 28.5270,
    longitude: 77.2130,
    is_available: true,
    last_donated: '2026-04-15',
    hospital_id: null,
    created_at: '2026-09-03T14:40:00.000Z',
  },
  {
    id: 'donor-del-4',
    name: 'Ritu Aggarwal',
    blood_group: 'O-',
    city: 'Delhi',
    phone: '+91 99100 88991',
    email: 'ritu.aggarwal@example.com',
    latitude: 28.5290,
    longitude: 77.1510,
    is_available: true,
    last_donated: '2026-07-08',
    hospital_id: null,
    created_at: '2026-09-04T17:05:00.000Z',
  },
];

// Helper to generate recent ISO time
function getRecentTime(minsAgo: number): string {
  return new Date(Date.now() - minsAgo * 60 * 1000).toISOString();
}

// 32 Authentic Blood Requests across all 8 regions
export const OFFLINE_REQUESTS: (BloodRequest & { hospital?: Hospital })[] = [
  // 1. Bhubaneswar (4 requests)
  {
    id: 'req-bbsr-1',
    patient_name: 'Bimalendu Mohanty',
    blood_group: 'O+',
    units_needed: 3,
    city: 'Bhubaneswar',
    hospital_id: 'hosp-bbsr-aiims',
    hospital: hospitalByName.get('aiims bhubaneswar'),
    requester_name: 'Sasmita Mohanty',
    requester_phone: '+91 94370 66778',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(25),
  },
  {
    id: 'req-bbsr-2',
    patient_name: 'Sunita Das (Cardiac Surgery)',
    blood_group: 'A-',
    units_needed: 2,
    city: 'Bhubaneswar',
    hospital_id: 'hosp-bbsr-apollo',
    hospital: hospitalByName.get('apollo hospitals bhubaneswar'),
    requester_name: 'Dr. R. K. Behera',
    requester_phone: '+91 98610 33221',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(75),
  },
  {
    id: 'req-bbsr-3',
    patient_name: 'Master Ayush Pradhan',
    blood_group: 'B+',
    units_needed: 2,
    city: 'Bhubaneswar',
    hospital_id: 'hosp-bbsr-kims',
    hospital: hospitalByName.get('kims hospital'),
    requester_name: 'Narayan Pradhan',
    requester_phone: '+91 70081 99002',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(210),
  },
  {
    id: 'req-bbsr-4',
    patient_name: 'Geetanjali Mishra',
    blood_group: 'AB+',
    units_needed: 1,
    city: 'Bhubaneswar',
    hospital_id: 'hosp-bbsr-sum',
    hospital: hospitalByName.get('sum hospital'),
    requester_name: 'Alok Mishra',
    requester_phone: '+91 82490 55441',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(480),
  },

  // 2. Cuttack (4 requests)
  {
    id: 'req-ctc-1',
    patient_name: 'Prabhakar Jena (Trauma ICU)',
    blood_group: 'B-',
    units_needed: 4,
    city: 'Cuttack',
    hospital_id: 'hosp-ctc-scb',
    hospital: hospitalByName.get('scb medical college'),
    requester_name: 'Gourahari Jena',
    requester_phone: '+91 94372 11223',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(35),
  },
  {
    id: 'req-ctc-2',
    patient_name: 'Kalyani Sahoo',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Cuttack',
    hospital_id: 'hosp-ctc-ashwini',
    hospital: hospitalByName.get('ashwini hospital'),
    requester_name: 'Niranjan Sahoo',
    requester_phone: '+91 97760 44556',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(110),
  },
  {
    id: 'req-ctc-3',
    patient_name: 'Subrat Nayak',
    blood_group: 'A+',
    units_needed: 2,
    city: 'Cuttack',
    hospital_id: 'hosp-ctc-shanti',
    hospital: hospitalByName.get('shanti memorial hospital'),
    requester_name: 'Minati Nayak',
    requester_phone: '+91 78942 88990',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(320),
  },
  {
    id: 'req-ctc-4',
    patient_name: 'Rabindra Samal',
    blood_group: 'O-',
    units_needed: 3,
    city: 'Cuttack',
    hospital_id: 'hosp-ctc-city',
    hospital: hospitalByName.get('city hospital cuttack'),
    requester_name: 'Debendra Samal',
    requester_phone: '+91 99371 66778',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(600),
  },

  // 3. Berhampur (4 requests)
  {
    id: 'req-bam-1',
    patient_name: 'K. Laxmi Bai (Maternity)',
    blood_group: 'A+',
    units_needed: 2,
    city: 'Berhampur',
    hospital_id: 'hosp-bam-mkcg',
    hospital: hospitalByName.get('mkcg medical college'),
    requester_name: 'K. Appa Rao',
    requester_phone: '+91 94380 99887',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(45),
  },
  {
    id: 'req-bam-2',
    patient_name: 'Dillip Kumar Patro',
    blood_group: 'B+',
    units_needed: 2,
    city: 'Berhampur',
    hospital_id: 'hosp-bam-city',
    hospital: hospitalByName.get('city hospital berhampur'),
    requester_name: 'Chandan Patro',
    requester_phone: '+91 88950 33445',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(140),
  },
  {
    id: 'req-bam-3',
    patient_name: 'M. Santoshi',
    blood_group: 'O+',
    units_needed: 1,
    city: 'Berhampur',
    hospital_id: 'hosp-bam-amit',
    hospital: hospitalByName.get('amit hospital'),
    requester_name: 'M. Krishna',
    requester_phone: '+91 91240 55667',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(380),
  },
  {
    id: 'req-bam-4',
    patient_name: 'B. Mohan Das',
    blood_group: 'AB-',
    units_needed: 2,
    city: 'Berhampur',
    hospital_id: 'hosp-bam-christian',
    hospital: hospitalByName.get('christian hospital berhampur'),
    requester_name: 'B. Sitaram',
    requester_phone: '+91 96920 11224',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(720),
  },

  // 4. Rourkela (4 requests)
  {
    id: 'req-rkl-1',
    patient_name: 'Gopal Chandra Das (Industrial Acc.)',
    blood_group: 'O-',
    units_needed: 4,
    city: 'Rourkela',
    hospital_id: 'hosp-rkl-igh',
    hospital: hospitalByName.get('ispat general hospital (igh)'),
    requester_name: 'Suresh Das',
    requester_phone: '+91 94371 44332',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(20),
  },
  {
    id: 'req-rkl-2',
    patient_name: 'Sunita Tirkey',
    blood_group: 'B+',
    units_needed: 2,
    city: 'Rourkela',
    hospital_id: 'hosp-rkl-hitech',
    hospital: hospitalByName.get('hi-tech medical college & hospital'),
    requester_name: 'Prakash Tirkey',
    requester_phone: '+91 98612 88991',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(90),
  },
  {
    id: 'req-rkl-3',
    patient_name: 'Md. Farooq',
    blood_group: 'A+',
    units_needed: 2,
    city: 'Rourkela',
    hospital_id: 'hosp-rkl-rgh',
    hospital: hospitalByName.get('rourkela government hospital (rgh)'),
    requester_name: 'Md. Imran',
    requester_phone: '+91 79780 11223',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(260),
  },
  {
    id: 'req-rkl-4',
    patient_name: 'Kavita Agarwal',
    blood_group: 'AB+',
    units_needed: 1,
    city: 'Rourkela',
    hospital_id: 'hosp-rkl-shanti',
    hospital: hospitalByName.get('shanti memorial hospital rourkela'),
    requester_name: 'Mukesh Agarwal',
    requester_phone: '+91 88955 44556',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(540),
  },

  // 5. Sambalpur (4 requests)
  {
    id: 'req-sbp-1',
    patient_name: 'Jayanti Padhan (Nephrology)',
    blood_group: 'B+',
    units_needed: 3,
    city: 'Sambalpur',
    hospital_id: 'hosp-sbp-vimsar',
    hospital: hospitalByName.get('vimsar burla'),
    requester_name: 'Bibhuti Padhan',
    requester_phone: '+91 94373 88990',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(50),
  },
  {
    id: 'req-sbp-2',
    patient_name: 'Umesh Chandra Sahu',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Sambalpur',
    hospital_id: 'hosp-sbp-dhh',
    hospital: hospitalByName.get('district headquarters hospital sambalpur'),
    requester_name: 'Hemant Sahu',
    requester_phone: '+91 99372 11225',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(160),
  },
  {
    id: 'req-sbp-3',
    patient_name: 'Sarojini Bhoi',
    blood_group: 'A-',
    units_needed: 2,
    city: 'Sambalpur',
    hospital_id: 'hosp-sbp-sanjivani',
    hospital: hospitalByName.get('sanjivani hospital sambalpur'),
    requester_name: 'Bhuban Bhoi',
    requester_phone: '+91 78941 33442',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(390),
  },
  {
    id: 'req-sbp-4',
    patient_name: 'Ranjan Kalo',
    blood_group: 'AB+',
    units_needed: 2,
    city: 'Sambalpur',
    hospital_id: 'hosp-sbp-ashoka',
    hospital: hospitalByName.get('ashoka hospital'),
    requester_name: 'Tribikram Kalo',
    requester_phone: '+91 82492 77889',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(690),
  },

  // 6. Puri (4 requests)
  {
    id: 'req-puri-1',
    patient_name: 'Gouranga Chandra Das',
    blood_group: 'A+',
    units_needed: 3,
    city: 'Puri',
    hospital_id: 'hosp-puri-dhh',
    hospital: hospitalByName.get('district headquarters hospital puri'),
    requester_name: 'Dhaneswar Das',
    requester_phone: '+91 94374 22334',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(30),
  },
  {
    id: 'req-puri-2',
    patient_name: 'Manjulata Pradhan',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Puri',
    hospital_id: 'hosp-puri-e24',
    hospital: hospitalByName.get('e24 hospital puri'),
    requester_name: 'Rabi Narayan Pradhan',
    requester_phone: '+91 98615 77889',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(120),
  },
  {
    id: 'req-puri-3',
    patient_name: 'Balaram Khuntia',
    blood_group: 'B-',
    units_needed: 2,
    city: 'Puri',
    hospital_id: 'hosp-puri-jagannath',
    hospital: hospitalByName.get('jagannath hospital puri'),
    requester_name: 'Sridhar Khuntia',
    requester_phone: '+91 70083 44556',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(310),
  },
  {
    id: 'req-puri-4',
    patient_name: 'Kishore Chandra Panda',
    blood_group: 'O-',
    units_needed: 2,
    city: 'Puri',
    hospital_id: 'hosp-puri-mch',
    hospital: hospitalByName.get('mother & child health centre puri'),
    requester_name: 'Bhabani Panda',
    requester_phone: '+91 97762 11990',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(580),
  },

  // 7. Kolkata (4 requests)
  {
    id: 'req-kol-1',
    patient_name: 'Subhash Chandra Bose',
    blood_group: 'O+',
    units_needed: 3,
    city: 'Kolkata',
    hospital_id: 'hosp-kol-sskm',
    hospital: hospitalByName.get('sskm hospital (ipgmer)'),
    requester_name: 'Anirban Bose',
    requester_phone: '+91 98300 44556',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(15),
  },
  {
    id: 'req-kol-2',
    patient_name: 'Maitreyi Ganguly (Oncology)',
    blood_group: 'B+',
    units_needed: 2,
    city: 'Kolkata',
    hospital_id: 'hosp-kol-apollo',
    hospital: hospitalByName.get('apollo multispeciality hospitals kolkata'),
    requester_name: 'Tanmay Ganguly',
    requester_phone: '+91 98311 22334',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(85),
  },
  {
    id: 'req-kol-3',
    patient_name: 'Rahul Roy Chowdhury',
    blood_group: 'A-',
    units_needed: 2,
    city: 'Kolkata',
    hospital_id: 'hosp-kol-fortis',
    hospital: hospitalByName.get('fortis hospital anandapur'),
    requester_name: 'Soma Roy Chowdhury',
    requester_phone: '+91 94330 99881',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(240),
  },
  {
    id: 'req-kol-4',
    patient_name: 'Pranab Kumar Sen',
    blood_group: 'AB+',
    units_needed: 2,
    city: 'Kolkata',
    hospital_id: 'hosp-kol-cmc',
    hospital: hospitalByName.get('calcutta medical college & hospital'),
    requester_name: 'Indranil Sen',
    requester_phone: '+91 89102 66778',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(510),
  },

  // 8. Delhi (4 requests)
  {
    id: 'req-del-1',
    patient_name: 'Harpreet Singh (Orthopedic Surgery)',
    blood_group: 'B+',
    units_needed: 3,
    city: 'Delhi',
    hospital_id: 'hosp-del-aiims',
    hospital: hospitalByName.get('aiims new delhi'),
    requester_name: 'Gurmeet Singh',
    requester_phone: '+91 98110 88990',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(25),
  },
  {
    id: 'req-del-2',
    patient_name: 'Aarti Verma',
    blood_group: 'O+',
    units_needed: 2,
    city: 'Delhi',
    hospital_id: 'hosp-del-safdarjung',
    hospital: hospitalByName.get('safdarjung hospital'),
    requester_name: 'Rajesh Verma',
    requester_phone: '+91 98101 55667',
    urgency: 'Urgent',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(105),
  },
  {
    id: 'req-del-3',
    patient_name: 'Deepak Chopra',
    blood_group: 'O-',
    units_needed: 3,
    city: 'Delhi',
    hospital_id: 'hosp-del-max',
    hospital: hospitalByName.get('max super speciality hospital saket'),
    requester_name: 'Sanjay Chopra',
    requester_phone: '+91 98712 11223',
    urgency: 'Critical',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(280),
  },
  {
    id: 'req-del-4',
    patient_name: 'Meena Kumari',
    blood_group: 'A+',
    units_needed: 1,
    city: 'Delhi',
    hospital_id: 'hosp-del-fortis',
    hospital: hospitalByName.get('fortis memorial hospital vasant kunj'),
    requester_name: 'Ramesh Kumar',
    requester_phone: '+91 99100 44556',
    urgency: 'Normal',
    status: 'Open',
    fulfilled_at: null,
    created_at: getRecentTime(620),
  },
];

/* =========================================================================
   LOCAL STORAGE PERSISTENCE & QUERY UTILITIES (100% Offline & Instant)
   ========================================================================= */

const LOCAL_STORAGE_DONORS_KEY = 'lifeflow_offline_donors_v1';
const LOCAL_STORAGE_REQUESTS_KEY = 'lifeflow_offline_requests_v1';
const LOCAL_STORAGE_DELETED_DONORS_KEY = 'lifeflow_offline_deleted_donors_v1';
const LOCAL_STORAGE_DELETED_REQUESTS_KEY = 'lifeflow_offline_deleted_requests_v1';

function getStoredDonors(): Donor[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DONORS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredDonors(donors: Donor[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DONORS_KEY, JSON.stringify(donors));
  } catch (err) {
    console.error('Failed to save donor to local storage', err);
  }
}

function getDeletedDonorIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_DONORS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedDonorId(id: string) {
  try {
    const set = getDeletedDonorIds();
    set.add(id);
    localStorage.setItem(LOCAL_STORAGE_DELETED_DONORS_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('Failed to save deleted donor', err);
  }
}

function getStoredRequests(): (BloodRequest & { hospital?: Hospital })[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredRequests(requests: (BloodRequest & { hospital?: Hospital })[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save request to local storage', err);
  }
}

function getDeletedRequestIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_REQUESTS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedRequestId(id: string) {
  try {
    const set = getDeletedRequestIds();
    set.add(id);
    localStorage.setItem(LOCAL_STORAGE_DELETED_REQUESTS_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('Failed to save deleted request', err);
  }
}

/**
 * Filter hospitals by city.
 * If city is provided, does a case-insensitive substring match.
 */
export function getOfflineHospitals(city?: string): Hospital[] {
  if (!city || !city.trim()) {
    return OFFLINE_HOSPITALS;
  }
  const cleanCity = city.trim().toLowerCase();
  const matched = OFFLINE_HOSPITALS.filter(
    (h) => h.city.toLowerCase() === cleanCity || h.city.toLowerCase().includes(cleanCity) || cleanCity.includes(h.city.toLowerCase())
  );
  return matched.length > 0 ? matched : OFFLINE_HOSPITALS.slice(0, 5);
}

/**
 * Find hospital by id.
 */
export function getOfflineHospitalById(id: string): Hospital | undefined {
  return OFFLINE_HOSPITALS.find((h) => h.id === id);
}

/**
 * Get inventory filtered by hospital IDs.
 */
export function getOfflineInventory(hospitalIds?: string[]): BloodInventory[] {
  if (!hospitalIds || hospitalIds.length === 0) {
    return OFFLINE_INVENTORY;
  }
  const idSet = new Set(hospitalIds);
  return OFFLINE_INVENTORY.filter((inv) => idSet.has(inv.hospital_id));
}

/**
 * Check if a donor is manual demo data.
 */
export function isManualDonor(id: string): boolean {
  if (id.startsWith('donor-user-')) return true;
  const stored = getStoredDonors();
  return stored.some((d) => d.id === id);
}

/**
 * Delete an offline donor by ID.
 */
export function deleteOfflineDonor(id: string): boolean {
  const stored = getStoredDonors();
  const updated = stored.filter((d) => d.id !== id);
  saveStoredDonors(updated);
  saveDeletedDonorId(id);
  return true;
}

/**
 * Clear all manually added demo donors.
 */
export function clearAllManualDonors(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_DONORS_KEY);
  } catch (err) {
    console.error('Failed to clear manual donors', err);
  }
}

/**
 * Get donors for a city (including user-registered donors persisted locally).
 */
export function getOfflineDonors(city?: string): Donor[] {
  const customDonors = getStoredDonors();
  const deletedIds = getDeletedDonorIds();
  const activeSeed = OFFLINE_DONORS.filter((d) => !deletedIds.has(d.id));
  const activeCustom = customDonors.filter((d) => !deletedIds.has(d.id));

  if (!city || !city.trim()) {
    return [...activeCustom, ...activeSeed];
  }
  const cleanCity = city.trim().toLowerCase();

  const matchedSeed = activeSeed.filter(
    (d) => d.city.toLowerCase() === cleanCity || d.city.toLowerCase().includes(cleanCity) || cleanCity.includes(d.city.toLowerCase())
  );
  const baseSeed = matchedSeed.length > 0 ? matchedSeed : activeSeed.slice(0, 4);

  const matchedCustom = activeCustom.filter(
    (d) =>
      !d.city ||
      d.city.toLowerCase() === cleanCity ||
      d.city.toLowerCase().includes(cleanCity) ||
      cleanCity.includes(d.city.toLowerCase()) ||
      isManualDonor(d.id)
  );

  const combined = [...matchedCustom];
  const customIds = new Set(combined.map((d) => d.id));
  for (const s of baseSeed) {
    if (!customIds.has(s.id)) {
      combined.push(s);
    }
  }
  return combined;
}

/**
 * Utility: Strips any non-digits, trims leading country/trunk codes (+91, 91, 0),
 * and caps at strictly 10 digits for mobile numbers.
 */
export function cleanIndianPhoneInput(val: string): string {
  if (!val) return '';
  let digits = val.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/**
 * Validates whether the given string is a valid 10-digit mobile number.
 * Mobile numbers must be exactly 10 digits and start with 6, 7, 8, or 9.
 */
export function validateIndianPhoneNumber(phone: string): string | null {
  const digits = cleanIndianPhoneInput(phone);
  if (!digits) {
    return 'Phone number is required.';
  }
  if (digits.length < 10) {
    return `Phone number must be exactly 10 digits (currently ${digits.length}).`;
  }
  if (!/^[6-9]/.test(digits)) {
    return 'Mobile number must start with 6, 7, 8, or 9.';
  }
  return null;
}

/**
 * Format 10 digits into standardized mobile display: '+91 XXXXX XXXXX'.
 */
export function formatIndianPhoneForSave(phone: string): string {
  const digits = cleanIndianPhoneInput(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone.trim();
}

/**
 * Add a new donor locally to localStorage.
 */
export function addOfflineDonor(data: {
  name: string;
  blood_group: BloodGroup;
  city: string;
  phone: string;
  email: string | null;
  is_available?: boolean;
}): Donor {
  const formattedPhone = formatIndianPhoneForSave(data.phone);
  const newDonor: Donor = {
    id: `donor-user-${Date.now()}`,
    name: data.name,
    blood_group: data.blood_group,
    city: data.city,
    phone: formattedPhone,
    email: data.email,
    latitude: null,
    longitude: null,
    is_available: data.is_available ?? true,
    last_donated: new Date().toISOString().split('T')[0],
    hospital_id: null,
    created_at: new Date().toISOString(),
  };

  const stored = getStoredDonors();
  stored.unshift(newDonor);
  saveStoredDonors(stored);
  return newDonor;
}

/**
 * Check if a blood request is manual demo data.
 */
export function isManualRequest(id: string): boolean {
  if (id.startsWith('req-user-')) return true;
  const stored = getStoredRequests();
  return stored.some((r) => r.id === id);
}

/**
 * Delete an offline blood request by ID.
 */
export function deleteOfflineRequest(id: string): boolean {
  const stored = getStoredRequests();
  const updated = stored.filter((r) => r.id !== id);
  saveStoredRequests(updated);
  saveDeletedRequestId(id);
  return true;
}

/**
 * Clear all manually added demo requests.
 */
export function clearAllManualRequests(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_REQUESTS_KEY);
  } catch (err) {
    console.error('Failed to clear manual requests', err);
  }
}

/**
 * Get blood requests for a city (including user-created requests persisted locally).
 */
export function getOfflineRequests(city?: string): (BloodRequest & { hospital?: Hospital })[] {
  const customRequests = getStoredRequests();
  const deletedIds = getDeletedRequestIds();
  const activeSeed = OFFLINE_REQUESTS.filter((r) => !deletedIds.has(r.id));
  const activeCustom = customRequests.filter((r) => !deletedIds.has(r.id));

  if (!city || !city.trim()) {
    return [...activeCustom, ...activeSeed];
  }
  const cleanCity = city.trim().toLowerCase();

  const matchedSeed = activeSeed.filter(
    (r) => r.city.toLowerCase() === cleanCity || r.city.toLowerCase().includes(cleanCity) || cleanCity.includes(r.city.toLowerCase())
  );
  const baseSeed = matchedSeed.length > 0 ? matchedSeed : activeSeed.slice(0, 4);

  const matchedCustom = activeCustom.filter(
    (r) =>
      !r.city ||
      r.city.toLowerCase() === cleanCity ||
      r.city.toLowerCase().includes(cleanCity) ||
      cleanCity.includes(r.city.toLowerCase()) ||
      isManualRequest(r.id)
  );

  const combined = [...matchedCustom];
  const customIds = new Set(combined.map((r) => r.id));
  for (const s of baseSeed) {
    if (!customIds.has(s.id)) {
      combined.push(s);
    }
  }
  return combined;
}

/**
 * Add a new blood request locally to localStorage.
 */
export function addOfflineRequest(data: {
  patient_name: string;
  blood_group: BloodGroup;
  units_needed: number;
  city: string;
  requester_name: string;
  requester_phone: string;
  urgency: 'Critical' | 'Urgent' | 'Normal';
  hospital_id: string | null;
}): BloodRequest & { hospital?: Hospital } {
  const hospital = data.hospital_id ? getOfflineHospitalById(data.hospital_id) : undefined;
  const formattedPhone = formatIndianPhoneForSave(data.requester_phone);
  const newReq: BloodRequest & { hospital?: Hospital } = {
    id: `req-user-${Date.now()}`,
    patient_name: data.patient_name,
    blood_group: data.blood_group,
    units_needed: Math.min(5, Math.max(1, data.units_needed)),
    city: data.city,
    requester_name: data.requester_name,
    requester_phone: formattedPhone,
    urgency: data.urgency,
    hospital_id: data.hospital_id,
    hospital: hospital,
    status: 'Open',
    fulfilled_at: null,
    created_at: new Date().toISOString(),
  };

  const stored = getStoredRequests();
  stored.unshift(newReq);
  saveStoredRequests(stored);
  return newReq;
}

/**
 * Get donation camps filtered by city or hospitalId.
 */
export function getOfflineCamps(city?: string, hospitalId?: string): (BloodCamp & { hospital?: Hospital })[] {
  let list = OFFLINE_CAMPS;
  if (hospitalId) {
    list = list.filter((c) => c.hospital_id === hospitalId);
    return list;
  }
  if (!city || !city.trim()) {
    return list;
  }
  const cleanCity = city.trim().toLowerCase();
  const filtered = list.filter(
    (c) => c.city.toLowerCase() === cleanCity || c.city.toLowerCase().includes(cleanCity) || cleanCity.includes(c.city.toLowerCase())
  );
  return filtered.length > 0 ? filtered : list.slice(0, 4);
}
