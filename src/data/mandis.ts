// Real AGMARKNET mandis across India with coordinates
// Source: AGMARKNET official mandi registry

export interface Mandi {
  id: string
  name: string
  state: string
  district: string
  latitude: number
  longitude: number
  crops: string[]
  contact?: string
  hours?: string
}

export const MANDIS: Mandi[] = [
  // Andhra Pradesh
  { id: 'guntur', name: 'Guntur Mandi', state: 'Andhra Pradesh', district: 'Guntur', latitude: 16.5833, longitude: 80.4667, crops: ['Groundnut', 'Rice', 'Maize', 'Cotton', 'Tomato'] },
  { id: 'kurnool', name: 'Kurnool Mandi', state: 'Andhra Pradesh', district: 'Kurnool', latitude: 15.8281, longitude: 78.8353, crops: ['Groundnut', 'Cotton', 'Maize', 'Rice'] },
  { id: 'nellore', name: 'Nellore Mandi', state: 'Andhra Pradesh', district: 'Nellore', latitude: 14.4406, longitude: 79.9864, crops: ['Rice', 'Groundnut', 'Cotton'] },
  { id: 'vijayawada', name: 'Vijayawada Mandi', state: 'Andhra Pradesh', district: 'Krishna', latitude: 16.5062, longitude: 80.6270, crops: ['Rice', 'Groundnut', 'Maize'] },
  { id: 'ongole', name: 'Ongole Mandi', state: 'Andhra Pradesh', district: 'Prakasam', latitude: 14.6349, longitude: 79.6705, crops: ['Groundnut', 'Cotton', 'Maize'] },
  { id: 'srikakulam', name: 'Srikakulam Mandi', state: 'Andhra Pradesh', district: 'Srikakulam', latitude: 18.3004, longitude: 84.3356, crops: ['Rice', 'Coconut', 'Cashew'] },

  // Telangana
  { id: 'hyderabad', name: 'Hyderabad Mandi', state: 'Telangana', district: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, crops: ['Maize', 'Cotton', 'Rice', 'Tomato', 'Onion', 'Potato'] },
  { id: 'warangal', name: 'Warangal Mandi', state: 'Telangana', district: 'Warangal', latitude: 17.9689, longitude: 78.6294, crops: ['Cotton', 'Maize', 'Rice', 'Groundnut'] },
  { id: 'nizamabad', name: 'Nizamabad Mandi', state: 'Telangana', district: 'Nizamabad', latitude: 19.2783, longitude: 78.1197, crops: ['Cotton', 'Turmeric', 'Groundnut'] },
  { id: 'karimnagar', name: 'Karimnagar Mandi', state: 'Telangana', district: 'Karimnagar', latitude: 18.4386, longitude: 79.1288, crops: ['Rice', 'Cotton', 'Turmeric'] },
  { id: 'nalgonda', name: 'Nalgonda Mandi', state: 'Telangana', district: 'Nalgonda', latitude: 17.0560, longitude: 78.9734, crops: ['Sugarcane', 'Groundnut', 'Maize'] },

  // Maharashtra
  { id: 'pune', name: 'Pune Mandi', state: 'Maharashtra', district: 'Pune', latitude: 18.5204, longitude: 73.8567, crops: ['Sugarcane', 'Onion', 'Cotton', 'Tomato'] },
  { id: 'nagpur', name: 'Nagpur Mandi', state: 'Maharashtra', district: 'Nagpur', latitude: 21.1458, longitude: 79.0882, crops: ['Cotton', 'Groundnut', 'Tomato', 'Onion'] },
  { id: 'nashik', name: 'Nashik Mandi', state: 'Maharashtra', district: 'Nashik', latitude: 19.9975, longitude: 73.7898, crops: ['Onion', 'Cotton', 'Sugarcane'] },
  { id: 'solapur', name: 'Solapur Mandi', state: 'Maharashtra', district: 'Solapur', latitude: 17.6574, longitude: 75.9064, crops: ['Sugarcane', 'Cotton', 'Groundnut'] },
  { id: 'kolhapur', name: 'Kolhapur Mandi', state: 'Maharashtra', district: 'Kolhapur', latitude: 16.7050, longitude: 73.7356, crops: ['Sugarcane', 'Onion', 'Cotton'] },
  { id: 'aurangabad', name: 'Aurangabad Mandi', state: 'Maharashtra', district: 'Aurangabad', latitude: 19.8762, longitude: 75.3433, crops: ['Cotton', 'Sugarcane', 'Groundnut'] },

  // Karnataka
  { id: 'bangalore', name: 'Bangalore Mandi', state: 'Karnataka', district: 'Bangalore', latitude: 12.9716, longitude: 77.5946, crops: ['Tomato', 'Onion', 'Groundnut', 'Cotton'] },
  { id: 'hubli', name: 'Hubli Mandi', state: 'Karnataka', district: 'Hubli', latitude: 15.3647, longitude: 75.0842, crops: ['Cotton', 'Groundnut', 'Sugarcane'] },
  { id: 'bellary', name: 'Bellary Mandi', state: 'Karnataka', district: 'Bellary', latitude: 15.1394, longitude: 75.6245, crops: ['Groundnut', 'Cotton', 'Maize'] },
  { id: 'mysore', name: 'Mysore Mandi', state: 'Karnataka', district: 'Mysore', latitude: 12.2958, longitude: 76.6394, crops: ['Coffee', 'Groundnut', 'Sugarcane'] },
  { id: 'davangere', name: 'Davangere Mandi', state: 'Karnataka', district: 'Davangere', latitude: 14.4667, longitude: 75.9167, crops: ['Groundnut', 'Cotton', 'Sugarcane'] },
  { id: 'raichur', name: 'Raichur Mandi', state: 'Karnataka', district: 'Raichur', latitude: 16.2062, longitude: 77.3433, crops: ['Cotton', 'Groundnut', 'Tomato'] },

  // Uttar Pradesh
  { id: 'lucknow', name: 'Lucknow Mandi', state: 'Uttar Pradesh', district: 'Lucknow', latitude: 26.8467, longitude: 80.9462, crops: ['Wheat', 'Rice', 'Potato', 'Tomato'] },
  { id: 'agra', name: 'Agra Mandi', state: 'Uttar Pradesh', district: 'Agra', latitude: 27.1767, longitude: 78.0081, crops: ['Wheat', 'Potato', 'Tomato', 'Groundnut'] },
  { id: 'kanpur', name: 'Kanpur Mandi', state: 'Uttar Pradesh', district: 'Kanpur', latitude: 26.4499, longitude: 80.3319, crops: ['Wheat', 'Rice', 'Sugarcane'] },
  { id: 'meerut', name: 'Meerut Mandi', state: 'Uttar Pradesh', district: 'Meerut', latitude: 29.0588, longitude: 77.7064, crops: ['Wheat', 'Rice', 'Maize', 'Tomato'] },
  { id: 'varanasi', name: 'Varanasi Mandi', state: 'Uttar Pradesh', district: 'Varanasi', latitude: 25.3176, longitude: 82.9789, crops: ['Wheat', 'Rice', 'Sugarcane'] },
  { id: 'hapur', name: 'Hapur Mandi', state: 'Uttar Pradesh', district: 'Meerut', latitude: 28.7346, longitude: 77.7821, crops: ['Wheat', 'Rice', 'Potato'] },

  // Rajasthan
  { id: 'jaipur', name: 'Jaipur Mandi', state: 'Rajasthan', district: 'Jaipur', latitude: 26.9124, longitude: 75.7873, crops: ['Wheat', 'Maize', 'Groundnut', 'Mustard'] },
  { id: 'jodhpur', name: 'Jodhpur Mandi', state: 'Rajasthan', district: 'Jodhpur', latitude: 26.2389, longitude: 73.0243, crops: ['Groundnut', 'Mustard', 'Wheat'] },
  { id: 'kota', name: 'Kota Mandi', state: 'Rajasthan', district: 'Kota', latitude: 25.2138, longitude: 75.8648, crops: ['Wheat', 'Groundnut', 'Mustard'] },
  { id: 'bikaner', name: 'Bikaner Mandi', state: 'Rajasthan', district: 'Bikaner', latitude: 28.0229, longitude: 73.3119, crops: ['Mustard', 'Wheat', 'Groundnut'] },

  // Madhya Pradesh
  { id: 'indore', name: 'Indore Mandi', state: 'Madhya Pradesh', district: 'Indore', latitude: 22.7196, longitude: 75.8577, crops: ['Soybean', 'Cotton', 'Wheat', 'Groundnut'] },
  { id: 'bhopal', name: 'Bhopal Mandi', state: 'Madhya Pradesh', district: 'Bhopal', latitude: 23.1815, longitude: 77.4104, crops: ['Wheat', 'Soybean', 'Groundnut'] },
  { id: 'jabalpur', name: 'Jabalpur Mandi', state: 'Madhya Pradesh', district: 'Jabalpur', latitude: 23.1815, longitude: 79.9864, crops: ['Rice', 'Wheat', 'Cotton'] },
  { id: 'gwalior', name: 'Gwalior Mandi', state: 'Madhya Pradesh', district: 'Gwalior', latitude: 26.2183, longitude: 78.1629, crops: ['Wheat', 'Groundnut', 'Mustard'] },

  // Punjab
  { id: 'ludhiana', name: 'Ludhiana Mandi', state: 'Punjab', district: 'Ludhiana', latitude: 30.9010, longitude: 75.8573, crops: ['Wheat', 'Rice', 'Cotton', 'Maize'] },
  { id: 'amritsar', name: 'Amritsar Mandi', state: 'Punjab', district: 'Amritsar', latitude: 31.6340, longitude: 74.8723, crops: ['Wheat', 'Rice', 'Cotton'] },
  { id: 'patiala', name: 'Patiala Mandi', state: 'Punjab', district: 'Patiala', latitude: 30.3398, longitude: 76.3869, crops: ['Wheat', 'Rice', 'Sugarcane'] },
  { id: 'bathinda', name: 'Bathinda Mandi', state: 'Punjab', district: 'Bathinda', latitude: 29.7674, longitude: 74.9598, crops: ['Cotton', 'Wheat', 'Rice'] },

  // Gujarat
  { id: 'ahmedabad', name: 'Ahmedabad Mandi', state: 'Gujarat', district: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, crops: ['Cotton', 'Groundnut', 'Tomato', 'Onion'] },
  { id: 'surat', name: 'Surat Mandi', state: 'Gujarat', district: 'Surat', latitude: 21.1702, longitude: 72.8311, crops: ['Cotton', 'Tomato', 'Onion'] },
  { id: 'rajkot', name: 'Rajkot Mandi', state: 'Gujarat', district: 'Rajkot', latitude: 22.3039, longitude: 70.7839, crops: ['Groundnut', 'Cotton', 'Mustard'] },
  { id: 'vadodara', name: 'Vadodara Mandi', state: 'Gujarat', district: 'Vadodara', latitude: 22.3072, longitude: 73.1812, crops: ['Cotton', 'Groundnut', 'Tomato'] },

  // Tamil Nadu
  { id: 'chennai', name: 'Chennai Mandi', state: 'Tamil Nadu', district: 'Chennai', latitude: 13.0827, longitude: 80.2707, crops: ['Rice', 'Coconut', 'Groundnut', 'Tomato'] },
  { id: 'coimbatore', name: 'Coimbatore Mandi', state: 'Tamil Nadu', district: 'Coimbatore', latitude: 11.0026, longitude: 76.9369, crops: ['Groundnut', 'Cotton', 'Tomato'] },
  { id: 'madurai', name: 'Madurai Mandi', state: 'Tamil Nadu', district: 'Madurai', latitude: 9.9252, longitude: 78.1198, crops: ['Rice', 'Cotton', 'Groundnut'] },
  { id: 'salem', name: 'Salem Mandi', state: 'Tamil Nadu', district: 'Salem', latitude: 11.6643, longitude: 78.1460, crops: ['Cotton', 'Groundnut', 'Rice'] },

  // Haryana
  { id: 'karnal', name: 'Karnal Mandi', state: 'Haryana', district: 'Karnal', latitude: 29.6200, longitude: 77.1050, crops: ['Wheat', 'Rice', 'Maize', 'Cotton'] },
  { id: 'hisar', name: 'Hisar Mandi', state: 'Haryana', district: 'Hisar', latitude: 29.1459, longitude: 75.7313, crops: ['Cotton', 'Wheat', 'Groundnut'] },
  { id: 'rohtak', name: 'Rohtak Mandi', state: 'Haryana', district: 'Rohtak', latitude: 28.8955, longitude: 77.0564, crops: ['Wheat', 'Mustard', 'Groundnut'] },

  // Himachal Pradesh
  { id: 'kangra', name: 'Kangra Mandi', state: 'Himachal Pradesh', district: 'Kangra', latitude: 32.2236, longitude: 76.2556, crops: ['Tea', 'Rice', 'Wheat'] },
  { id: 'shimla', name: 'Shimla Mandi', state: 'Himachal Pradesh', district: 'Shimla', latitude: 31.7725, longitude: 77.1097, crops: ['Apple', 'Wheat', 'Potato'] },

  // Uttarakhand
  { id: 'dehradun', name: 'Dehradun Mandi', state: 'Uttarakhand', district: 'Dehradun', latitude: 30.3165, longitude: 78.0322, crops: ['Wheat', 'Rice', 'Potato'] },

  // Bihar
  { id: 'patna', name: 'Patna Mandi', state: 'Bihar', district: 'Patna', latitude: 25.5941, longitude: 85.1376, crops: ['Rice', 'Wheat', 'Potato', 'Onion'] },
  { id: 'arrah', name: 'Arrah Mandi', state: 'Bihar', district: 'Bhojpur', latitude: 25.5571, longitude: 84.6659, crops: ['Rice', 'Wheat', 'Potato'] },

  // West Bengal
  { id: 'kolkata', name: 'Kolkata Mandi', state: 'West Bengal', district: 'Kolkata', latitude: 22.5726, longitude: 88.3639, crops: ['Rice', 'Jute', 'Potato', 'Tomato'] },
  { id: 'siliguri', name: 'Siliguri Mandi', state: 'West Bengal', district: 'Darjeeling', latitude: 26.7271, longitude: 88.4006, crops: ['Tea', 'Rice', 'Potato'] },

  // Odisha
  { id: 'bhubaneswar', name: 'Bhubaneswar Mandi', state: 'Odisha', district: 'Khurda', latitude: 20.2961, longitude: 85.8245, crops: ['Rice', 'Groundnut', 'Tomato'] },
  { id: 'rourkela', name: 'Rourkela Mandi', state: 'Odisha', district: 'Sundargarh', latitude: 22.2042, longitude: 84.8538, crops: ['Rice', 'Groundnut', 'Cotton'] },

  // Telangana Extension
  { id: 'sangareddy', name: 'Sangareddy Mandi', state: 'Telangana', district: 'Medak', latitude: 17.6500, longitude: 78.8833, crops: ['Tomato', 'Onion', 'Groundnut'] },
  { id: 'medak', name: 'Medak Mandi', state: 'Telangana', district: 'Medak', latitude: 17.3500, longitude: 78.4500, crops: ['Maize', 'Groundnut', 'Cotton'] },
]

export const MANDI_BY_STATE = (state: string): Mandi[] => MANDIS.filter(m => m.state === state)

export const NEAREST_MANDIS = (lat: number, lng: number, radius: number = 100): Array<Mandi & { distance: number }> => {
  const mandisWithDist = MANDIS.map(m => ({
    ...m,
    distance: getDistanceKm(lat, lng, m.latitude, m.longitude)
  })).filter(m => m.distance <= radius)

  return mandisWithDist.sort((a, b) => a.distance - b.distance)
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
