const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unzwgotcdxolifbvrsxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuendnb3RjZHhvbGlmYnZyc3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTk2NjMsImV4cCI6MjEwNDI3NTY2M30.yaCpZrQY8c-YK2b7O3UVBe1pZ_OQnIy6SuXZKQbrBag';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DONORS_DATA = [
  // 1. Bhubaneswar (4 donors)
  {
    name: 'Dr. Debasish Patnaik',
    blood_group: 'O+',
    city: 'Bhubaneswar',
    phone: '+91 94370 12345',
    email: 'debasish.patnaik@example.com',
    is_available: true,
    last_donated: '2026-05-10',
  },
  {
    name: 'Priyanka Senapati',
    blood_group: 'A+',
    city: 'Bhubaneswar',
    phone: '+91 98610 88776',
    email: 'priyanka.s@example.com',
    is_available: true,
    last_donated: '2026-06-22',
  },
  {
    name: 'Ashutosh Tripathy',
    blood_group: 'B-',
    city: 'Bhubaneswar',
    phone: '+91 70081 44552',
    email: 'ashu.trip@example.com',
    is_available: true,
    last_donated: '2026-04-18',
  },
  {
    name: 'Smrutirekha Mohanty',
    blood_group: 'AB+',
    city: 'Bhubaneswar',
    phone: '+91 82490 33211',
    email: 'smruti.m@example.com',
    is_available: false,
    last_donated: '2026-08-15',
  },

  // 2. Cuttack (4 donors)
  {
    name: 'Bishnu Charan Sahoo',
    blood_group: 'B+',
    city: 'Cuttack',
    phone: '+91 94372 65432',
    email: 'bishnu.sahoo@example.com',
    is_available: true,
    last_donated: '2026-05-30',
  },
  {
    name: 'Lipsa Routray',
    blood_group: 'O-',
    city: 'Cuttack',
    phone: '+91 97760 99881',
    email: 'lipsa.r@example.com',
    is_available: true,
    last_donated: '2026-06-05',
  },
  {
    name: 'Tapan Kumar Das',
    blood_group: 'A+',
    city: 'Cuttack',
    phone: '+91 78942 11223',
    email: 'tapan.das@example.com',
    is_available: true,
    last_donated: '2026-03-20',
  },
  {
    name: 'Satyabrata Pradhan',
    blood_group: 'AB-',
    city: 'Cuttack',
    phone: '+91 99371 45678',
    email: 'satyabrata.p@example.com',
    is_available: true,
    last_donated: '2026-07-12',
  },

  // 3. Berhampur (4 donors)
  {
    name: 'K. Raghunath Reddy',
    blood_group: 'O+',
    city: 'Berhampur',
    phone: '+91 94380 55667',
    email: 'raghunath.reddy@example.com',
    is_available: true,
    last_donated: '2026-06-01',
  },
  {
    name: 'Sunita Padhy',
    blood_group: 'B+',
    city: 'Berhampur',
    phone: '+91 88950 12456',
    email: 'sunita.padhy@example.com',
    is_available: true,
    last_donated: '2026-07-04',
  },
  {
    name: 'B. Manoj Kumar',
    blood_group: 'A-',
    city: 'Berhampur',
    phone: '+91 91240 77889',
    email: 'manoj.kumar@example.com',
    is_available: true,
    last_donated: '2026-04-25',
  },
  {
    name: 'Gitanjali Muni',
    blood_group: 'AB+',
    city: 'Berhampur',
    phone: '+91 96920 33445',
    email: 'gitanjali.m@example.com',
    is_available: false,
    last_donated: '2026-08-20',
  },

  // 4. Rourkela (4 donors)
  {
    name: 'Amitabh Mukherjee',
    blood_group: 'A+',
    city: 'Rourkela',
    phone: '+91 94371 88990',
    email: 'amitabh.m@example.com',
    is_available: true,
    last_donated: '2026-05-18',
  },
  {
    name: 'Suman Minz',
    blood_group: 'O+',
    city: 'Rourkela',
    phone: '+91 98612 33441',
    email: 'suman.minz@example.com',
    is_available: true,
    last_donated: '2026-06-19',
  },
  {
    name: 'Rajat Kispotta',
    blood_group: 'B+',
    city: 'Rourkela',
    phone: '+91 79780 22334',
    email: 'rajat.k@example.com',
    is_available: true,
    last_donated: '2026-04-12',
  },
  {
    name: 'Neelam Swarnakar',
    blood_group: 'AB-',
    city: 'Rourkela',
    phone: '+91 88955 66778',
    email: 'neelam.s@example.com',
    is_available: true,
    last_donated: '2026-07-28',
  },

  // 5. Sambalpur (4 donors)
  {
    name: 'Pradeep Meher',
    blood_group: 'B+',
    city: 'Sambalpur',
    phone: '+91 94373 44556',
    email: 'pradeep.meher@example.com',
    is_available: true,
    last_donated: '2026-05-24',
  },
  {
    name: 'Swagatika Barik',
    blood_group: 'O-',
    city: 'Sambalpur',
    phone: '+91 99372 77881',
    email: 'swagatika.b@example.com',
    is_available: true,
    last_donated: '2026-06-11',
  },
  {
    name: 'Dharmendra Gartia',
    blood_group: 'A+',
    city: 'Sambalpur',
    phone: '+91 78941 66554',
    email: 'dharmendra.g@example.com',
    is_available: true,
    last_donated: '2026-04-05',
  },
  {
    name: 'Mamata Bishi',
    blood_group: 'AB+',
    city: 'Sambalpur',
    phone: '+91 82492 11990',
    email: 'mamata.bishi@example.com',
    is_available: true,
    last_donated: '2026-07-15',
  },

  // 6. Puri (4 donors)
  {
    name: 'Damodar Mohapatra',
    blood_group: 'O+',
    city: 'Puri',
    phone: '+91 94374 88221',
    email: 'damodar.m@example.com',
    is_available: true,
    last_donated: '2026-05-15',
  },
  {
    name: 'Subhadra Gochikar',
    blood_group: 'B+',
    city: 'Puri',
    phone: '+91 98615 44332',
    email: 'subhadra.g@example.com',
    is_available: true,
    last_donated: '2026-06-25',
  },
  {
    name: 'Jagannath Khuntia',
    blood_group: 'A+',
    city: 'Puri',
    phone: '+91 70083 99112',
    email: 'jagannath.k@example.com',
    is_available: true,
    last_donated: '2026-04-30',
  },
  {
    name: 'Anusaya Mishra',
    blood_group: 'A-',
    city: 'Puri',
    phone: '+91 97762 55443',
    email: 'anusaya.m@example.com',
    is_available: false,
    last_donated: '2026-08-10',
  },

  // 7. Kolkata (4 donors)
  {
    name: 'Sourav Banerjee',
    blood_group: 'B+',
    city: 'Kolkata',
    phone: '+91 98300 12345',
    email: 'sourav.banerjee@example.com',
    is_available: true,
    last_donated: '2026-05-20',
  },
  {
    name: 'Ananya Chatterjee',
    blood_group: 'O+',
    city: 'Kolkata',
    phone: '+91 98311 98765',
    email: 'ananya.c@example.com',
    is_available: true,
    last_donated: '2026-06-18',
  },
  {
    name: 'Subir Chakraborty',
    blood_group: 'AB+',
    city: 'Kolkata',
    phone: '+91 94330 45678',
    email: 'subir.c@example.com',
    is_available: true,
    last_donated: '2026-04-10',
  },
  {
    name: 'Deblina Ghosh',
    blood_group: 'A-',
    city: 'Kolkata',
    phone: '+91 89102 33445',
    email: 'deblina.ghosh@example.com',
    is_available: true,
    last_donated: '2026-07-22',
  },

  // 8. Delhi (4 donors)
  {
    name: 'Vikramaditya Sharma',
    blood_group: 'O+',
    city: 'Delhi',
    phone: '+91 98110 55443',
    email: 'vikram.sharma@example.com',
    is_available: true,
    last_donated: '2026-05-28',
  },
  {
    name: 'Jaspreet Kaur',
    blood_group: 'B+',
    city: 'Delhi',
    phone: '+91 98101 22334',
    email: 'jaspreet.kaur@example.com',
    is_available: true,
    last_donated: '2026-06-30',
  },
  {
    name: 'Mohammad Arshad',
    blood_group: 'A+',
    city: 'Delhi',
    phone: '+91 98712 66778',
    email: 'm.arshad@example.com',
    is_available: true,
    last_donated: '2026-04-15',
  },
  {
    name: 'Ritu Aggarwal',
    blood_group: 'O-',
    city: 'Delhi',
    phone: '+91 99100 88991',
    email: 'ritu.aggarwal@example.com',
    is_available: true,
    last_donated: '2026-07-08',
  },
];

