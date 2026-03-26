"use client";
import React from "react";
import UmbralScene from "@/components/umbral/umbral-scene";

const NAV_LINKS = ["Features", "Pricing", "About", "Blog"];

const STATS = [
  { value: "12K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "150ms", label: "Avg Latency" },
  { value: "4.9/5", label: "Rating" },
];

const AVATAR_COLORS = ["#8b7355", "#6b5b45", "#a89070", "#554535"];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-20 grid grid-cols-3 items-center pt-6 px-10">
      <div className="text-[#111] text-xl font-bold tracking-tight">
        umbral<span className="text-[#111]/40">.</span>
      </div>

      <div className="hidden md:flex items-center justify-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[#111]/70 text-sm font-medium hover:text-[#111] transition-colors"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="text-sm font-medium text-[#111]/70 px-4 py-2 rounded-full border border-[#111]/20 hover:border-[#111]/40 transition-colors">
          Sign in
        </button>
        <button className="text-sm font-medium text-white bg-[#0f0f0f] px-5 py-2 rounded-full hover:bg-[#0f0f0f]/90 transition-colors">
          Join
        </button>
      </div>
    </nav>
  );
}

function SocialProof() {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full pl-1 pr-4 py-1 shadow-sm">
      <div className="flex -space-x-2">
        {AVATAR_COLORS.map((color, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 border-white"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-[#111]/70">
        Join 12,000+ creators
      </span>
    </div>
  );
}

function HeroContent() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none">
      <div className="flex flex-col items-center justify-start pt-[12vh] h-[50vh]">
        <SocialProof />

        <h1
          className="mt-6 text-center text-[#111] leading-[0.95]"
          style={{
            fontSize: "clamp(48px, 6vw, 80px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Motion.
          <br />
          Captured.
        </h1>

        <p className="mt-5 text-base text-[#111]/50 text-center max-w-md">
          Real-time 3D experiences that move with intention
        </p>

        <button className="pointer-events-auto mt-7 text-sm font-medium text-white bg-[#0f0f0f] h-10 px-10 rounded-full hover:bg-[#0f0f0f]/90 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}

function StatsBar() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-8 bg-black/55 backdrop-blur-md rounded-full px-8 py-4">
        {STATS.map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-white text-lg font-semibold leading-tight">
              {stat.value}
            </span>
            <span className="text-white/50 text-xs mt-0.5">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UmbralHeroPage() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <UmbralScene cameraY={-1.0} cameraZ={6.5} modelY={-3} />
      <Navbar />
      <HeroContent />
      <StatsBar />
    </div>
  );
}
