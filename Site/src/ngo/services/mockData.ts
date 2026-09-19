import {
  BloodGroup,
  BloodInventoryItem,
  BloodUnit,
  ConnectedHospital,
  HospitalRequest,
  Shipment,
  SosAlert,
  ActivityLog,
  AppNotification,
  NgoProfile,
  NgoNetworkPeer,
  StaffUser
} from '../types';

export const INITIAL_INVENTORY: BloodInventoryItem[] = [
  { bloodGroup: 'O+', currentUnits: 175, minThreshold: 50, maxCapacity: 250, lastUpdated: '12 seconds ago', status: 'Healthy' },
  { bloodGroup: 'O-', currentUnits: 42, minThreshold: 20, maxCapacity: 100, lastUpdated: '1 minute ago', status: 'Critical' },
  { bloodGroup: 'A+', currentUnits: 162, minThreshold: 40, maxCapacity: 220, lastUpdated: '4 minutes ago', status: 'Healthy' },
  { bloodGroup: 'A-', currentUnits: 124, minThreshold: 15, maxCapacity: 160, lastUpdated: '8 minutes ago', status: 'Approaching' },
  { bloodGroup: 'B+', currentUnits: 158, minThreshold: 30, maxCapacity: 220, lastUpdated: '15 minutes ago', status: 'Healthy' },
  { bloodGroup: 'B-', currentUnits: 115, minThreshold: 10, maxCapacity: 150, lastUpdated: '22 minutes ago', status: 'Approaching' },
  { bloodGroup: 'AB+', currentUnits: 138, minThreshold: 15, maxCapacity: 180, lastUpdated: '30 minutes ago', status: 'Approaching' },
  { bloodGroup: 'AB-', currentUnits: 28, minThreshold: 8, maxCapacity: 60, lastUpdated: '45 minutes ago', status: 'Critical' },
];

export const INITIAL_PROFILE: NgoProfile = {
  id: 'NGO-OD-9021',
  name: 'Odisha Red Cross Society — Central Blood Bank',
  registrationNumber: 'REG-OD-2018-9021',
  licenseNumber: 'NGO-OD-9021',
  email: 'director@odisharedcrossblood.org',
  phone: '+91 674 239 1441',
  address: 'Red Cross Bhawan, Unit-9, Sachivalaya Marg',
  city: 'Bhubaneswar',
  state: 'Odisha',
  pincode: '751022',
  adminName: 'Dr. Jagadish Mohapatra',
  verificationStatus: 'verified',
  operatingHours: '24x7 State Emergency Cold Chain Operations',
  emergencyHotline: '1800-345-6789',
  isEmergencyMode: false,
};

export const INITIAL_SOS_ALERT: SosAlert = {
  id: 'SOS-OD-2026-004',
  isActive: false,
  bloodGroup: 'O-',
  requiredUnits: 15,
  availableUnits: 8,
  shortageUnits: 7,
  hospitalName: 'Apollo Hospitals Bhubaneswar',
  requiredBy: '8:00 PM Today',
  message: 'Mass casualty trauma accident near Janpath corridor. Critical shortage for uncrossmatched O- universal donor units.',
  activatedAt: '',
  activatedBy: '',
  notifiedHospitals: 6,
  notifiedNgos: 5,
};

