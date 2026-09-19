const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unzwgotcdxolifbvrsxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuendnb3RjZHhvbGlmYnZyc3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTk2NjMsImV4cCI6MjEwNDI3NTY2M30.yaCpZrQY8c-YK2b7O3UVBe1pZ_OQnIy6SuXZKQbrBag';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const BLOOD_COMPONENTS = ['Whole Blood', 'Plasma', 'Platelets', 'RBC'];

const HOSPITALS_DATA = [
  // 1. Bhubaneswar (at least 4)
  {
    name: 'AIIMS Bhubaneswar',
    address: 'Sijua, Patia',
    city: 'Bhubaneswar',
    latitude: 20.2961,
    longitude: 85.8245,
    phone: '0674-2476001',
  },
  {
    name: 'SUM Hospital',
    address: 'Kalinga Nagar, Ghatikia',
    city: 'Bhubaneswar',
    latitude: 20.2760,
    longitude: 85.8450,
    phone: '0674-2380800',
  },
  {
    name: 'Apollo Hospitals Bhubaneswar',
    address: 'Plot No. 251, Sainik School Road, Unit 15',
    city: 'Bhubaneswar',
    latitude: 20.3082,
    longitude: 85.8340,
    phone: '0674-6661016',
  },
  {
    name: 'KIMS Hospital',
    address: 'KIIT Campus 5, Patia',
    city: 'Bhubaneswar',
    latitude: 20.3540,
    longitude: 85.8180,
    phone: '0674-7105300',
  },
  {
    name: 'Capital Hospital',
    address: 'Unit 6, Ganga Nagar',
    city: 'Bhubaneswar',
    latitude: 20.2642,
    longitude: 85.8174,
    phone: '0674-2391983',
  },

  // 2. Cuttack (at least 4)
  {
    name: 'SCB Medical College',
    address: 'Manglabag, Cuttack',
    city: 'Cuttack',
    latitude: 20.4625,
    longitude: 85.8828,
    phone: '0671-2303501',
  },
  {
    name: 'Ashwini Hospital',
    address: 'Sector 1, CDA, Cuttack',
    city: 'Cuttack',
    latitude: 20.4850,
    longitude: 85.8420,
    phone: '0671-2363007',
  },
  {
    name: 'Shanti Memorial Hospital',
    address: 'Patpur, Jail Road, Cuttack',
    city: 'Cuttack',
    latitude: 20.4710,
    longitude: 85.8730,
    phone: '0671-2415124',
  },
  {
    name: 'City Hospital Cuttack',
    address: 'Dargah Bazar, Cuttack',
    city: 'Cuttack',
    latitude: 20.4600,
    longitude: 85.8650,
    phone: '0671-2512100',
  },
  {
    name: 'Sadguru Medical Centre',
    address: 'Jagatsinghpur Road, Cuttack',
    city: 'Cuttack',
    latitude: 20.4500,
    longitude: 85.8900,
    phone: '0671-2321155',
  },

  // 3. Berhampur (at least 4)
  {
    name: 'MKCG Medical College',
    address: 'Medical Campus, Ganjam, Berhampur',
    city: 'Berhampur',
    latitude: 19.3140,
    longitude: 84.7941,
    phone: '0680-2290037',
  },
  {
    name: 'City Hospital Berhampur',
    address: 'Old Bus Stand Road, Berhampur',
    city: 'Berhampur',
    latitude: 19.3120,
    longitude: 84.7890,
    phone: '0680-2220145',
  },
  {
    name: 'Amit Hospital',
    address: 'Gandhi Nagar 3rd Line, Berhampur',
    city: 'Berhampur',
    latitude: 19.3210,
    longitude: 84.8010,
    phone: '0680-2204567',
  },
  {
    name: 'Christian Hospital Berhampur',
    address: 'Hillpatna, Berhampur',
    city: 'Berhampur',
    latitude: 19.3180,
    longitude: 84.7980,
    phone: '0680-2250234',
  },

  // 4. Rourkela (at least 4)
  {
    name: 'Ispat General Hospital (IGH)',
    address: 'Sector 19, Rourkela',
    city: 'Rourkela',
    latitude: 22.2570,
    longitude: 84.8620,
    phone: '0661-2646200',
  },
  {
    name: 'Hi-Tech Medical College & Hospital',
    address: 'Health Park, Panposh, Rourkela',
    city: 'Rourkela',
    latitude: 22.2350,
    longitude: 84.8210,
    phone: '0661-2400522',
  },
  {
    name: 'Rourkela Government Hospital (RGH)',
    address: 'Panposh Road, Udit Nagar, Rourkela',
    city: 'Rourkela',
    latitude: 22.2280,
    longitude: 84.8450,
    phone: '0661-2500120',
  },
  {
    name: 'Shanti Memorial Hospital Rourkela',
    address: 'Near Old Taxi Stand, Udit Nagar, Rourkela',
    city: 'Rourkela',
    latitude: 22.2240,
    longitude: 84.8510,
    phone: '0661-2510345',
  },

  // 5. Sambalpur (at least 4)
  {
    name: 'VIMSAR Burla',
    address: 'Medical Road, Burla, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.5030,
    longitude: 83.8740,
    phone: '0663-2430768',
  },
  {
    name: 'District Headquarters Hospital Sambalpur',
    address: 'Modipara, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4670,
    longitude: 83.9780,
    phone: '0663-2400102',
  },
  {
    name: 'Sanjivani Hospital Sambalpur',
    address: 'Dhanupali Road, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4550,
    longitude: 83.9920,
    phone: '0663-2541800',
  },
  {
    name: 'Ashoka Hospital',
    address: 'Budharaja, Sambalpur',
    city: 'Sambalpur',
    latitude: 21.4790,
    longitude: 83.9850,
    phone: '0663-2533200',
  },

  // 6. Puri (at least 4)
  {
    name: 'District Headquarters Hospital Puri',
    address: 'Grand Road, Balagandi, Puri',
    city: 'Puri',
    latitude: 19.8080,
    longitude: 85.8260,
    phone: '06752-222044',
  },
  {
    name: 'E24 Hospital Puri',
    address: 'Atharanala, Puri Bypass, Puri',
    city: 'Puri',
    latitude: 19.8220,
    longitude: 85.8340,
    phone: '06752-255100',
  },
  {
    name: 'Jagannath Hospital Puri',
    address: 'VIP Road, Police Line, Puri',
    city: 'Puri',
    latitude: 19.8150,
    longitude: 85.8410,
    phone: '06752-230550',
  },
  {
    name: 'Mother & Child Health Centre Puri',
    address: 'Badasankha, Puri',
    city: 'Puri',
    latitude: 19.8120,
    longitude: 85.8290,
    phone: '06752-224890',
  },

  // 7. Kolkata (at least 4)
  {
    name: 'SSKM Hospital (IPGMER)',
    address: '1, AJC Bose Road, Bhowanipore, Kolkata',
    city: 'Kolkata',
    latitude: 22.5380,
    longitude: 88.3440,
    phone: '033-22231589',
  },
  {
    name: 'Apollo Multispeciality Hospitals Kolkata',
    address: '58, Canal Circular Road, Kadapara, Kolkata',
    city: 'Kolkata',
    latitude: 22.5690,
    longitude: 88.3970,
    phone: '033-23203040',
  },
  {
    name: 'Fortis Hospital Anandapur',
    address: '730, Anandapur, E.M. Bypass Road, Kolkata',
    city: 'Kolkata',
    latitude: 22.5180,
    longitude: 88.4020,
    phone: '033-66284444',
  },
  {
    name: 'Calcutta Medical College & Hospital',
    address: '88, College Street, Bowbazar, Kolkata',
    city: 'Kolkata',
    latitude: 22.5740,
    longitude: 88.3610,
    phone: '033-22551600',
  },

  // 8. Delhi (at least 4)
  {
    name: 'AIIMS New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    city: 'Delhi',
    latitude: 28.5672,
    longitude: 77.2100,
    phone: '011-26588500',
  },
  {
    name: 'Safdarjung Hospital',
    address: 'Ansari Nagar West, Ring Road, New Delhi',
    city: 'Delhi',
    latitude: 28.5700,
    longitude: 77.2080,
    phone: '011-26165060',
  },
  {
    name: 'Max Super Speciality Hospital Saket',
    address: '1, 2, Press Enclave Marg, Saket, New Delhi',
    city: 'Delhi',
    latitude: 28.5270,
    longitude: 77.2130,
    phone: '011-26515050',
  },
  {
    name: 'Fortis Memorial Hospital Vasant Kunj',
    address: 'Sector B, Pocket 1, Aruna Asaf Ali Marg, Vasant Kunj, New Delhi',
    city: 'Delhi',
    latitude: 28.5290,
    longitude: 77.1510,
    phone: '011-42776222',
  },
];

