export interface RegionalCenter {
  city: string;
  state: string;
  regionKey: string;
  facilityName: string;
  facilityLicense: string;
  hubAddress: string;
  adminName: string;
  inventoryManager: string;
  dispatchManager: string;
  emergencyHotline: string;
  primaryHospitals: string[];
}

export const ODISHA_REGIONAL_CENTERS: Record<string, RegionalCenter> = {
  'Bhubaneswar, Odisha': {
    city: 'Bhubaneswar',
    state: 'Odisha',
    regionKey: 'Bhubaneswar, Odisha',
    facilityName: 'Odisha Red Cross Society — Central Blood Bank',
    facilityLicense: 'NGO-OD-9021',
    hubAddress: 'Red Cross Bhawan, Unit-9, Sachivalaya Marg, Bhubaneswar',
    adminName: 'Dr. Jagadish Mohapatra',
    inventoryManager: 'Rahul Mohanty',
    dispatchManager: 'Priya Nayak',
    emergencyHotline: '0674-2391441',
    primaryHospitals: [
      'Apollo Hospitals Bhubaneswar',
      'AIIMS Bhubaneswar',
      'Capital Hospital Bhubaneswar',
      'KIMS Hospital',
      'SUM Ultimate Medicare'
    ]
  },
  'Cuttack, Odisha': {
    city: 'Cuttack',
    state: 'Odisha',
    regionKey: 'Cuttack, Odisha',
    facilityName: 'SCB Medical College & Central Blood Centre',
    facilityLicense: 'NGO-OD-8812',
    hubAddress: 'Mangalabag Medical Complex, Cuttack',
    adminName: 'Dr. Bijay Kumar Dash',
    inventoryManager: 'Tanmay Tripathy',
    dispatchManager: 'Sanjib Panda',
    emergencyHotline: '0671-2414004',
    primaryHospitals: [
      'SCB Medical College & Hospital',
      'Shanti Memorial Hospital',
      'Acharya Harihar Regional Cancer Centre',
      'City Hospital Cuttack'
    ]
  },
  'Rourkela, Odisha': {
    city: 'Rourkela',
    state: 'Odisha',
    regionKey: 'Rourkela, Odisha',
    facilityName: 'Rourkela Voluntary Blood Society & IGH Blood Centre',
    facilityLicense: 'NGO-OD-7724',
    hubAddress: 'Sector 19, Ispat General Hospital Corridor, Rourkela',
    adminName: 'Dr. Ansuman Jena',
    inventoryManager: 'Bikash Mohapatra',
    dispatchManager: 'Anita Sahoo',
    emergencyHotline: '0661-2401842',
    primaryHospitals: [
      'Ispat General Hospital (IGH)',
      'Hi-Tech Medical College Rourkela',
      'Rourkela Government Hospital (RGH)'
    ]
  },
  'Berhampur, Odisha': {
    city: 'Berhampur',
    state: 'Odisha',
    regionKey: 'Berhampur, Odisha',
    facilityName: 'MKCG Medical College Regional Blood Bank',
    facilityLicense: 'NGO-OD-6619',
    hubAddress: 'Medical College Campus, Ganjam, Berhampur',
    adminName: 'Dr. Manas Ranjan Padhy',
    inventoryManager: 'Sudarshan Behera',
    dispatchManager: 'Deepak Panigrahi',
    emergencyHotline: '0680-2292746',
    primaryHospitals: [
      'MKCG Medical College & Hospital',
      'City Hospital Berhampur',
      'Amit Hospital Berhampur'
    ]
  },
  'Sambalpur, Odisha': {
    city: 'Sambalpur',
    state: 'Odisha',
    regionKey: 'Sambalpur, Odisha',
    facilityName: 'VIMSAR Blood Bank & Western Odisha Relief Society',
    facilityLicense: 'NGO-OD-5510',
    hubAddress: 'VSS Institute of Medical Sciences (VIMSAR), Burla, Sambalpur',
    adminName: 'Dr. Pradeep Mishra',
    inventoryManager: 'Rajesh Hota',
    dispatchManager: 'Sunita Meher',
    emergencyHotline: '0663-2430768',
    primaryHospitals: [
      'VIMSAR Burla',
      'District Headquarters Hospital Sambalpur',
      'Sanjeevani Hospital Sambalpur'
    ]
  },
  'Puri, Odisha': {
    city: 'Puri',
    state: 'Odisha',
    regionKey: 'Puri, Odisha',
    facilityName: 'District Red Cross Blood Centre & Jagannath Seva Trust',
    facilityLicense: 'NGO-OD-4402',
    hubAddress: 'Near DHH, Grand Road, Puri',
    adminName: 'Dr. Debabrata Samantray',
    inventoryManager: 'Chandan Mishra',
    dispatchManager: 'Ramesh Pradhan',
    emergencyHotline: '06752-222055',
    primaryHospitals: [
      'District Headquarters Hospital Puri',
      'ECHO Hospital Puri',
      'ID Hospital Puri'
    ]
  }
};

export const DEFAULT_ODISHA_REGION = 'Bhubaneswar, Odisha';

export function getRegionalCenter(region?: string): RegionalCenter {
  if (region && ODISHA_REGIONAL_CENTERS[region]) {
    return ODISHA_REGIONAL_CENTERS[region];
  }
  // Try matching city prefix if full region string was passed differently
  if (region) {
    const clean = region.toLowerCase();
    for (const [key, center] of Object.entries(ODISHA_REGIONAL_CENTERS)) {
      if (clean.includes(center.city.toLowerCase())) {
        return center;
      }
    }
  }
  return ODISHA_REGIONAL_CENTERS[DEFAULT_ODISHA_REGION];
}