// Generate 105 realistic sample blood units in Odisha
export function generateInitialBloodUnits(): BloodUnit[] {
  const units: BloodUnit[] = [];
  const groups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components = ['Whole Blood', 'Packed RBC', 'Fresh Frozen Plasma', 'Platelets'] as const;
  const racks = [
    'Refrigerator A / Rack 01',
    'Refrigerator A / Rack 02',
    'Refrigerator A / Rack 03',
    'Refrigerator B / Rack 01',
    'Refrigerator B / Rack 02',
    'Cryo Vault / Rack 04',
    'Agitator Unit 01'
  ];
  
  // Specific reference units
  units.push({
    id: 'BL-IND-0001842',
    bloodGroup: 'O+',
    rhFactor: '+',
    component: 'Packed RBC',
    collectionDate: '15 Sep 2026',
    expiryDate: '27 Oct 2026',
    donorId: 'DNR-88291-MOHANTY',
    collectionCenter: 'LifeFlow Red Cross Camp - Master Canteen Square, Bhubaneswar',
    storageLocation: 'Refrigerator A / Rack 03',
    status: 'Available',
    volumeMl: 450,
    lastUpdated: '12 seconds ago',
    lifecycle: [
      { timestamp: '15 Sep 2026 09:30 AM', action: 'Collected from Voluntary Donor', performedBy: 'Nurse Sunita Jena', location: 'Mobile Blood Van Master Canteen' },
      { timestamp: '15 Sep 2026 12:15 PM', action: 'Serological Screening & NAT Cleared', performedBy: 'Lab Tech Subrat Pattnaik', notes: 'HIV, HBV, HCV, Syphilis, Malaria non-reactive' },
      { timestamp: '15 Sep 2026 01:45 PM', action: 'Component Separation: PRBC Extracted', performedBy: 'Lab Tech Subrat Pattnaik', notes: '450 ml ACD-A preservation' },
      { timestamp: '15 Sep 2026 02:30 PM', action: 'Barcode Tagged & Placed in Cold Chain', performedBy: 'Rahul Sharma (Inventory)', location: 'Refrigerator A / Rack 03' },
    ]
  });

  units.push({
    id: 'BL-IND-0001843',
    bloodGroup: 'O-',
    rhFactor: '-',
    component: 'Whole Blood',
    collectionDate: '12 Sep 2026',
    expiryDate: '24 Oct 2026',
    donorId: 'DNR-55102-ROHIT',
    collectionCenter: 'Red Cross Bhawan Main Facility, Unit-9, Bhubaneswar',
    storageLocation: 'Refrigerator B / Rack 01',
    status: 'Reserved',
    destinationHospital: 'Apollo Hospitals Bhubaneswar',
    volumeMl: 350,
    lastUpdated: '15 minutes ago',
    lifecycle: [
      { timestamp: '12 Sep 2026 10:00 AM', action: 'Collected from Donor', performedBy: 'Nurse Anita Sahoo', location: 'Unit-9 Center' },
      { timestamp: '12 Sep 2026 03:00 PM', action: 'Testing Passed & Tagged', performedBy: 'Subrat Pattnaik' },
      { timestamp: '15 Sep 2026 11:20 AM', action: 'Reserved for Requisition #REQ-10492', performedBy: 'Priya Nair (Dispatch)' },
    ]
  });

  // Expiring soon test units
  units.push({
    id: 'BL-IND-0001844',
    bloodGroup: 'A+',
    rhFactor: '+',
    component: 'Platelets',
    collectionDate: '11 Sep 2026',
    expiryDate: '18 Sep 2026', // 3 days remaining
    donorId: 'DNR-33412-RAVI',
    collectionCenter: 'KIIT University Campus 6 Blood Camp, Patia',
    storageLocation: 'Agitator Unit 01',
    status: 'Available',
    volumeMl: 250,
    lastUpdated: '1 hour ago',
    lifecycle: [
      { timestamp: '11 Sep 2026 02:00 PM', action: 'Apheresis Collection', performedBy: 'Dr. Jagadish Mohapatra' },
      { timestamp: '11 Sep 2026 05:00 PM', action: 'Stored in Agitator at 22°C', performedBy: 'Rahul Sharma' },
    ]
  });

  units.push({
    id: 'BL-IND-0001845',
    bloodGroup: 'B-',
    rhFactor: '-',
    component: 'Packed RBC',
    collectionDate: '25 Aug 2026',
    expiryDate: '21 Sep 2026', // 6 days remaining
    donorId: 'DNR-99812-POOJA',
    collectionCenter: 'Utkal University Vani Vihar Outreach Drive',
    storageLocation: 'Refrigerator B / Rack 02',
    status: 'Available',
    volumeMl: 450,
    lastUpdated: '2 hours ago',
    lifecycle: [
      { timestamp: '25 Aug 2026 11:00 AM', action: 'Collection & Storage', performedBy: 'Rahul Sharma' }
    ]
  });

  units.push({
    id: 'BL-IND-0001846',
    bloodGroup: 'AB-',
    rhFactor: '-',
    component: 'Packed RBC',
    collectionDate: '20 Aug 2026',
    expiryDate: '25 Sep 2026', // 10 days remaining
    donorId: 'DNR-10293-MANOJ',
    collectionCenter: 'Ravenshaw University Heritage Camp, Cuttack',
    storageLocation: 'Refrigerator A / Rack 01',
    status: 'Available',
    volumeMl: 450,
    lastUpdated: '3 hours ago',
    lifecycle: [
      { timestamp: '20 Aug 2026 09:15 AM', action: 'Collection Verified', performedBy: 'Nurse Sunita' }
    ]
  });

  // Generate 100 systematic blood units in Odisha centers
  const odishaCenters = [
    'Red Cross Bhawan Main Facility, Unit-9, Bhubaneswar',
    'KIIT University Campus 6 Blood Camp, Patia',
    'Utkal University Vani Vihar Outreach Drive',
    'Master Canteen Square Mobile Collection Unit',
    'Ravenshaw University Heritage Camp, Cuttack',
    'AIIMS Regional Outreach Van, Sijua'
  ];

  for (let i = 1; i <= 100; i++) {
    const numStr = (1850 + i).toString().padStart(7, '0');
    const bg = groups[i % groups.length];
    const comp = components[i % components.length];
    const rack = racks[i % racks.length];
    const isRhPos = bg.endsWith('+');
    const center = odishaCenters[i % odishaCenters.length];
    
    // Status distribution
    let status: BloodUnit['status'] = 'Available';
    if (i % 17 === 0) status = 'Reserved';
    else if (i % 23 === 0) status = 'Dispatched';
    else if (i % 47 === 0) status = 'Quarantined';

    // Dates
    const collDay = (i % 25) + 1;
    const expDay = (i % 28) + 1;
    const expMonth = (i % 3 === 0) ? 'Sep' : (i % 3 === 1 ? 'Oct' : 'Nov');
    
    units.push({
      id: `BL-IND-${numStr}`,
      bloodGroup: bg,
      rhFactor: isRhPos ? '+' : '-',
      component: comp,
      collectionDate: `${collDay} Aug 2026`,
      expiryDate: `${expDay} ${expMonth} 2026`,
      donorId: `DNR-${(70000 + i)}-ODI`,
      collectionCenter: center,
      storageLocation: rack,
      status,
      volumeMl: comp === 'Platelets' ? 250 : (comp === 'Fresh Frozen Plasma' ? 200 : 450),
      lastUpdated: `${(i % 55) + 1} mins ago`,
      lifecycle: [
        {
          timestamp: `${collDay} Aug 2026 10:00 AM`,
          action: 'Donation Registered',
          performedBy: 'Staff Member',
          location: center
        },
        {
          timestamp: `${collDay} Aug 2026 01:30 PM`,
          action: 'Quality Testing & Viral Marker Cleared',
          performedBy: 'Odisha SBTC Laboratory Team'
        },
        {
          timestamp: `${collDay} Aug 2026 03:00 PM`,
          action: 'Stored in Cold Chain Rack',
          performedBy: 'Inventory Specialist',
          location: rack
        }
      ]
    });
  }

  return units;
}

