"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/shared";
import { Leva } from "leva";

export default function Home() {
  // const { rotationX } = useControls({
  //   rotationX: {
  //     min: 0,
  //     max: 360 * 4,
  //     value: 0,
  //     step: 0.01,
  //   },
  // });

  return (
    <div className="">
      <div className="" style={{ height: "500vh" }}></div>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          // zIndex: 9,
        }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}