function getStockCounts(hospitalName, group, component) {
  const seed = (hospitalName.length * 37 + group.charCodeAt(0) * 17 + component.length * 11) % 100;
  let baseAvail = 15;
  if (group === 'O+' || group === 'B+') baseAvail = 28;
  if (group === 'AB-' || group === 'O-') baseAvail = 6;
  
  const units_available = Math.max(0, Math.floor(baseAvail + (seed % 20) - 5));
  const units_needed = Math.max(0, Math.floor((seed % 15) - 3));
  return { units_available, units_needed };
}

async function seed() {
  console.log('--- Starting Seed: 3-4+ Hospitals Per Region with Blood Metrics ---');

  const { data: existingHospitals, error: fetchErr } = await supabase.from('hospitals').select('*');
  if (fetchErr) {
    console.error('Error fetching existing hospitals:', fetchErr);
    return;
  }

  const existingMap = new Map();
  existingHospitals.forEach(h => {
    existingMap.set(`${h.name.toLowerCase()}_${h.city.toLowerCase()}`, h);
  });

  console.log(`Found ${existingHospitals.length} existing hospitals in DB.`);

  for (const hData of HOSPITALS_DATA) {
    const key = `${hData.name.toLowerCase()}_${hData.city.toLowerCase()}`;
    let hospitalRecord = existingMap.get(key);

    if (!hospitalRecord) {
      console.log(`Inserting hospital: ${hData.name} (${hData.city})...`);
      const { data: inserted, error: insertErr } = await supabase
        .from('hospitals')
        .insert({
          name: hData.name,
          address: hData.address,
          city: hData.city,
          latitude: hData.latitude,
          longitude: hData.longitude,
          phone: hData.phone,
        })
        .select()
        .single();

      if (insertErr) {
        console.error(`Failed to insert ${hData.name}:`, insertErr);
        continue;
      }
      hospitalRecord = inserted;
      existingMap.set(key, hospitalRecord);
    } else {
      console.log(`Hospital already exists: ${hospitalRecord.name} (${hospitalRecord.city})`);
    }

    const { data: existingInv, error: invErr } = await supabase
      .from('blood_inventory')
      .select('id, blood_group, component')
      .eq('hospital_id', hospitalRecord.id);

    if (invErr) {
      console.error(`Error fetching inventory for ${hospitalRecord.name}:`, invErr);
      continue;
    }

    const existingPairs = new Set((existingInv || []).map(i => `${i.blood_group}_${i.component}`));
    const toInsert = [];

    for (const group of BLOOD_GROUPS) {
      for (const component of BLOOD_COMPONENTS) {
        if (!existingPairs.has(`${group}_${component}`)) {
          const { units_available, units_needed } = getStockCounts(hospitalRecord.name, group, component);
          toInsert.push({
            hospital_id: hospitalRecord.id,
            blood_group: group,
            component: component,
            units_available,
            units_needed,
          });
        }
      }
    }

    if (toInsert.length > 0) {
      console.log(`Adding ${toInsert.length} blood inventory metrics to ${hospitalRecord.name}...`);
      const { error: batchErr } = await supabase.from('blood_inventory').insert(toInsert);
      if (batchErr) {
        console.error(`Error inserting inventory for ${hospitalRecord.name}:`, batchErr);
      }
    } else {
      console.log(`All 32 blood inventory metrics present for ${hospitalRecord.name}.`);
    }
  }

  const { data: finalHospitals } = await supabase.from('hospitals').select('city, name');
  const cityCounts = {};
  finalHospitals.forEach(h => {
    cityCounts[h.city] = (cityCounts[h.city] || 0) + 1;
  });

  console.log('\n--- Hospital Counts Per Region ---');
  Object.entries(cityCounts).forEach(([city, count]) => {
    console.log(`- ${city}: ${count} hospitals`);
  });
  console.log('--- Seed Completed Successfully! ---');
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
});