export const INITIAL_HOSPITALS: ConnectedHospital[] = [
  {
    id: 'hosp-bbsr-apollo',
    name: 'Apollo Hospitals Bhubaneswar',
    location: 'Plot No. 251, Sainik School Road, Unit 15',
    city: 'Bhubaneswar',
    distanceKm: 3.8,
    contactPerson: 'Dr. Vivek Mehra (Transfusion Medicine)',
    phone: '0674-6661016',
    emergencyPhone: '0674-6661066',
    bloodRequirements: ['O-', 'B+', 'A+'],
    currentRequestStatus: 'Active',
    lastShipment: 'Today, 11:15 AM',
    connectionStatus: 'Emergency',
    coordinates: { lat: 20.3082, lng: 85.8340 }
  },
  {
    id: 'hosp-bbsr-aiims',
    name: 'AIIMS Bhubaneswar',
    location: 'Sijua, Patia',
    city: 'Bhubaneswar',
    distanceKm: 5.2,
    contactPerson: 'Dr. S. K. Gupta (Trauma & Blood Bank)',
    phone: '0674-2476001',
    emergencyPhone: '0674-2476000',
    bloodRequirements: ['O-', 'AB-', 'B-'],
    currentRequestStatus: 'Active',
    lastShipment: '2 days ago',
    connectionStatus: 'Connected',
    coordinates: { lat: 20.2961, lng: 85.8245 }
  },
  {
    id: 'hosp-ctk-scb',
    name: 'SCB Medical College & Hospital',
    location: 'Mangalabag',
    city: 'Cuttack',
    distanceKm: 24.5,
    contactPerson: 'Dr. R. K. Nayak (Professor & HOD Transfusion)',
    phone: '0671-2414004',
    emergencyPhone: '0671-2414005',
    bloodRequirements: ['A+', 'O+'],
    currentRequestStatus: 'Active',
    lastShipment: 'Yesterday, 04:30 PM',
    connectionStatus: 'Connected',
    coordinates: { lat: 20.4682, lng: 85.8793 }
  },
  {
    id: 'hosp-bbsr-capital',
    name: 'Capital Hospital Bhubaneswar',
    location: 'Unit 6, Ganga Nagar',
    city: 'Bhubaneswar',
    distanceKm: 2.1,
    contactPerson: 'Dr. Radhika Nair (Blood Centre Officer)',
    phone: '0674-2391983',
    emergencyPhone: '0674-2391980',
    bloodRequirements: ['O+', 'B+'],
    currentRequestStatus: 'None',
    lastShipment: 'Today, 05:15 PM',
    connectionStatus: 'Connected',
    coordinates: { lat: 20.2642, lng: 85.8285 }
  },
  {
    id: 'hosp-bbsr-kims',
    name: 'KIMS Hospital & Medical College',
    location: 'KIIT Campus 5, Patia',
    city: 'Bhubaneswar',
    distanceKm: 7.4,
    contactPerson: 'Dr. Manish Sharma',
    phone: '0674-7105300',
    emergencyPhone: '0674-7105305',
    bloodRequirements: ['B+', 'AB-'],
    currentRequestStatus: 'Pending',
    lastShipment: '15 Sep, 09:00 AM',
    connectionStatus: 'Connected',
    coordinates: { lat: 20.3540, lng: 85.8180 }
  },
  {
    id: 'hosp-bbsr-sum',
    name: 'SUM Ultimate Medicare',
    location: 'Kalinga Nagar, Ghatikia',
    city: 'Bhubaneswar',
    distanceKm: 8.6,
    contactPerson: 'Dr. Neha Verma',
    phone: '0674-2380800',
    emergencyPhone: '0674-2380888',
    bloodRequirements: ['AB+', 'O+'],
    currentRequestStatus: 'None',
    lastShipment: '3 days ago',
    connectionStatus: 'Connected',
    coordinates: { lat: 20.2760, lng: 85.8450 }
  }
];

