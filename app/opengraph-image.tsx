import { ImageResponse } from "next/og";

export const alt = "Invoice Simple — Free Invoice Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "300px",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "20px",
            padding: "6px 18px",
            fontSize: "14px",
            color: "#10b981",
            fontWeight: 600,
            letterSpacing: "0.08em",
            marginBottom: "28px",
          }}
        >
          100% FREE · NO SIGN-UP REQUIRED
        </div>

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          {/* Icon box */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", color: "#fff", fontSize: "28px", fontWeight: 900 }}>
              S
            </div>
          </div>

          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span
              style={{
                fontSize: "52px",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                display: "flex",
              }}
            >
              Invoice
            </span>
            <span
              style={{
                fontSize: "52px",
                fontWeight: 800,
                color: "#10b981",
                letterSpacing: "-0.03em",
                display: "flex",
              }}
            >
              Simple
            </span>
          </div>
        </div>

        {/* Tagline line 1 */}
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Create professional invoices in seconds.
        </div>

        {/* Tagline line 2 */}
        <div
          style={{
            display: "flex",
            fontSize: "26px",
            color: "rgba(255,255,255,0.35)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            marginBottom: "40px",
          }}
        >
          Free, no sign-up, instant PDF download.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["PDF Export", "3 Templates", "Invoice History", "Share Link", "PWA"].map((f) => (
            <div
              key={f}
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
