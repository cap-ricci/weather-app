type Place = {
    id: number;
    name: string;
    lat: number;
    lon: number;
  };

const R = 6371;
export const ZERO_PLACE = {
    id: 0,
    name: 'zero place',
    lat: 0,
    lon: 0,
}

// helper function
function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
}

// compute spherical distance between coordinates using Haversine formula
function haversineDistance(first: Place, second: Place): number {
    const dLat = deg2rad(second.lat - first.lat);  // deg2rad below
    const dLon = deg2rad(second.lon - first.lon); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(first.lat)) * Math.cos(deg2rad(second.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); // Distance in km
}

// test if two points are close
export function isInBufferArea(center: Place, test: Place, radius: number): boolean {
    const d = haversineDistance(center, test);
    return d <= radius ? true : false;
}

export default Place;
