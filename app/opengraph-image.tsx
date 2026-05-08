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
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)",
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
          100% FREE · NO SIGN-UP
        </div>

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            📄
          </div>
          <div style={{ display: "flex", fontSize: "48px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
            Invoice
            <span style={{ color: "#10b981" }}>Simple</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: "680px",
            lineHeight: 1.4,
          }}
        >
          Create professional invoices in seconds.
          <br />
          Free, fast, and beautifully designed.
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
          {["PDF Export", "3 Templates", "Invoice History", "Share Link"].map((f) => (
            <div
              key={f}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
                fontWeight: 500,
                display: "flex",
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
