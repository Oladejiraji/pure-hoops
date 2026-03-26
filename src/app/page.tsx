"use client";
import Link from "next/link";

const pages = [
  {
    href: "/showcase-h",
    title: "Horizontal Carousel",
    description:
      "A scroll-driven 3D horizontal image carousel with editorial overlay. Themed as a photography studio site.",
  },
  {
    href: "/showcase",
    title: "Vertical Carousel",
    description:
      "Vertical scroll-based 3D carousel with an editorial layout featuring a curated visual-arts theme.",
  },
  {
    href: "/showcase-h2",
    title: "Archiv Showcase",
    description:
      "Horizontal carousel variant with a progress bar, floating metadata, and a bold typographic overlay.",
  },
  {
    href: "/pixelated-carousel",
    title: "Pixelated Carousel",
    description:
      "Interactive 3D carousel with pixelated transitions, animated metadata, custom cursor, and film-grain post-processing.",
  },
  {
    href: "/umbral-hero",
    title: "Umbral Hero",
    description:
      "SaaS-style hero section with a 3D android model, radial pulse floor, social proof bar, and stats strip.",
  },
  {
    href: "/umbral",
    title: "Umbral Scene",
    description:
      "Full 3D scene playground with an android model, custom shader floor, orbit controls, and Leva debug panel.",
  },
  {
    href: "/vertical",
    title: "Vertical Experience",
    description:
      "Minimal full-screen vertical 3D experience with scroll-driven animation.",
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "80px 24px 60px",
        maxWidth: 960,
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header style={{ marginBottom: 64 }}>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#111",
            margin: 0,
          }}
        >
          Pure Hoops
        </h1>
        <p
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#666",
            lineHeight: 1.5,
          }}
        >
          A collection of 3D WebGL explorations built with React Three Fiber.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              display: "block",
              padding: "24px 28px",
              borderRadius: 12,
              border: "1px solid #e5e5e5",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#999";
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e5e5";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#111",
                  margin: 0,
                }}
              >
                {page.title}
              </h2>
              <span
                style={{ fontSize: 13, color: "#999", fontFamily: "monospace" }}
              >
                {page.href}
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#666",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
