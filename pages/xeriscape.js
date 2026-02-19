import { useState } from "react";
import Link from "next/link";

export default function XeriscapePage() {
  const [address, setAddress] = useState("");
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const [error, setError] = useState("");

  async function handleLookup() {
    setError("");
    setLookupResult(null);

    if (!address.trim()) {
      setError("Please enter an address.");
      return;
    }

    setLoadingLookup(true);
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Address not found");
      }

      setLookupResult(data);
    } catch (e) {
      setError(e.message || "Lookup failed.");
    } finally {
      setLoadingLookup(false);
    }
  }

  async function handleUpload() {
    setError("");
    setUploadResult(null);

    if (!uploadFile) {
      setError("Please choose a photo first.");
      return;
    }

    setLoadingUpload(true);
    try {
      const formData = new FormData();
      // IMPORTANT: field name must be "image" to match /api/upload.js
      formData.append("image", uploadFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setUploadResult(data);
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally {
      setLoadingUpload(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.h1}>Xeriscape AI Tool (MVP)</h1>
          <p style={styles.sub}>
            Address-only: fetch Street View + satellite, then generate concept “after”
            images. (Now also supports photo upload.)
          </p>
        </div>

        <Link href="/" style={styles.homeLink}>
          ← Home
        </Link>
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Address</label>
        <input
          style={styles.input}
          placeholder="4209 Gemstone Ln, Fort Collins, CO 80525"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLookup}
          disabled={loadingLookup}
        >
          {loadingLookup ? "Fetching..." : "Fetch Street View + Satellite"}
        </button>

        {lookupResult && (
          <div style={styles.resultBox}>
            <div style={styles.resultTitle}>Lookup Result</div>
            <pre style={styles.pre}>{JSON.stringify(lookupResult, null, 2)}</pre>
          </div>
        )}

        <hr style={styles.hr} />

        <label style={styles.label}>Upload Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setError("");
            setUploadResult(null);

            const file = e.target.files?.[0];
            if (!file) {
              setUploadFile(null);
              setUploadPreviewUrl("");
              return;
            }

            setUploadFile(file);
            const url = URL.createObjectURL(file);
            setUploadPreviewUrl(url);
          }}
        />

        {uploadPreviewUrl && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
              Preview
            </div>
            <img
              src={uploadPreviewUrl}
              alt="Upload preview"
              style={styles.previewImg}
            />
          </div>
        )}

        <button
          style={{ ...styles.button, marginTop: 14 }}
          onClick={handleUpload}
          disabled={loadingUpload}
        >
          {loadingUpload ? "Uploading..." : "Upload Photo"}
        </button>

        {uploadResult && (
          <div style={styles.resultBox}>
            <div style={styles.resultTitle}>Upload Result</div>
            <pre style={styles.pre}>{JSON.stringify(uploadResult, null, 2)}</pre>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>

      <div style={styles.footerNote}>
        Next step: wire “Generate Designs” to your image-generation API once lookup or
        upload succeeds.
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px 24px",
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  h1: {
    fontSize: 44,
    lineHeight: 1.1,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  sub: {
    marginTop: 10,
    marginBottom: 0,
    fontSize: 18,
    opacity: 0.75,
  },
  homeLink: {
    textDecoration: "none",
    fontWeight: 700,
    color: "#1f6f62",
    fontSize: 18,
    paddingTop: 10,
    whiteSpace: "nowrap",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 24,
    padding: 26,
    background: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  },
  label: {
    display: "block",
    fontWeight: 700,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    fontSize: 16,
    outline: "none",
    marginBottom: 14,
  },
  button: {
    background: "#1f6f62",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "14px 18px",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    width: "fit-content",
  },
  error: {
    marginTop: 14,
    color: "#b42318",
    fontWeight: 800,
    fontSize: 16,
  },
  hr: {
    margin: "22px 0",
    border: "none",
    borderTop: "1px solid #eef2f7",
  },
  previewImg: {
    maxWidth: 520,
    width: "100%",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
  },
  resultBox: {
    marginTop: 16,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    padding: 14,
  },
  resultTitle: {
    fontWeight: 900,
    marginBottom: 10,
  },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 12,
    lineHeight: 1.4,
  },
  footerNote: {
    marginTop: 16,
    fontSize: 13,
    opacity: 0.7,
  },
};