const REQUESTS_DATA = [
  // 1. Bhubaneswar (4 requests)
  {
    city: 'Bhubaneswar',
    patient_name: 'Bimalendu Mohanty',
    blood_group: 'O+',
    units_needed: 3,
    requester_name: 'Sasmita Mohanty',
    requester_phone: '+91 94370 66778',
    urgency: 'Critical',
    hospitalMatch: 'AIIMS Bhubaneswar',
    minsAgo: 25,
  },
  {
    city: 'Bhubaneswar',
    patient_name: 'Sunita Das (Cardiac Surgery)',
    blood_group: 'A-',
    units_needed: 2,
    requester_name: 'Dr. R. K. Behera',
    requester_phone: '+91 98610 33221',
    urgency: 'Urgent',
    hospitalMatch: 'Apollo Hospitals Bhubaneswar',
    minsAgo: 75,
  },
  {
    city: 'Bhubaneswar',
    patient_name: 'Master Ayush Pradhan',
    blood_group: 'B+',
    units_needed: 2,
    requester_name: 'Narayan Pradhan',
    requester_phone: '+91 70081 99002',
    urgency: 'Normal',
    hospitalMatch: 'KIMS Hospital',
    minsAgo: 210,
  },
  {
    city: 'Bhubaneswar',
    patient_name: 'Geetanjali Mishra',
    blood_group: 'AB+',
    units_needed: 1,
    requester_name: 'Alok Mishra',
    requester_phone: '+91 82490 55441',
    urgency: 'Urgent',
    hospitalMatch: 'SUM Hospital',
    minsAgo: 480,
  },

  // 2. Cuttack (4 requests)
  {
    city: 'Cuttack',
    patient_name: 'Prabhakar Jena (Trauma ICU)',
    blood_group: 'B-',
    units_needed: 4,
    requester_name: 'Gourahari Jena',
    requester_phone: '+91 94372 11223',
    urgency: 'Critical',
    hospitalMatch: 'SCB Medical College',
    minsAgo: 35,
  },
  {
    city: 'Cuttack',
    patient_name: 'Kalyani Sahoo',
    blood_group: 'O+',
    units_needed: 2,
    requester_name: 'Niranjan Sahoo',
    requester_phone: '+91 97760 44556',
    urgency: 'Urgent',
    hospitalMatch: 'Ashwini Hospital',
    minsAgo: 110,
  },
  {
    city: 'Cuttack',
    patient_name: 'Subrat Nayak',
    blood_group: 'A+',
    units_needed: 2,
    requester_name: 'Minati Nayak',
    requester_phone: '+91 78942 88990',
    urgency: 'Normal',
    hospitalMatch: 'Shanti Memorial Hospital',
    minsAgo: 320,
  },
  {
    city: 'Cuttack',
    patient_name: 'Rabindra Samal',
    blood_group: 'O-',
    units_needed: 3,
    requester_name: 'Debendra Samal',
    requester_phone: '+91 99371 66778',
    urgency: 'Critical',
    hospitalMatch: 'City Hospital Cuttack',
    minsAgo: 600,
  },

  // 3. Berhampur (4 requests)
  {
    city: 'Berhampur',
    patient_name: 'K. Laxmi Bai (Maternity)',
    blood_group: 'A+',
    units_needed: 2,
    requester_name: 'K. Appa Rao',
    requester_phone: '+91 94380 99887',
    urgency: 'Critical',
    hospitalMatch: 'MKCG Medical College',
    minsAgo: 45,
  },
  {
    city: 'Berhampur',
    patient_name: 'Dillip Kumar Patro',
    blood_group: 'B+',
    units_needed: 2,
    requester_name: 'Chandan Patro',
    requester_phone: '+91 88950 33445',
    urgency: 'Urgent',
    hospitalMatch: 'City Hospital Berhampur',
    minsAgo: 140,
  },
  {
    city: 'Berhampur',
    patient_name: 'M. Santoshi',
    blood_group: 'O+',
    units_needed: 1,
    requester_name: 'M. Krishna',
    requester_phone: '+91 91240 55667',
    urgency: 'Normal',
    hospitalMatch: 'Amit Hospital',
    minsAgo: 380,
  },
  {
    city: 'Berhampur',
    patient_name: 'B. Mohan Das',
    blood_group: 'AB-',
    units_needed: 2,
    requester_name: 'B. Sitaram',
    requester_phone: '+91 96920 11224',
    urgency: 'Urgent',
    hospitalMatch: 'Christian Hospital Berhampur',
    minsAgo: 720,
  },

  // 4. Rourkela (4 requests)
  {
    city: 'Rourkela',
    patient_name: 'Gopal Chandra Das (Industrial Acc.)',
    blood_group: 'O-',
    units_needed: 4,
    requester_name: 'Suresh Das',
    requester_phone: '+91 94371 44332',
    urgency: 'Critical',
    hospitalMatch: 'Ispat General Hospital (IGH)',
    minsAgo: 20,
  },
  {
    city: 'Rourkela',
    patient_name: 'Sunita Tirkey',
    blood_group: 'B+',
    units_needed: 2,
    requester_name: 'Prakash Tirkey',
    requester_phone: '+91 98612 88991',
    urgency: 'Urgent',
    hospitalMatch: 'Hi-Tech Medical College & Hospital',
    minsAgo: 90,
  },
  {
    city: 'Rourkela',
    patient_name: 'Md. Farooq',
    blood_group: 'A+',
    units_needed: 2,
    requester_name: 'Md. Imran',
    requester_phone: '+91 79780 11223',
    urgency: 'Normal',
    hospitalMatch: 'Rourkela Government Hospital (RGH)',
    minsAgo: 260,
  },
  {
    city: 'Rourkela',
    patient_name: 'Kavita Agarwal',
    blood_group: 'AB+',
    units_needed: 1,
    requester_name: 'Mukesh Agarwal',
    requester_phone: '+91 88955 44556',
    urgency: 'Urgent',
    hospitalMatch: 'Shanti Memorial Hospital Rourkela',
    minsAgo: 540,
  },

  // 5. Sambalpur (4 requests)
  {
    city: 'Sambalpur',
    patient_name: 'Jayanti Padhan (Nephrology)',
    blood_group: 'B+',
    units_needed: 3,
    requester_name: 'Bibhuti Padhan',
    requester_phone: '+91 94373 88990',
    urgency: 'Critical',
    hospitalMatch: 'VIMSAR Burla',
    minsAgo: 50,
  },
  {
    city: 'Sambalpur',
    patient_name: 'Umesh Chandra Sahu',
    blood_group: 'O+',
    units_needed: 2,
    requester_name: 'Hemant Sahu',
    requester_phone: '+91 99372 11225',
    urgency: 'Urgent',
    hospitalMatch: 'District Headquarters Hospital Sambalpur',
    minsAgo: 160,
  },
  {
    city: 'Sambalpur',
    patient_name: 'Sarojini Bhoi',
    blood_group: 'A-',
    units_needed: 2,
    requester_name: 'Bhuban Bhoi',
    requester_phone: '+91 78941 33442',
    urgency: 'Normal',
    hospitalMatch: 'Sanjivani Hospital Sambalpur',
    minsAgo: 390,
  },
  {
    city: 'Sambalpur',
    patient_name: 'Ranjan Kalo',
    blood_group: 'AB+',
    units_needed: 2,
    requester_name: 'Tribikram Kalo',
    requester_phone: '+91 82492 77889',
    urgency: 'Urgent',
    hospitalMatch: 'Ashoka Hospital',
    minsAgo: 690,
  },

  // 6. Puri (4 requests)
  {
    city: 'Puri',
    patient_name: 'Gouranga Chandra Das',
    blood_group: 'A+',
    units_needed: 3,
    requester_name: 'Dhaneswar Das',
    requester_phone: '+91 94374 22334',
    urgency: 'Critical',
    hospitalMatch: 'District Headquarters Hospital Puri',
    minsAgo: 30,
  },
  {
    city: 'Puri',
    patient_name: 'Manjulata Pradhan',
    blood_group: 'O+',
    units_needed: 2,
    requester_name: 'Rabi Narayan Pradhan',
    requester_phone: '+91 98615 77889',
    urgency: 'Urgent',
    hospitalMatch: 'E24 Hospital Puri',
    minsAgo: 120,
  },
  {
    city: 'Puri',
    patient_name: 'Balaram Khuntia',
    blood_group: 'B-',
    units_needed: 2,
    requester_name: 'Sridhar Khuntia',
    requester_phone: '+91 70083 44556',
    urgency: 'Normal',
    hospitalMatch: 'Jagannath Hospital Puri',
    minsAgo: 310,
  },
  {
    city: 'Puri',
    patient_name: 'Kishore Chandra Panda',
    blood_group: 'O-',
    units_needed: 2,
    requester_name: 'Bhabani Panda',
    requester_phone: '+91 97762 11990',
    urgency: 'Critical',
    hospitalMatch: 'Mother & Child Health Centre Puri',
    minsAgo: 580,
  },

  // 7. Kolkata (4 requests)
  {
    city: 'Kolkata',
    patient_name: 'Subhash Chandra Bose',
    blood_group: 'O+',
    units_needed: 3,
    requester_name: 'Anirban Bose',
    requester_phone: '+91 98300 44556',
    urgency: 'Critical',
    hospitalMatch: 'SSKM Hospital (IPGMER)',
    minsAgo: 15,
  },
  {
    city: 'Kolkata',
    patient_name: 'Maitreyi Ganguly (Oncology)',
    blood_group: 'B+',
    units_needed: 2,
    requester_name: 'Tanmay Ganguly',
    requester_phone: '+91 98311 22334',
    urgency: 'Urgent',
    hospitalMatch: 'Apollo Multispeciality Hospitals Kolkata',
    minsAgo: 85,
  },
  {
    city: 'Kolkata',
    patient_name: 'Rahul Roy Chowdhury',
    blood_group: 'A-',
    units_needed: 2,
    requester_name: 'Soma Roy Chowdhury',
    requester_phone: '+91 94330 99881',
    urgency: 'Normal',
    hospitalMatch: 'Fortis Hospital Anandapur',
    minsAgo: 240,
  },
  {
    city: 'Kolkata',
    patient_name: 'Pranab Kumar Sen',
    blood_group: 'AB+',
    units_needed: 2,
    requester_name: 'Indranil Sen',
    requester_phone: '+91 89102 66778',
    urgency: 'Urgent',
    hospitalMatch: 'Calcutta Medical College & Hospital',
    minsAgo: 510,
  },

  // 8. Delhi (4 requests)
  {
    city: 'Delhi',
    patient_name: 'Harpreet Singh (Orthopedic Surgery)',
    blood_group: 'B+',
    units_needed: 3,
    requester_name: 'Gurmeet Singh',
    requester_phone: '+91 98110 88990',
    urgency: 'Critical',
    hospitalMatch: 'AIIMS New Delhi',
    minsAgo: 25,
  },
  {
    city: 'Delhi',
    patient_name: 'Aarti Verma',
    blood_group: 'O+',
    units_needed: 2,
    requester_name: 'Rajesh Verma',
    requester_phone: '+91 98101 55667',
    urgency: 'Urgent',
    hospitalMatch: 'Safdarjung Hospital',
    minsAgo: 105,
  },
  {
    city: 'Delhi',
    patient_name: 'Deepak Chopra',
    blood_group: 'O-',
    units_needed: 3,
    requester_name: 'Sanjay Chopra',
    requester_phone: '+91 98712 11223',
    urgency: 'Critical',
    hospitalMatch: 'Max Super Speciality Hospital Saket',
    minsAgo: 280,
  },
  {
    city: 'Delhi',
    patient_name: 'Meena Kumari',
    blood_group: 'A+',
    units_needed: 1,
    requester_name: 'Ramesh Kumar',
    requester_phone: '+91 99100 44556',
    urgency: 'Normal',
    hospitalMatch: 'Fortis Memorial Hospital Vasant Kunj',
    minsAgo: 620,
  },
];

