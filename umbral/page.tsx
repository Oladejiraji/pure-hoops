"use client";
import React, { Fragment, useRef } from "react";
import {
  OrbitControls,
  shaderMaterial,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { EffectComposer, SSR } from "@react-three/postprocessing";
import vertexShader from "../../shaders/umbral/vertex.glsl";
import fragmentShader from "../../shaders/umbral/fragment.glsl";
import {
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  MeshStandardMaterial,
} from "three";
import { useControls } from "leva";
import { Android } from "@/components/models/android";

export const CardMaterial = shaderMaterial({}, vertexShader, fragmentShader);

extend({ CardMaterial });

function Floor() {
  const { metalness, roughness } = useControls("floor material", {
    metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
  });

  const { fadeoutEdgeStart, fadeoutEdgeEnd } = useControls("Fadeout Edge", {
    fadeoutEdgeStart: { value: 7.0, min: 0, max: 20, step: 0.1 },
    fadeoutEdgeEnd: { value: 4.5, min: 0, max: 20, step: 0.1 },
  });

  const { pulseColor, baseColor } = useControls("Floor Colors", {
    // pulseColor: "#fff",
    pulseColor: "#282828",
    baseColor: "#d6d6cf",
  });

  const materialRef = useRef<MeshStandardMaterial>(null);
  const material2Ref = useRef<MeshStandardMaterial>(null);
  const uniformsRef = useRef<{
    uTime: { value: number };
    uFadeoutEdgeStart: { value: number };
    uFadeoutEdgeEnd: { value: number };
  } | null>(null);
  const uniforms2Ref = useRef<{
    uTime: { value: number };
    uFadeoutEdgeStart: { value: number };
    uFadeoutEdgeEnd: { value: number };
  } | null>(null);

  useFrame((state, delta) => {
    if (uniformsRef.current) {
      uniformsRef.current.uTime.value += delta;
      uniformsRef.current.uFadeoutEdgeStart.value = fadeoutEdgeStart;
      uniformsRef.current.uFadeoutEdgeEnd.value = fadeoutEdgeEnd;
    }

    if (uniforms2Ref.current) {
      uniforms2Ref.current.uTime.value += delta;
      uniforms2Ref.current.uFadeoutEdgeStart.value = fadeoutEdgeStart;
      uniforms2Ref.current.uFadeoutEdgeEnd.value = fadeoutEdgeEnd;
    }
  });

  return (
    <group>
      <mesh
        receiveShadow
        visible={true}
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3 * 20, 3 * 20, 64, 64]} />
        {/* <circleGeometry args={[5, 128, 128]} /> */}
        <meshStandardMaterial
          ref={materialRef}
          wireframe={false}
          side={DoubleSide}
          transparent
          onBeforeCompile={(params) => {
            params.uniforms.uTime = { value: 100 };
            params.uniforms.uFadeoutEdgeStart = { value: fadeoutEdgeStart };
            params.uniforms.uFadeoutEdgeEnd = { value: fadeoutEdgeEnd };
            uniformsRef.current = params.uniforms as any;

            params.vertexShader = params.vertexShader.replace(
              "#include <clipping_planes_pars_vertex>",
              `#include <clipping_planes_pars_vertex>
              uniform float uTime;
              varying vec3 vCustomWorldPosition;`,
            );

            params.vertexShader = params.vertexShader.replace(
              "#include <displacementmap_vertex>",
              `#include <displacementmap_vertex>
            float PIZZA = 3.141592653589793;
            transformed.z += sin(PIZZA * 2.0 * uv.x + uTime) * 0.0;`,
            );

            params.vertexShader = params.vertexShader.replace(
              "#include <fog_vertex>",
              `#include <fog_vertex>
            vCustomWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
            );

            params.fragmentShader = params.fragmentShader.replace(
              "#include <common>",
              `#include <common>
                  uniform float uTime;
                  uniform float uFadeoutEdgeStart;
                  uniform float uFadeoutEdgeEnd;
                  varying vec3 vCustomWorldPosition;`,
            );

            params.fragmentShader = params.fragmentShader.replace(
              "#include <dithering_fragment>",
              `#include <dithering_fragment>
                  // Custom fragment shader code can go here
                  vec3 origin = vec3(0.0, 0.0, 0.0);
                  float distanceFromOrigin = distance(vCustomWorldPosition, origin);
                  float closeToCenter = 1.0 - step(3.1, distanceFromOrigin);
                  float fadeOut = smoothstep(uFadeoutEdgeStart, uFadeoutEdgeEnd, distanceFromOrigin);
                  float radialPulse = fract(distanceFromOrigin - uTime * 0.25);
                  radialPulse *= 1.0 - step(uTime * 0.25, distanceFromOrigin);
                  float pulse = smoothstep(0.3, 0.29, 1.0 - radialPulse) + closeToCenter;
                  pulse = clamp(pulse, 0.0, 1.0);
                  vec3 tempColor = gl_FragColor.rgb;
                  vec3 color = mix(tempColor, vec3(1.0, 1.0, 1.0), pulse);
                  // gl_FragColor.rgb = color;
                  gl_FragColor.a = (1.0 - pulse) * fadeOut;
                  `,
            );
          }}
          color={pulseColor}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      <mesh
        receiveShadow
        visible={true}
        position={[0, -3.0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3 * 20, 3 * 20, 64, 64]} />
        {/* <circleGeometry args={[5, 128, 128]} /> */}
        <meshStandardMaterial
          transparent
          ref={material2Ref}
          wireframe={false}
          side={DoubleSide}
          color={baseColor}
          metalness={metalness}
          roughness={roughness}
          onBeforeCompile={(params) => {
            params.uniforms.uTime = { value: 100 };
            params.uniforms.uFadeoutEdgeStart = { value: fadeoutEdgeStart };
            params.uniforms.uFadeoutEdgeEnd = { value: fadeoutEdgeEnd };
            uniforms2Ref.current = params.uniforms as any;

            params.vertexShader = params.vertexShader.replace(
              "#include <clipping_planes_pars_vertex>",
              `#include <clipping_planes_pars_vertex>
              uniform float uTime;
              varying vec3 vCustomWorldPosition;`,
            );

            params.vertexShader = params.vertexShader.replace(
              "#include <displacementmap_vertex>",
              `#include <displacementmap_vertex>
            float PIZZA = 3.141592653589793;
            transformed.z += sin(PIZZA * 2.0 * uv.x + uTime) * 0.0;`,
            );

            params.vertexShader = params.vertexShader.replace(
              "#include <fog_vertex>",
              `#include <fog_vertex>
            vCustomWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
            );

            params.fragmentShader = params.fragmentShader.replace(
              "#include <common>",
              `#include <common>
                  uniform float uTime;
                  uniform float uFadeoutEdgeStart;
                  uniform float uFadeoutEdgeEnd;
                  varying vec3 vCustomWorldPosition;`,
            );

            params.fragmentShader = params.fragmentShader.replace(
              "#include <dithering_fragment>",
              `#include <dithering_fragment>
                  // Custom fragment shader code can go here
                  vec3 origin = vec3(0.0, 0.0, 0.0);
                  float distanceFromOrigin = distance(vCustomWorldPosition, origin);
                  float closeToCenter = 1.0 - step(3.1, distanceFromOrigin);
                  float fadeOut = smoothstep(uFadeoutEdgeStart, uFadeoutEdgeEnd, distanceFromOrigin);
                  float radialPulse = fract(distanceFromOrigin - uTime * 0.25);
                  radialPulse *= 1.0 - step(uTime * 0.25, distanceFromOrigin);
                  float pulse = smoothstep(0.3, 0.29, 1.0 - radialPulse) + closeToCenter;
                  pulse = clamp(pulse, 0.0, 1.0);
                  vec3 tempColor = gl_FragColor.rgb;
                  vec3 color = mix(tempColor, vec3(1.0, 1.0, 1.0), pulse);
                  // gl_FragColor.rgb = color;
                  gl_FragColor.a = pulse * fadeOut;
                  `,
            );
          }}
        />
      </mesh>
    </group>
  );
}

