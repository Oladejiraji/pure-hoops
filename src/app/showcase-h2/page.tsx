"use client";
import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/shared";
import { Leva } from "leva";
import { useLenis } from "lenis/react";
import { NUMBER_OF_CARDS } from "@/utils/static";
import styles from "./showcase-h2.module.scss";

export default function ShowcaseH2() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useLenis((lenis) => {
    const p = lenis.progress;
    setProgress(p);

    const index = Math.min(
      NUMBER_OF_CARDS,
      Math.max(1, Math.round(p * (NUMBER_OF_CARDS - 1)) + 1)
    );
    setCurrentIndex(index);
  });

  return (
    <div className={styles.page}>
      <Leva hidden />
      <div style={{ height: "500vh" }} />

      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Experience />
      </Canvas>

      {/* ── Progress bar ── */}
      <div className={styles.progressTrack}>
        <div
          ref={progressRef}
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* ── Overlay ── */}
      <div className={styles.overlay}>
        {/* ── Top nav ── */}
        <nav className={styles.nav}>
          <span className={styles.brand}>ARCHIV</span>
          <div className={styles.navRight}>
            <span>Index</span>
            <span>Info</span>
          </div>
        </nav>

        {/* ── Floating metadata ── */}
        <span className={styles.floatLabel}>Series A</span>
        <span className={styles.floatIndex}>
          {String(currentIndex).padStart(3, "0")} — {String(NUMBER_OF_CARDS).padStart(3, "0")}
        </span>

        {/* ── Bottom content zone ── */}
        <div className={styles.bottom}>
          <div className={styles.rule} />

          <div className={styles.bottomInner}>
            {/* Left: massive title */}
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>
                SELECTED
                <br />
                WORKS
              </h1>
              <span className={styles.titleMeta}>Photography</span>
            </div>

            {/* Right: supporting copy, sits higher */}
            <div className={styles.copyBlock}>
              <p className={styles.copy}>
                Thirty images suspended between
                <br />
                light and form — a visual monograph
                <br />
                on negative space.
              </p>
              <div className={styles.copyMeta}>
                <span>Global</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
