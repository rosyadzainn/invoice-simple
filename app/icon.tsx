import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #10b981, #0d9488)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Paper */}
          <div
            style={{
              width: 14,
              height: 17,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              padding: "3px 2px",
              gap: 2,
            }}
          >
            <div style={{ width: 10, height: 1.5, background: "#10b981", borderRadius: 1, display: "flex" }} />
            <div style={{ width: 8, height: 1.5, background: "rgba(0,0,0,0.2)", borderRadius: 1, display: "flex" }} />
            <div style={{ width: 8, height: 1.5, background: "rgba(0,0,0,0.2)", borderRadius: 1, display: "flex" }} />
            <div style={{ width: 6, height: 1.5, background: "rgba(0,0,0,0.15)", borderRadius: 1, display: "flex" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
