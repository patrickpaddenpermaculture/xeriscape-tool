export default function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Fort Collins Xeriscape Planning Tool 🌿</h1>
      <p>
        Enter your address or upload a photo to generate a regenerative
        landscape concept and installation estimate.
      </p>

      <a href="/xeriscape">
        <button style={{ padding: "12px 20px", marginTop: "20px" }}>
          Start Designing
        </button>
      </a>
    </div>
  );
}