export const INITIAL_REQUESTS: HospitalRequest[] = [
  {
    id: 'REQ-10492',
    hospitalId: 'hosp-bbsr-apollo',
    hospitalName: 'Apollo Hospitals Bhubaneswar',
    bloodGroup: 'O-',
    component: 'Packed RBC',
    requiredUnits: 8,
    priority: 'CRITICAL',
    requiredBy: '7:30 PM Today',
    location: 'Sainik School Road, Unit 15, Bhubaneswar',
    contactPhone: '0674-6661066',
    status: 'Pending',
    urgencyReason: 'Mass trauma incident near Janpath corridor - uncrossmatched emergency surgery',
    notes: 'Please dispatch via rapid cold-chain transport with active temperature logger.',
    createdAt: '15 Sep 2026 06:15 PM'
  },
  {
    id: 'REQ-10493',
    hospitalId: 'hosp-ctk-scb',
    hospitalName: 'SCB Medical College & Hospital',
    bloodGroup: 'A+',
    component: 'Whole Blood',
    requiredUnits: 4,
    priority: 'HIGH',
    requiredBy: '9:00 PM Today',
    location: 'Mangalabag, Cuttack',
    contactPhone: '0671-2414005',
    status: 'Accepted',
    urgencyReason: 'Scheduled emergency cardiothoracic bypass procedure at 10 PM',
    notes: 'Cardiothoracic OT requisitions.',
    createdAt: '15 Sep 2026 05:40 PM'
  },
  {
    id: 'REQ-10494',
    hospitalId: 'hosp-bbsr-aiims',
    hospitalName: 'AIIMS Bhubaneswar',
    bloodGroup: 'B+',
    component: 'Platelets',
    requiredUnits: 6,
    priority: 'NORMAL',
    requiredBy: '11:00 PM Today',
    location: 'Sijua, Patia, Bhubaneswar',
    contactPhone: '0674-2476000',
    status: 'Preparing',
    urgencyReason: 'Thalassemia and pediatric oncological transfusion ward replenishment',
    createdAt: '15 Sep 2026 04:20 PM'
  },
  {
    id: 'REQ-10495',
    hospitalId: 'hosp-bbsr-kims',
    hospitalName: 'KIMS Hospital & Medical College',
    bloodGroup: 'AB-',
    component: 'Packed RBC',
    requiredUnits: 2,
    priority: 'HIGH',
    requiredBy: '8:45 PM Today',
    location: 'KIIT Campus 5, Patia, Bhubaneswar',
    contactPhone: '0674-7105305',
    status: 'Pending',
    urgencyReason: 'Rare blood group pediatric emergency ICU cardiac procedure',
    createdAt: '15 Sep 2026 06:00 PM'
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-1032',
    requestId: 'REQ-10488',
    hospitalId: 'hosp-bbsr-capital',
    hospitalName: 'Capital Hospital Bhubaneswar',
    destination: 'Unit 6, Ganga Nagar, Bhubaneswar',
    origin: 'Odisha Red Cross Central Storage, Unit-9',
    bloodGroup: 'O+',
    units: 5,
    unitIds: ['BL-IND-0001850', 'BL-IND-0001851', 'BL-IND-0001852', 'BL-IND-0001853', 'BL-IND-0001854'],
    courier: 'LifeFlow Odisha MedExpress Fleet',
    driverName: 'Bikram Mohanty',
    driverContact: '+91 94370 12345',
    vehicleNumber: 'OD-02-AK-4821 (Cold Van)',
    estimatedArrival: 'Delivered at 05:15 PM',
    distanceRemainingKm: 0,
    currentLocationName: 'Delivered at Hospital Blood Bank Dock',
    status: 'Delivered',
    routeProgress: 100,
    timeline: [
      { time: '04:10 PM', status: 'Order Dispatched', note: 'Boxes packed in insulated active cooling crate at 4.2°C' },
      { time: '04:25 PM', status: 'In Transit', note: 'Cleared Rajmahal Square junction' },
      { time: '04:55 PM', status: 'Arrived at Facility', note: 'Driver reached Capital Hospital Gate 1' },
      { time: '05:15 PM', status: 'Delivered', note: 'Acknowledged by Dr. Radhika Nair' }
    ],
    createdAt: '15 Sep 2026 04:00 PM'
  },
  {
    id: 'SHP-1033',
    requestId: 'REQ-10490',
    hospitalId: 'hosp-bbsr-apollo',
    hospitalName: 'Apollo Hospitals Bhubaneswar',
    destination: 'Sainik School Road, Unit 15, Bhubaneswar',
    origin: 'Odisha Red Cross Central Storage, Unit-9',
    bloodGroup: 'O-',
    units: 3,
    unitIds: ['BL-IND-0001843', 'BL-IND-0001858', 'BL-IND-0001859'],
    courier: 'LifeFlow Rapid Response Van',
    driverName: 'Ramesh Singh',
    driverContact: '+91 94371 67890',
    vehicleNumber: 'OD-02-EV-9012 (LifeFlow EV)',
    estimatedArrival: '07:10 PM (18 mins away)',
    distanceRemainingKm: 3.2,
    currentLocationName: 'Acharya Vihar Flyover (Northbound)',
    status: 'In Transit',
    routeProgress: 68,
    timeline: [
      { time: '06:30 PM', status: 'Order Packed', note: '3 units O- sealed in CryoPack container CP-882' },
      { time: '06:42 PM', status: 'Picked Up by Driver', note: 'Ramesh Singh verified custody transfer' },
      { time: '06:50 PM', status: 'In Transit', note: 'Traveling along Sachivalaya Marg & Nandankanan corridor' }
    ],
    createdAt: '15 Sep 2026 06:25 PM'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '10:42 AM',
    action: 'Blood Unit BL-IND-0001842 added',
    bloodGroup: 'O+',
    quantity: 1,
    user: 'Rahul Sharma (Inventory)',
    details: 'Barcoded PRBC unit registered into Unit-9 Refrigerator A / Rack 03',
    type: 'add'
  },
  {
    id: 'LOG-002',
    timestamp: '11:15 AM',
    action: 'Shipment SHP-1033 created',
    bloodGroup: 'O-',
    quantity: 3,
    user: 'Priya Nair (Dispatch)',
    details: 'Emergency cold-chain transit dispatched to Apollo Hospitals Bhubaneswar',
    type: 'dispatch'
  },
  {
    id: 'LOG-003',
    timestamp: '12:03 PM',
    action: 'Inventory manually adjusted',
    bloodGroup: 'B+',
    quantity: -2,
    user: 'Dr. Jagadish Mohapatra',
    details: 'Reason: Damaged seals during centrifuge handling - written off',
    type: 'remove'
  },
  {
    id: 'LOG-004',
    timestamp: '01:45 PM',
    action: 'Low-stock threshold check triggered',
    bloodGroup: 'O-',
    user: 'Odisha SBTC System Watchdog',
    details: 'O- available stock dropped below safety threshold (8 < 20 units)',
    type: 'threshold'
  },
  {
    id: 'LOG-005',
    timestamp: '03:10 PM',
    action: 'Hospital Requisition REQ-10492 received',
    bloodGroup: 'O-',
    quantity: 8,
    user: 'Apollo Hospitals Bhubaneswar Bridge',
    details: 'Critical trauma request broadcasted across Bhubaneswar corridor',
    type: 'update'
  },
  {
    id: 'LOG-006',
    timestamp: '05:15 PM',
    action: 'Shipment SHP-1032 verified delivered',
    bloodGroup: 'O+',
    quantity: 5,
    user: 'Bikram Mohanty (Logistics)',
    details: 'Delivery confirmation receipt signed at Capital Hospital Bhubaneswar Blood Bank dock',
    type: 'dispatch'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Critical Stock Alert (Odisha)',
    message: 'O- stock has fallen below the safety threshold (8 units remaining, minimum 20 required).',
    timestamp: '10 minutes ago',
    read: false,
    category: 'Inventory',
    urgency: 'critical',
    actionLink: 'inventory'
  },
  {
    id: 'NOTIF-2',
    title: 'Urgent Hospital Requisition',
    message: 'Apollo Hospitals Bhubaneswar requested 8 units of O- for critical trauma surgery.',
    timestamp: '25 minutes ago',
    read: false,
    category: 'Hospital Requests',
    urgency: 'critical',
    actionLink: 'requests'
  },
  {
    id: 'NOTIF-3',
    title: 'Shipment In Transit',
    message: 'Shipment SHP-1033 is 3.2 km away from Apollo Hospitals Bhubaneswar (ETA 18 mins).',
    timestamp: '35 minutes ago',
    read: true,
    category: 'Shipments',
    urgency: 'medium',
    actionLink: 'shipments'
  },
  {
    id: 'NOTIF-4',
    title: 'Expiring Blood Units Warning',
    message: '3 blood units (A+, B-, AB-) will expire within the next 7 days. Prioritize for dispatch.',
    timestamp: '1 hour ago',
    read: false,
    category: 'Expiry',
    urgency: 'high',
    actionLink: 'blood-units'
  },
  {
    id: 'NOTIF-5',
    title: 'Barcode Unit Added',
    message: 'New O+ blood unit BL-IND-0001842 registered into Refrigerator A / Rack 03.',
    timestamp: '2 hours ago',
    read: true,
    category: 'Inventory',
    urgency: 'low',
    actionLink: 'inventory'
  },
  {
    id: 'NOTIF-6',
    title: 'Successful Delivery',
    message: 'Shipment SHP-1032 with 5 O+ units delivered to Capital Hospital Bhubaneswar.',
    timestamp: '3 hours ago',
    read: true,
    category: 'Shipments',
    urgency: 'low',
    actionLink: 'shipments'
  }
];