async function seedDonorsAndRequests() {
  console.log('--- Seeding 4 Donors & 4 Blood Requests Per Location ---');

  // 1. Fetch hospitals for mapping
  const { data: hospitals } = await supabase.from('hospitals').select('id, name, city');
  const hospitalMap = new Map();
  hospitals.forEach(h => hospitalMap.set(h.name.toLowerCase(), h.id));

  // 2. Fetch existing donors and requests
  const { data: existingDonors } = await supabase.from('donors').select('name, city');
  const donorSet = new Set((existingDonors || []).map(d => `${d.name.toLowerCase()}_${d.city.toLowerCase()}`));

  const { data: existingRequests } = await supabase.from('blood_requests').select('patient_name, city');
  const reqSet = new Set((existingRequests || []).map(r => `${r.patient_name.toLowerCase()}_${r.city.toLowerCase()}`));

  // Insert Donors
  const donorsToInsert = [];
  for (const d of DONORS_DATA) {
    const key = `${d.name.toLowerCase()}_${d.city.toLowerCase()}`;
    if (!donorSet.has(key)) {
      donorsToInsert.push({
        name: d.name,
        blood_group: d.blood_group,
        city: d.city,
        phone: d.phone,
        email: d.email,
        is_available: d.is_available,
        last_donated: d.last_donated,
      });
    }
  }

  if (donorsToInsert.length > 0) {
    console.log(`Inserting ${donorsToInsert.length} donors...`);
    const { error: dErr } = await supabase.from('donors').insert(donorsToInsert);
    if (dErr) console.error('Error inserting donors:', dErr);
    else console.log('Donors inserted successfully!');
  } else {
    console.log('All donors already exist.');
  }

  // Insert Requests
  const now = Date.now();
  const requestsToInsert = [];
  for (const r of REQUESTS_DATA) {
    const key = `${r.patient_name.toLowerCase()}_${r.city.toLowerCase()}`;
    if (!reqSet.has(key)) {
      const hospitalId = hospitalMap.get(r.hospitalMatch.toLowerCase()) || null;
      const createdAtIso = new Date(now - r.minsAgo * 60 * 1000).toISOString();
      requestsToInsert.push({
        patient_name: r.patient_name,
        blood_group: r.blood_group,
        units_needed: r.units_needed,
        city: r.city,
        requester_name: r.requester_name,
        requester_phone: r.requester_phone,
        urgency: r.urgency,
        hospital_id: hospitalId,
        status: 'Open',
        created_at: createdAtIso,
      });
    }
  }

  if (requestsToInsert.length > 0) {
    console.log(`Inserting ${requestsToInsert.length} blood requests...`);
    const { error: rErr } = await supabase.from('blood_requests').insert(requestsToInsert);
    if (rErr) console.error('Error inserting requests:', rErr);
    else console.log('Blood requests inserted successfully!');
  } else {
    console.log('All blood requests already exist.');
  }

  // Summary counts per city
  const { data: allDonors } = await supabase.from('donors').select('city');
  const dCounts = {};
  allDonors?.forEach(d => dCounts[d.city] = (dCounts[d.city] || 0) + 1);

  const { data: allRequests } = await supabase.from('blood_requests').select('city');
  const rCounts = {};
  allRequests?.forEach(r => rCounts[r.city] = (rCounts[r.city] || 0) + 1);

  console.log('\n--- Regional Donors & Requests Summary ---');
  const CITIES = ['Bhubaneswar', 'Cuttack', 'Berhampur', 'Rourkela', 'Sambalpur', 'Puri', 'Kolkata', 'Delhi'];
  for (const c of CITIES) {
    console.log(`- ${c}: ${dCounts[c] || 0} donors | ${rCounts[c] || 0} requests`);
  }
}

seedDonorsAndRequests().catch(console.error);
