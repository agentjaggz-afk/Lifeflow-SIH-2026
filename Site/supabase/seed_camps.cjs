const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unzwgotcdxolifbvrsxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuendnb3RjZHhvbGlmYnZyc3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTk2NjMsImV4cCI6MjEwNDI3NTY2M30.yaCpZrQY8c-YK2b7O3UVBe1pZ_OQnIy6SuXZKQbrBag';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CAMPS_DATA = [
  // 1. Bhubaneswar (4 camps)
  {
    city: 'Bhubaneswar',
    name: 'Red Cross Mega Blood Drive',
    address: 'KIIT Convention Center, Patia',
    date: '2026-09-16',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Indian Red Cross Society, Odisha',
    hospitalNameMatch: 'KIMS Hospital',
  },
  {
    city: 'Bhubaneswar',
    name: 'Youth For Life Donation Camp',
    address: 'Utkal University Campus, Vani Vihar',
    date: '2026-09-22',
    start_time: '10:00',
    end_time: '17:00',
    organizer: 'Rotaract Club of Bhubaneswar',
    hospitalNameMatch: 'AIIMS Bhubaneswar',
  },
  {
    city: 'Bhubaneswar',
    name: 'Corporate Blood Drive - Infocity',
    address: 'DLF Cybercity, Patia',
    date: '2026-09-28',
    start_time: '09:30',
    end_time: '15:30',
    organizer: 'IT Employees Welfare Association',
    hospitalNameMatch: 'SUM Hospital',
  },
  {
    city: 'Bhubaneswar',
    name: 'Janata Maidan Community Blood Camp',
    address: 'Janata Maidan, Chandrasekharpur',
    date: '2026-10-05',
    start_time: '08:30',
    end_time: '14:00',
    organizer: 'Lions Club Bhubaneswar',
    hospitalNameMatch: 'Capital Hospital',
  },

  // 2. Cuttack (4 camps)
  {
    city: 'Cuttack',
    name: 'Silver City Annual Blood Drive',
    address: 'Barabati Stadium Complex, Buxi Bazar',
    date: '2026-09-17',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Cuttack Citizen Forum',
    hospitalNameMatch: 'SCB Medical College',
  },
  {
    city: 'Cuttack',
    name: 'Ravenshaw University Voluntary Camp',
    address: 'Ravenshaw Ground, College Square',
    date: '2026-09-24',
    start_time: '10:00',
    end_time: '15:30',
    organizer: 'Ravenshaw NSS Unit',
    hospitalNameMatch: 'Ashwini Hospital',
  },
  {
    city: 'Cuttack',
    name: 'Mahanadi Community Blood Collection',
    address: 'Chahata Ghat Community Hall',
    date: '2026-10-02',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Red Ribbon Club Cuttack',
    hospitalNameMatch: 'Shanti Memorial Hospital',
  },
  {
    city: 'Cuttack',
    name: 'Millennium City Blood Drive',
    address: 'Choudwar Community Centre',
    date: '2026-10-10',
    start_time: '09:30',
    end_time: '15:00',
    organizer: 'Marwari Yuva Manch Cuttack',
    hospitalNameMatch: 'City Hospital Cuttack',
  },

  // 3. Berhampur (4 camps)
  {
    city: 'Berhampur',
    name: 'Silk City Voluntary Blood Camp',
    address: 'Town Hall, Gandhi Nagar',
    date: '2026-09-18',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Ganjam Youth Association',
    hospitalNameMatch: 'MKCG Medical College',
  },
  {
    city: 'Berhampur',
    name: 'Khallikote University Blood Drive',
    address: 'Khallikote Unitary Campus',
    date: '2026-09-25',
    start_time: '09:30',
    end_time: '16:00',
    organizer: 'Khallikote Red Cross Wing',
    hospitalNameMatch: 'City Hospital Berhampur',
  },
  {
    city: 'Berhampur',
    name: 'Gopalpur Beach Road Blood Camp',
    address: 'Marine Drive Community Center',
    date: '2026-10-03',
    start_time: '08:30',
    end_time: '13:30',
    organizer: 'Rotary Club of Berhampur',
    hospitalNameMatch: 'Amit Hospital',
  },
  {
    city: 'Berhampur',
    name: 'Brahmapur Rotary Blood Express',
    address: 'Giri Market Hall',
    date: '2026-10-12',
    start_time: '10:00',
    end_time: '16:00',
    organizer: 'Lions Club of Silk City',
    hospitalNameMatch: 'Christian Hospital Berhampur',
  },

  // 4. Rourkela (4 camps)
  {
    city: 'Rourkela',
    name: 'Steel City Lifesavers Camp',
    address: 'Civic Centre, Sector 19',
    date: '2026-09-19',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'SAIL Rourkela Steel Plant',
    hospitalNameMatch: 'Ispat General Hospital (IGH)',
  },
  {
    city: 'Rourkela',
    name: 'NIT Rourkela Annual Blood Drive',
    address: 'Student Activity Centre (SAC), NIT Rourkela',
    date: '2026-09-26',
    start_time: '09:30',
    end_time: '17:00',
    organizer: 'Rotaract Club NIT Rourkela',
    hospitalNameMatch: 'Hi-Tech Medical College & Hospital',
  },
  {
    city: 'Rourkela',
    name: 'Koel Nagar Community Blood Camp',
    address: 'Community Hall, Koel Nagar',
    date: '2026-10-04',
    start_time: '08:30',
    end_time: '14:00',
    organizer: 'Rourkela Blood Donors Club',
    hospitalNameMatch: 'Rourkela Government Hospital (RGH)',
  },
  {
    city: 'Rourkela',
    name: 'Panposh Voluntary Donation Drive',
    address: 'Biju Patnaik Hockey Stadium Annex',
    date: '2026-10-14',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Red Cross Rourkela',
    hospitalNameMatch: 'Shanti Memorial Hospital Rourkela',
  },

  // 5. Sambalpur (4 camps)
  {
    city: 'Sambalpur',
    name: 'Hirakud Reservoir Blood Drive',
    address: 'Town Hall, Modipara',
    date: '2026-09-20',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Sambalpur Citizens Council',
    hospitalNameMatch: 'District Headquarters Hospital Sambalpur',
  },
  {
    city: 'Sambalpur',
    name: 'VSSUT Burla Lifeline Camp',
    address: 'VSSUT Campus, Burla',
    date: '2026-09-27',
    start_time: '10:00',
    end_time: '16:30',
    organizer: 'NSS VSSUT Burla',
    hospitalNameMatch: 'VIMSAR Burla',
  },
  {
    city: 'Sambalpur',
    name: 'Dhanupali Community Blood Drive',
    address: 'Kalyan Mandap, Dhanupali',
    date: '2026-10-06',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Sambalpur Youth Forum',
    hospitalNameMatch: 'Sanjivani Hospital Sambalpur',
  },
  {
    city: 'Sambalpur',
    name: 'Maa Samaleswari Charitable Camp',
    address: 'Samaleswari Temple Complex Hall',
    date: '2026-10-15',
    start_time: '08:30',
    end_time: '14:30',
    organizer: 'Samaleswari Trust & Blood Bank',
    hospitalNameMatch: 'Ashoka Hospital',
  },

  // 6. Puri (4 camps)
  {
    city: 'Puri',
    name: 'Shree Jagannath Seva Blood Camp',
    address: 'Town Hall, Grand Road',
    date: '2026-09-19',
    start_time: '08:30',
    end_time: '15:00',
    organizer: 'Puri Sevayat Welfare Association',
    hospitalNameMatch: 'District Headquarters Hospital Puri',
  },
  {
    city: 'Puri',
    name: 'Golden Beach Lifesavers Drive',
    address: 'Blue Flag Beach Promenade',
    date: '2026-09-27',
    start_time: '09:00',
    end_time: '14:00',
    organizer: 'Puri Eco-Tourism & Red Cross',
    hospitalNameMatch: 'E24 Hospital Puri',
  },
  {
    city: 'Puri',
    name: 'Atharanala Pilgrims Blood Drive',
    address: 'Atharanala Toll Community Hall',
    date: '2026-10-05',
    start_time: '09:00',
    end_time: '16:00',
    organizer: 'Lions Club of Puri',
    hospitalNameMatch: 'Jagannath Hospital Puri',
  },
  {
    city: 'Puri',
    name: 'SCS College Youth Blood Drive',
    address: 'Samanta Chandra Sekhar College Campus',
    date: '2026-10-13',
    start_time: '10:00',
    end_time: '15:30',
    organizer: 'SCS College Red Ribbon Club',
    hospitalNameMatch: 'Mother & Child Health Centre Puri',
  },

  // 7. Kolkata (4 camps)
  {
    city: 'Kolkata',
    name: 'Park Street Community Blood Drive',
    address: 'Rotary Sadan, Park Street',
    date: '2026-09-18',
    start_time: '09:30',
    end_time: '16:30',
    organizer: 'Rotary Club of Calcutta',
    hospitalNameMatch: 'SSKM Hospital (IPGMER)',
  },
  {
    city: 'Kolkata',
    name: 'Salt Lake Sector V Tech Blood Camp',
    address: 'Saltlake IT Park Complex, Sector V',
    date: '2026-09-25',
    start_time: '09:00',
    end_time: '17:00',
    organizer: 'Bengal IT Associates',
    hospitalNameMatch: 'Apollo Multispeciality Hospitals Kolkata',
  },
  {
    city: 'Kolkata',
    name: 'Howrah Bridge City Blood Drive',
    address: 'Rabindra Sadan Cultural Center',
    date: '2026-10-02',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Kolkata Voluntary Blood Donors Forum',
    hospitalNameMatch: 'Calcutta Medical College & Hospital',
  },
  {
    city: 'Kolkata',
    name: 'South Kolkata Lifesavers Camp',
    address: 'Jadavpur University Campus',
    date: '2026-10-11',
    start_time: '10:00',
    end_time: '16:00',
    organizer: 'JU Student Welfare Board',
    hospitalNameMatch: 'Fortis Hospital Anandapur',
  },

  // 8. Delhi (4 camps)
  {
    city: 'Delhi',
    name: 'Connaught Place Mega Blood Drive',
    address: 'Central Park, Connaught Place',
    date: '2026-09-20',
    start_time: '09:00',
    end_time: '17:00',
    organizer: 'Delhi Red Cross Mission',
    hospitalNameMatch: 'AIIMS New Delhi',
  },
  {
    city: 'Delhi',
    name: 'Delhi University North Campus Camp',
    address: 'Faculty of Arts Auditorium, DU',
    date: '2026-09-26',
    start_time: '09:30',
    end_time: '16:00',
    organizer: 'DU Student Union & Rotary Club',
    hospitalNameMatch: 'Safdarjung Hospital',
  },
  {
    city: 'Delhi',
    name: 'South Extension Community Blood Camp',
    address: 'NDMC Community Hall, South Ext 1',
    date: '2026-10-03',
    start_time: '09:00',
    end_time: '15:00',
    organizer: 'Lions Club Delhi Central',
    hospitalNameMatch: 'Max Super Speciality Hospital Saket',
  },
  {
    city: 'Delhi',
    name: 'Dwarka City Blood Donation Express',
    address: 'Sector 10 Community Center, Dwarka',
    date: '2026-10-12',
    start_time: '09:00',
    end_time: '15:30',
    organizer: 'Dwarka Residents Welfare Federation',
    hospitalNameMatch: 'Fortis Memorial Hospital Vasant Kunj',
  },
];