export const INITIAL_NGO_NETWORK: NgoNetworkPeer[] = [
  {
    id: 'PEER-01',
    name: 'Ama Odisha Voluntary Blood Network',
    location: 'Saheed Nagar, Bhubaneswar',
    city: 'Bhubaneswar',
    distanceKm: 3.2,
    availableGroups: [
      { group: 'O+', units: 165, status: 'Healthy' },
      { group: 'A+', units: 120, status: 'Approaching' },
      { group: 'B+', units: 140, status: 'Approaching' },
      { group: 'O-', units: 45, status: 'Critical' },
    ],
    contact: 'Dr. Sameer Kapoor',
    phone: '0674-254 8821',
    lastSync: '2 minutes ago',
    verified: true,
  },
  {
    id: 'PEER-02',
    name: 'Samarpan Blood Centre Cuttack',
    location: 'Mangalabag, Cuttack',
    city: 'Cuttack',
    distanceKm: 22.8,
    availableGroups: [
      { group: 'O+', units: 170, status: 'Healthy' },
      { group: 'B+', units: 110, status: 'Approaching' },
      { group: 'O-', units: 35, status: 'Critical' },
      { group: 'AB-', units: 18, status: 'Critical' },
    ],
    contact: 'Sister Monica Joseph',
    phone: '0671-236 4512',
    lastSync: '5 minutes ago',
    verified: true,
  },
  {
    id: 'PEER-03',
    name: 'Rotary Club of Bhubaneswar Blood Bank',
    location: 'Chandrasekharpur, Bhubaneswar',
    city: 'Bhubaneswar',
    distanceKm: 6.5,
    availableGroups: [
      { group: 'O+', units: 180, status: 'Healthy' },
      { group: 'A+', units: 160, status: 'Healthy' },
      { group: 'AB+', units: 125, status: 'Approaching' },
      { group: 'A-', units: 48, status: 'Critical' },
    ],
    contact: 'Rajesh Singhania',
    phone: '0674-230 1122',
    lastSync: '8 minutes ago',
    verified: true,
  },
  {
    id: 'PEER-04',
    name: 'Kalinga Voluntary Relief Trust',
    location: 'Khandagiri, Bhubaneswar',
    city: 'Bhubaneswar',
    distanceKm: 9.0,
    availableGroups: [
      { group: 'B+', units: 155, status: 'Healthy' },
      { group: 'A+', units: 130, status: 'Approaching' },
      { group: 'O-', units: 28, status: 'Critical' },
    ],
    contact: 'Kavita Chhibber',
    phone: '0674-235 9904',
    lastSync: '15 minutes ago',
    verified: true,
  },
  {
    id: 'PEER-05',
    name: 'Rourkela Voluntary Blood Society',
    location: 'Sector 19, Rourkela',
    city: 'Rourkela',
    distanceKm: 310.0,
    availableGroups: [
      { group: 'O+', units: 172, status: 'Healthy' },
      { group: 'A+', units: 142, status: 'Approaching' },
      { group: 'B+', units: 118, status: 'Approaching' },
      { group: 'O-', units: 32, status: 'Critical' },
    ],
    contact: 'Operations Dispatch Desk',
    phone: '0661-240 1842',
    lastSync: 'Live',
    verified: true,
  }
];

