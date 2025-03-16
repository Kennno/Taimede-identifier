import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "RoheAI - AI-Powered Plant Identification";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #f0fdf4, #dcfce7)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 24 }}
          >
            <path d="M6 3v12" />
            <path d="M18 9a3 3 0 0 0-3-3h-4l2-2" />
            <path d="M18 21v-9" />
            <path d="M18 15a3 3 0 0 1-3 3h-4l2 2" />
          </svg>
          <div
            style={{
              fontSize: 64,
              fontWeight: "bold",
              color: "#16a34a",
            }}
          >
            RoheAI
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          AI-Powered Plant Identification
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#666",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Identify plants instantly and get detailed care instructions with our
          advanced AI technology
        </div>
      </div>
    ),
    { ...size },
  );
}
