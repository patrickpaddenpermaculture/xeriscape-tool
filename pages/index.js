export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <h1>Fort Collins Xeriscape Planning Tool</h1>
      <p style={{ color: "#64748b" }}>
        Enter an address, fetch Street View + satellite, then generate 3 xeriscape concept images.
      </p>

      <a
        href="/xeriscape"
        style={{
          display: "inline-block",
          marginTop: 12,
          background: "#0f766e",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: 12,
          fontWeight: 800,
          textDecoration: "none"
        }}
      >
        Open the Tool →
      </a>

      <div style={{ marginTop: 18, fontSize: 12, color: "#64748b" }}>
        MVP: Address-only (no uploads).
      </div>
    </div>
  );
}
