"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { VerticalExperience } from "@/components/shared";
import styles from "./showcase.module.scss";

export default function Showcase() {
  return (
    <div className={styles.showcase}>
      {/* Scroll height driver for the carousel */}
      <div style={{ height: "500vh" }} />

      {/* 3D Carousel Canvas */}
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <VerticalExperience />
      </Canvas>

      {/* Editorial overlay */}
      <div className={styles.overlay}>
        {/* Top bar */}
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>V</span>
            <span className={styles.logoText}>VERSO</span>
          </div>
          <nav className={styles.nav}>
            <span>Archive</span>
            <span>Artists</span>
            <span>Contact</span>
          </nav>
        </header>

        {/* Center frame — defines the "window" around the carousel */}
        <div className={styles.centerContent}>
          {/* Left column */}
          <div className={styles.leftCol}>
            <div className={styles.verticalLabel}>
              <span>Visual Arts Collective</span>
            </div>
          </div>

          {/* Carousel window — transparent gap */}
          <div className={styles.carouselWindow} />

          {/* Right column */}
          <div className={styles.rightCol}>
            <p className={styles.description}>
              A curated journey through
              <br />
              contemporary visual narratives.
              <br />
              <span className={styles.descriptionMuted}>
                Exploring the intersection of
                <br />
                light, form, and perspective.
              </span>
            </p>
            <div className={styles.indexLabel}>
              <span className={styles.mono}>001 — 030</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.mono}>Est. 2024</span>
            <span className={styles.divider} />
            <span className={styles.mono}>Selected Works</span>
          </div>
          <div className={styles.scrollIndicator}>
            <span className={styles.mono}>Scroll to explore</span>
            <div className={styles.scrollLine} />
          </div>
        </footer>
      </div>
    </div>
  );
}