export const INITIAL_STAFF: StaffUser[] = [
  {
    id: 'STF-01',
    name: 'Dr. Jagadish Mohapatra',
    email: 'director@odisharedcrossblood.org',
    role: 'NGO Administrator',
    permissions: ['all_permissions', 'manage_users', 'emergency_sos', 'approve_transfers', 'modify_thresholds'],
    status: 'active',
    lastActive: 'Online now'
  },
  {
    id: 'STF-02',
    name: 'Rahul Mohanty',
    email: 'rahul.m@odisharedcrossblood.org',
    role: 'Inventory Manager',
    permissions: ['view_inventory', 'add_blood_units', 'remove_blood_units', 'scan_barcodes', 'mark_damaged'],
    status: 'active',
    lastActive: '12 seconds ago'
  },
  {
    id: 'STF-03',
    name: 'Priya Nayak',
    email: 'priya.n@odisharedcrossblood.org',
    role: 'Dispatch Manager',
    permissions: ['view_requests', 'create_shipments', 'assign_drivers', 'update_shipment_status'],
    status: 'active',
    lastActive: '15 minutes ago'
  },
  {
    id: 'STF-04',
    name: 'Subrat Pattnaik',
    email: 'subrat.p@odisharedcrossblood.org',
    role: 'Staff',
    permissions: ['view_inventory', 'scan_barcodes', 'view_requests'],
    status: 'active',
    lastActive: '1 hour ago'
  },
  {
    id: 'STF-05',
    name: 'Dr. Alok Nath',
    email: 'alok.nath@lifeflow.org',
    role: 'Super Admin',
    permissions: ['super_admin_full_access'],
    status: 'active',
    lastActive: 'Today at 09:00 AM'
  }
];
