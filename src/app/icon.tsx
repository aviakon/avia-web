import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          color: "#66e3ff",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: -1,
          borderRadius: 14,
        }}
      >
        {site.initials}
      </div>
    ),
    size,
  );
}