async function seedCamps() {
  console.log('--- Seeding 3-4 Donation Camps Per Location ---');

  // 1. Fetch hospitals so we can map hospital_id
  const { data: hospitals } = await supabase.from('hospitals').select('id, name, city');
  const hospitalMap = new Map();
  hospitals.forEach(h => hospitalMap.set(h.name.toLowerCase(), h.id));

  // 2. Fetch existing camps
  const { data: existingCamps } = await supabase.from('blood_camps').select('*');
  const existingNames = new Set((existingCamps || []).map(c => c.name.toLowerCase()));

  // Remove old 2025 camps if any exist
  const oldCamps = (existingCamps || []).filter(c => c.date.startsWith('2025'));
  if (oldCamps.length > 0) {
    console.log(`Cleaning up ${oldCamps.length} outdated 2025 camps...`);
    for (const oc of oldCamps) {
      await supabase.from('blood_camps').delete().eq('id', oc.id);
      existingNames.delete(oc.name.toLowerCase());
    }
  }

  const toInsert = [];
  for (const cData of CAMPS_DATA) {
    if (!existingNames.has(cData.name.toLowerCase())) {
      const hospitalId = hospitalMap.get(cData.hospitalNameMatch.toLowerCase()) || null;
      toInsert.push({
        name: cData.name,
        address: cData.address,
        city: cData.city,
        date: cData.date,
        start_time: cData.start_time,
        end_time: cData.end_time,
        organizer: cData.organizer,
        hospital_id: hospitalId,
      });
    }
  }

  if (toInsert.length > 0) {
    console.log(`Inserting ${toInsert.length} new donation camps...`);
    const { error: insertErr } = await supabase.from('blood_camps').insert(toInsert);
    if (insertErr) {
      console.error('Error inserting camps:', insertErr);
    } else {
      console.log('All camps inserted successfully!');
    }
  } else {
    console.log('All camps already up to date in database.');
  }

  // Verification per city
  const { data: allCamps } = await supabase.from('blood_camps').select('*').order('date');
  const cityCamps = {};
  allCamps?.forEach(c => {
    cityCamps[c.city] = (cityCamps[c.city] || 0) + 1;
  });

  console.log('\n--- Donation Camps Count Per Region ---');
  Object.entries(cityCamps).forEach(([city, count]) => {
    console.log(`- ${city}: ${count} camps`);
  });
}

seedCamps().catch(console.error);