function Experience() {
  const lightPosition = useControls("Directional Light", {
    x: { value: 0, min: -20, max: 20, step: 0.1 },
    y: { value: 6.5, min: 0, max: 20, step: 0.1 },
    z: { value: -8.0, min: -20, max: 20, step: 0.1 },
  });

  const modelPosition = useControls("Model Position", {
    x: { value: 0, min: -20, max: 20, step: 0.1 },
    y: { value: -3, min: -10, max: 20, step: 0.1 },
    z: { value: 0, min: -20, max: 20, step: 0.1 },
  });

  const cameraPosition = useControls("Camera Position", {
    x: { value: 0, min: -20, max: 20, step: 0.1 },
    y: { value: -2.0, min: -10, max: 20, step: 0.1 },
    z: { value: 5.8, min: -20, max: 20, step: 0.1 },
  });

  const lightRef = useRef<DirectionalLight>(null!);
  // useHelper(lightRef, DirectionalLightHelper, 1, "red");

  useFrame((state) => {
    state.camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Fragment>
      <ambientLight intensity={2.5} />
      <directionalLight
        ref={lightRef}
        position={[lightPosition.x, lightPosition.y, lightPosition.z]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
        shadow-radius={4}
      />

      <Floor />

      <mesh position={[0, -2.5, 0]} castShadow visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" metalness={0.2} roughness={0.3} />
      </mesh>

      <group position={[0, modelPosition.y, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Android isPressed={false} idle opacity={1} wireframe={false} />
      </group>
    </Fragment>
  );
}

const letters = ["U", "M", "B", "R", "A", "L"];
const fontWeights = [
  "font-extrabold",
  "font-bold",
  "font-semibold",
  "font-medium",
  "font-normal",
  "font-light",
];

export default function Page() {
  return (
    <Fragment>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        shadows
        camera={
          {
            // position: [0, 0, 1.5],
          }
        }
      >
        <Stats />

        <OrbitControls enabled={false} />

        <Experience />

        {/* <fog attach="fog" args={["#fff", 5, 25]} /> */}
        <color attach="background" args={["#d6d6cf"]} />
      </Canvas>

      <div className="fixed inset-0 flex justify-center items-center">
        <h1 className="text-7xl mb-40 text-[#28282a]">
          {letters?.map((letter, index) => {
            return (
              <span key={index} className={fontWeights[index]}>
                {letter}
              </span>
            );
          })}
        </h1>
      </div>
    </Fragment>
  );
}
