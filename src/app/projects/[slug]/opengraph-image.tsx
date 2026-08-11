import { ImageResponse } from "next/og";
import { projects, projectBySlug } from "@/data/projects";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);

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
            top: -260,
            left: 300,
            width: 800,
            height: 800,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${project?.accent ?? "#66e3ff"}44 0%, rgba(10,10,15,0) 68%)`,
          }}
        />

        <span style={{ color: "#74748a", fontSize: 21, letterSpacing: 3 }}>
          {(project?.category ?? "").toUpperCase()}
        </span>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#ededf2", fontSize: 86, lineHeight: 1, letterSpacing: -2 }}>
            {project?.name ?? site.name}
          </span>
          <span
            style={{
              color: project?.accent ?? "#66e3ff",
              fontSize: 38,
              marginTop: 16,
              fontStyle: "italic",
            }}
          >
            {project?.tagline ?? ""}
          </span>
          <span style={{ color: "#a9a9b8", fontSize: 24, marginTop: 30, maxWidth: 940, lineHeight: 1.4 }}>
            {project?.hook ?? ""}
          </span>
        </div>

        <span style={{ color: "#74748a", fontSize: 21 }}>
          {site.name} · {site.role}
        </span>
      </div>
    ),
    size,
  );
}
