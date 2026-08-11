import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} · ${site.role}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -240,
            left: -140,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(102,227,255,0.30) 0%, rgba(10,10,15,0) 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              border: "1px solid #33333f",
              color: "#66e3ff",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {site.initials}
          </div>
          <span style={{ color: "#74748a", fontSize: 22, letterSpacing: 3 }}>
            {site.role.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#ededf2", fontSize: 74, lineHeight: 1.05, letterSpacing: -2 }}>
            {site.headline}
          </span>
          <span style={{ color: "#a9a9b8", fontSize: 27, marginTop: 26 }}>
            {site.name} · Voice agents, automations, AI video, shipped products
          </span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["AUTOMA", "Poker Splitter", "JobScout", "Jewelry DM Engine", "Work Continuity Agent"].map(
            (name) => (
              <span
                key={name}
                style={{
                  color: "#74748a",
                  fontSize: 19,
                  border: "1px solid #23232e",
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                {name}
              </span>
            ),
          )}
        </div>
      </div>
    ),
    size,
  );
}
