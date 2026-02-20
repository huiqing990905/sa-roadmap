import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Solution Architect Roadmap — Hui Qing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            right: "10%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.12)",
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#818cf8",
              letterSpacing: 4,
              textTransform: "uppercase" as const,
            }}
          >
            245 Tasks &middot; 9 Phases &middot; 1 Goal
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            Solution Architect
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              background: "linear-gradient(90deg, #818cf8, #a855f7, #22d3ee)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Roadmap
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#6b7280",
              marginTop: 16,
            }}
          >
            Hui Qing — Full Stack Engineer → Solution Architect
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
