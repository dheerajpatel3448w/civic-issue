import { reverseGeocode } from "../service/map.serivice.js";

export const Addressbylanlat =  async (req, res) => {
  const { lat, lng } = req.query;
  console.log(lat,lng);
  if (!lat || !lng) return res.status(400).json({ error: 'lat & lng required' });

  try {
    const address = await reverseGeocode(lat, lng);
    console.log(address)
    return res.status(200).json({ address:address[0] });
  } catch (err) {
    console.error('reverse proxy error', err);
    return res.status(500).json({ error: 'Reverse geocode failed' });
  }
}