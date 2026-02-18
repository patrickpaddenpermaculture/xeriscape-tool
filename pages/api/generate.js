export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

    const { streetViewUrl } = req.body || {};
    if (!streetViewUrl) return res.status(400).json({ error: "Missing streetViewUrl" });

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    // Fetch the Street View image bytes
    const imgResp = await fetch(streetViewUrl);
    if (!imgResp.ok) return res.status(400).json({ error: "Could not fetch Street View image" });

    const arrayBuffer = await imgResp.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });

    const prompts = [
      "Photorealistic xeriscape makeover for Fort Collins Colorado: remove turf, add drought-tolerant native plants, mulch/gravel, clean edging, natural stone accents, keep house and perspective unchanged.",
      "Photorealistic pollinator-focused native garden for Fort Collins Colorado: flowering perennials, native grasses, layered habitat, tidy edges, mulch, keep house and perspective unchanged.",
      "Photorealistic modern low-water landscape: geometric beds, gravel mulch, simple stone path, small seating nook, drought-tolerant native plants, keep house and perspective unchanged."
    ];

    const images = [];

    for (const prompt of prompts) {
      const form = new FormData();
      form.append("model", "gpt-image-1");
      form.append("image", blob, "streetview.jpg");
      form.append("prompt", prompt);
      form.append("size", "1024x1024");

      const r = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${openaiKey}` },
        body: form
      });

      if (!r.ok) {
        const errText = await r.text();
        return res.status(500).json({ error: "OpenAI image generation failed", detail: errText });
      }

      const data = await r.json();
      const b64 = data?.data?.[0]?.b64_json;
      if (!b64) return res.status(500).json({ error: "No image returned from OpenAI" });

      images.push(`data:image/png;base64,${b64}`);
    }

    return res.status(200).json({ images });
  } catch (e) {
    return res.status(500).json({ error: "Generate failed", detail: String(e) });
  }
}
