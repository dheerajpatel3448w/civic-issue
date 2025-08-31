// services/mapplsService.js
import axios from 'axios';


 
export async function reverseGeocode(lat, lng) {


  try {
    const url = `https://apis.mapmyindia.com/advancedmaps/v1/${process.env.MAP_API}/rev_geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;

    const resp = await axios.get(url, { timeout: 8000 });
    const data = resp.data || {};


    let address = null;
    if (Array.isArray(data.results) && data.results.length > 0) {
      address = [ data.results[0].formatted_address,data.results[0].city] || data.results[0].address || null;
    }
    if (!address && data.response && typeof data.response === 'object') {
      address = data.response.address || data.response.formatted_address || null;
    }
    // final fallback
    if (!address) address = `Lat:${lat},Lng:${lng}`;

    return address;
  } catch (err) {
    console.warn('Mappls reverseGeocode error:', err.message || err);
    return `Lat:${lat},Lng:${lng}`;
  }
}

export default { reverseGeocode };
