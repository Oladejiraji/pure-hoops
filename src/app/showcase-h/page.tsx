"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/shared";
import { Leva } from "leva";
import styles from "./showcase-h.module.scss";

export default function ShowcaseHorizontal() {
  return (
    <div className={styles.showcase}>
      <Leva hidden />
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
        <Experience />
      </Canvas>

      {/* Editorial overlay */}
      <div className={styles.overlay}>
        {/* Top strip */}
        <div className={styles.topStrip}>
          <div className={styles.topLeft}>
            <span className={styles.brandName}>ŌKRA</span>
            <span className={styles.brandSub}>STUDIO</span>
          </div>
          <div className={styles.topCenter}>
            <span className={styles.mono}>The Permanent Collection</span>
          </div>
          <div className={styles.topRight}>
            <span className={styles.mono}>Menu</span>
          </div>
        </div>

        {/* Main content area */}
        <div className={styles.main}>
          {/* Left edge — vertical ruled line with label */}
          <div className={styles.edgeLeft}>
            <div className={styles.ruleLine} />
            <span className={styles.edgeLabel}>2024</span>
          </div>

          {/* Carousel viewport — open space */}
          <div className={styles.viewport}>
            {/* Top row text — sits above the carousel band */}
            <div className={styles.viewportTop}>
              <h1 className={styles.headline}>
                <span className={styles.headlineLight}>Where</span>
                <span className={styles.headlineBold}> images</span>
                <span className={styles.headlineLight}> speak</span>
              </h1>
            </div>

            {/* Bottom row text — sits below the carousel band */}
            <div className={styles.viewportBottom}>
              <p className={styles.statement}>
                An editorial lens on contemporary photography —
                <br />
                <span className={styles.statementMuted}>
                  thirty works, one continuous stream.
                </span>
              </p>
              <div className={styles.counter}>
                <div className={styles.counterLine} />
                <span className={styles.mono}>30 Works</span>
              </div>
            </div>
          </div>

          {/* Right edge */}
          <div className={styles.edgeRight}>
            <span className={styles.edgeLabel}>Vol. I</span>
            <div className={styles.ruleLine} />
          </div>
        </div>

        {/* Bottom strip */}
        <div className={styles.bottomStrip}>
          <div className={styles.bottomLeft}>
            <span className={styles.mono}>Selected Photography</span>
            <span className={styles.dot} />
            <span className={styles.mono}>Global</span>
          </div>
          <div className={styles.bottomRight}>
            <span className={styles.scrollCue}>
              <span className={styles.mono}>Scroll</span>
              <svg
                width="24"
                height="8"
                viewBox="0 0 24 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 4H22M22 4L18.5 0.5M22 4L18.5 7.5"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  opacity="0.5"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
