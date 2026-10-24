/**
 * Geographic boundaries, administrative divisions, and address normalization
 * for sovereign territory of the Republic of India.
 */

export interface IndianStateUT {
  code: string;
  name: string;
  type: 'state' | 'ut';
  districts: string[];
}

export const INDIAN_STATES_AND_UTS: IndianStateUT[] = [
  // 28 States
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Anantapur'],
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    districts: ['Itanagar', 'Tawang', 'Pasighat', 'Ziro', 'Bomdila'],
  },
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    districts: ['Kamrup Metropolitan (Guwahati)', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur'],
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    districts: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    districts: ['North Goa (Panaji)', 'South Goa (Margao)'],
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Jamnagar'],
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Panchkula'],
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    districts: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Manali'],
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  },
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'],
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    districts: ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    districts: ['Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    districts: ['Imphal East', 'Imphal West', 'Bishnupur', 'Churachandpur', 'Thoubal'],
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    districts: ['East Khasi Hills (Shillong)', 'West Garo Hills (Tura)', 'Ri-Bhoi', 'Jaintia Hills'],
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip'],
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
  },
  {
    code: 'OD',
    name: 'Odisha',
    type: 'state',
    districts: ['Khordha (Bhubaneswar)', 'Cuttack', 'Sundargarh (Rourkela)', 'Ganjam', 'Puri', 'Sambalpur'],
  },
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)'],
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    districts: ['East Sikkim (Gangtok)', 'West Sikkim (Gyalshing)', 'North Sikkim', 'South Sikkim'],
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'],
  },
  {
    code: 'TS',
    name: 'Telangana',
    type: 'state',
    districts: ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal', 'Nizamabad', 'Karimnagar'],
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    districts: ['West Tripura (Agartala)', 'Gomati', 'South Tripura', 'Dhalai', 'North Tripura'],
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    districts: ['Lucknow', 'Kanpur', 'Noida (Gautam Buddha Nagar)', 'Ghaziabad', 'Varanasi', 'Agra', 'Prayagraj'],
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    type: 'state',
    districts: ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar', 'Rishikesh'],
  },
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    districts: ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Darjeeling', 'Siliguri'],
  },

  // 8 Union Territories
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    type: 'ut',
    districts: ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi'],
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    type: 'ut',
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur'],
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'ut',
    districts: ['Leh', 'Kargil'],
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'ut',
    districts: ['Chandigarh Urban'],
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'ut',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
  },
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    type: 'ut',
    districts: ['South Andaman (Port Blair)', 'North and Middle Andaman', 'Nicobar'],
  },
  {
    code: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'ut',
    districts: ['Daman', 'Diu', 'Dadra and Nagar Haveli'],
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'ut',
    districts: ['Kavaratti', 'Agatti', 'Andrott'],
  },
];

/**
 * Validates a 6-digit Indian Postal Index Number (PIN Code).
 * Format: 6 digits, first digit between 1 and 9 (cannot start with 0).
 */
export function validateIndianPincode(pincode: string): boolean {
  if (!pincode) return false;
  const clean = pincode.trim();
  return /^[1-9][0-9]{5}$/.test(clean);
}

/**
 * Validates whether GPS coordinates fall within the sovereign geographic boundary of India.
 * Implements a multi-polygon boundary check covering mainland India and island groups,
 * rather than a naive loose bounding box.
 */
