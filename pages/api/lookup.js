export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

    const { address } = req.body || {};
    if (!address) return res.status(400).json({ error: "Missing address" });

    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing GOOGLE_MAPS_API_KEY" });

    // Geocode
    const geoUrl =
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}` +
      `&key=${encodeURIComponent(key)}`;

    const geoResp = await fetch(geoUrl);
    const geo = await geoResp.json();

    if (geo.status !== "OK" || !geo.results?.length) {
      return res.status(404).json({ error: "Address not found", status: geo.status });
    }

    const formatted = geo.results[0].formatted_address;
    const { lat, lng } = geo.results[0].geometry.location;

    // Street View images (3 angles)
    const size = "640x640";
    const fov = 80;
    const pitch = 0;
    const headings = [0, 45, 315];

    const streetViewUrls = headings.map(
      (heading) =>
        `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}` +
        `&fov=${fov}&pitch=${pitch}&heading=${heading}&key=${encodeURIComponent(key)}`
    );

    // Satellite
    const satelliteUrl =
      `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
      `&zoom=20&size=640x640&maptype=satellite&markers=color:red%7C${lat},${lng}` +
      `&key=${encodeURIComponent(key)}`;

    return res.status(200).json({ formatted, lat, lng, streetViewUrls, satelliteUrl });
  } catch (e) {
    return res.status(500).json({ error: "Lookup failed", detail: String(e) });
  }
}
