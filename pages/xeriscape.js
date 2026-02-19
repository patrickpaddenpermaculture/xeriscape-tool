import { useState } from "react";

export default function Xeriscape() {
  const [address, setAddress] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookup, setLookup] = useState(null);
  const [selectedSv, setSelectedSv] = useState("");
  const [err, setErr] = useState("");

  const [genLoading, setGenLoading] = useState(false);
  const [genImages, setGenImages] = useState([]);
// inside your component JSX

<label style={{ display: "block", fontWeight: 600, marginTop: 16 }}>
  Upload Photo (optional)
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // store file in state
    setUploadFile(file);

    // preview it
    const url = URL.createObjectURL(file);
    setUploadPreviewUrl(url);
  }}
/>

{uploadPreviewUrl && (
  <div style={{ marginTop: 12 }}>
    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Preview</div>
    <img
      src={uploadPreviewUrl}
      alt="Upload preview"
      style={{ maxWidth: 480, width: "100%", borderRadius: 12, border: "1px solid #e5e7eb" }}
    />
  </div>
)}

  async function doLookup() {
    setErr("");
    setLookup(null);
    setSelectedSv("");
    setGenImages([]);
    setLoadingLookup(true);

    try {
      const r = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Lookup failed");
      setLookup(j);
      setSelectedSv(j.streetViewUrls?.[0] || "");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoadingLookup(false);
    }
  }

  async function generate() {
    setErr("");
    setGenImages([]);
    setGenLoading(true);

    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streetViewUrl: selectedSv })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Generate failed");
      setGenImages(j.images || []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setGenLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Xeriscape AI Tool (MVP)</h1>
        <a href="/" style={{ color: "#0f766e", fontWeight: 800, textDecoration: "none" }}>
          ← Home
        </a>
      </div>

      <p style={{ color: "#64748b", marginTop: 8 }}>
        Address-only: fetch Street View + satellite, then generate 3 concept “after” images.
      </p>

      <div style={card}>
        <label style={label}>Address</label>
        <input
          style={input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, Fort Collins, CO"
        />

        <button style={btn} onClick={doLookup} disabled={!address || loadingLookup}>
          {loadingLookup ? "Fetching views…" : "Fetch Street View + Satellite"}
        </button>

        {err && <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 700 }}>{err}</div>}
      </div>

      {lookup && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <h2 style={{ margin: 0 }}>Views</h2>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Found: <b>{lookup.formatted}</b>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {(lookup.streetViewUrls || []).map((u, idx) => (
              <button
                key={u}
                onClick={() => setSelectedSv(u)}
                style={{
                  border: selectedSv === u ? "2px solid #0f766e" : "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 8,
                  background: "#fff",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <img src={u} alt={`Street View ${idx + 1}`} style={{ width: "100%", borderRadius: 12 }} />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                  Street View angle {idx + 1} {selectedSv === u ? "(selected)" : ""}
                </div>
              </button>
            ))}

            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 8, background: "#fff" }}>
              <img src={lookup.satelliteUrl} alt="Satellite" style={{ width: "100%", borderRadius: 12 }} />
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Satellite view</div>
            </div>
          </div>

          <button style={btn} onClick={generate} disabled={!selectedSv || genLoading} title={!selectedSv ? "Select a Street View image first" : ""}>
            {genLoading ? "Generating…" : "Generate 3 Xeriscape Concepts"}
          </button>

          <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
            Tip: If Street View is weird, try a nearby address or one with a clearer front yard.
          </div>
        </div>
      )}

      {genImages.length > 0 && (
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>AI Concepts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {genImages.map((img, idx) => (
              <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 8, background: "#fff" }}>
                <img src={img} alt={`Concept ${idx + 1}`} style={{ width: "100%", borderRadius: 12 }} />
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>Concept {idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 16,
  marginTop: 14,
  boxShadow: "0 6px 18px rgba(15,23,42,.06)"
};
const label = { fontSize: 12, color: "#64748b" };
const input = { width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", marginTop: 6 };
const btn = { marginTop: 12, background: "#0f766e", color: "#fff", border: 0, padding: "12px 14px", borderRadius: 12, fontWeight: 800, cursor: "pointer" };