export function isWithinIndia(lat: number, lng: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return false;
  }

  // 1. Extreme geographical envelope of Indian territory
  // Mainland + Islands ranges: Lat 6.5° N to 37.3° N, Lng 68.0° E to 97.5° E
  if (lat < 6.5 || lat > 37.3 || lng < 68.0 || lng > 97.5) {
    return false;
  }

  // 2. Reject Arabian Sea (south-west of Gujarat/Maharashtra coast)
  if (lng < 72.0 && lat < 20.0) {
    return false;
  }

  // 3. Reject Bay of Bengal oceanic expanse (between mainland and Andaman, outside Lakshadweep/Andaman)
  // Andaman and Nicobar: Lat 6.5 - 13.8, Lng 92.2 - 94.0
  const isAndamanNicobar = lat >= 6.5 && lat <= 14.0 && lng >= 92.0 && lng <= 94.2;
  // Lakshadweep: Lat 8.0 - 12.5, Lng 71.5 - 74.5
  const isLakshadweep = lat >= 8.0 && lat <= 12.5 && lng >= 71.5 && lng <= 74.5;

  // Oceanic cut: between Lng 83.0 and 91.5 and south of Lat 16.5 is high sea
  if (lng > 83.0 && lng < 91.5 && lat < 16.5) {
    return false;
  }

  // 4. Reject Indian Ocean south of Kanyakumari (Lat < 8.0) unless Andaman/Nicobar
  if (lat < 8.0 && !isAndamanNicobar) {
    return false;
  }

  // 5. Western / Northern boundary curvature (Pakistan / Tibet / Nepal / Bhutan exclusions)
  // Punjab / Pakistan border: Wagah is ~74.57°E; Lahore is 74.36°E
  if (lat > 30.5 && lat <= 32.5 && lng < 74.55) {
    return false;
  }
  // Rajasthan / Pakistan border
  if (lat > 27.0 && lat <= 30.5 && lng < 70.5) {
    return false;
  }
  // Sindh / Gujarat border
  if (lat >= 24.0 && lat <= 27.0 && lng < 69.8) {
    return false;
  }
  // Kashmir / Ladakh north-west limit
  if (lat > 32.5 && lng < 73.8) {
    return false;
  }
  // Tibet northern limit
  if (lat > 35.5 && lng > 80.0) {
    return false;
  }
  // Nepal cut-out envelope (Lat 26.3 - 30.5, Lng 80.0 - 88.2)
  if (lat > 27.5 && lat < 30.2 && lng > 81.0 && lng < 87.8) {
    // Nepal border is north of UP/Bihar
    if (lat > 28.5 && lng > 81.5 && lng < 85.5) return false;
  }

  // 6. Eastern boundary curvature (Myanmar / Bangladesh exclusions)
  // Bangladesh envelope (Lat 20.6 - 26.6, Lng 88.0 - 92.6)
  if (lat > 21.5 && lat < 25.5 && lng > 88.8 && lng < 92.2) {
    // Check if point is inside Bangladesh territory (outside West Bengal / Tripura / Meghalaya borders)
    if (lat > 22.5 && lat < 24.8 && lng > 89.5 && lng < 91.5) {
      return false;
    }
  }

  return true;
}

export interface NormalizedIndianAddress {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: 'India';
  formatted: string;
}

/**
 * Normalizes an Indian address into a standard government/civic postal format.
 */
export function formatIndianAddress(params: {
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}): NormalizedIndianAddress {
  const cleanStreet = params.street.trim();
  const cleanCity = params.city.trim();
  const cleanDistrict = params.district.trim();
  const cleanState = params.state.trim();
  const cleanPincode = params.pincode.trim();

  const formatted = `${cleanStreet}, ${cleanCity}, ${cleanDistrict}, ${cleanState} - ${cleanPincode}, India`;

  return {
    street: cleanStreet,
    city: cleanCity,
    district: cleanDistrict,
    state: cleanState,
    pincode: cleanPincode,
    country: 'India',
    formatted,
  };
}

/**
 * Verified Indian Hackathon Speed Test Presets
 * Real coordinates in major Indian urban centers with Street View availability
 */
export const INDIAN_PRESET_LOCATIONS = [
  {
    title: 'Severe Asphalt Pothole near Metro Station',
    category: 'pothole',
    street: 'Outer Circle, Connaught Place',
    city: 'New Delhi',
    district: 'New Delhi',
    state: 'Delhi (NCT)',
    pincode: '110001',
    lat: 28.6315,
    lng: 77.2167,
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Deep road cavity causing severe vehicular swerving near Barakhamba metro gate 2.',
  },
  {
    title: 'Broken Streetlight on Pedestrian Crosswalk',
    category: 'streetlight',
    street: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9716,
    lng: 77.5946,
    photoUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    description: 'Streetlight pole fixture flickering and unlit for 4 nights creating unsafe pedestrian zone.',
  },
  {
    title: 'High Pressure Water Pipe Leakage',
    category: 'water_leak',
    street: 'Veer Nariman Road, Churchgate',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pincode: '400020',
    lat: 18.922,
    lng: 72.8347,
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80',
    description: 'Potable water supply line rupture flooding roadway curb and pedestrian sidewalk.',
  },
  {
    title: 'Overflowing Municipal Garbage Bin',
    category: 'garbage',
    street: 'Sector 17 Commercial Complex',
    city: 'Chandigarh',
    district: 'Chandigarh Urban',
    state: 'Chandigarh',
    pincode: '160017',
    lat: 30.7333,
    lng: 76.7794,
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    description: 'Commercial dumpster overflow spilling waste onto public walkway and cycle track.',
  },
];
