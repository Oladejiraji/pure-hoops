"use client";
import React, { Fragment, useRef } from "react";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import vertexShader from "@/shaders/umbral/vertex.glsl";
import fragmentShader from "@/shaders/umbral/fragment.glsl";
import { DirectionalLight, DoubleSide, MeshStandardMaterial } from "three";
import { Android } from "@/components/models/android";

const CardMaterial = shaderMaterial({}, vertexShader, fragmentShader);
extend({ CardMaterial });

const FLOOR_METALNESS = 0.5;
const FLOOR_ROUGHNESS = 0.5;
const FADEOUT_EDGE_START = 7.0;
const FADEOUT_EDGE_END = 4.5;
const PULSE_COLOR = "#282828";
const BASE_COLOR = "#d6d6cf";

function Floor() {
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
      uniformsRef.current.uFadeoutEdgeStart.value = FADEOUT_EDGE_START;
      uniformsRef.current.uFadeoutEdgeEnd.value = FADEOUT_EDGE_END;
    }
    if (uniforms2Ref.current) {
      uniforms2Ref.current.uTime.value += delta;
      uniforms2Ref.current.uFadeoutEdgeStart.value = FADEOUT_EDGE_START;
      uniforms2Ref.current.uFadeoutEdgeEnd.value = FADEOUT_EDGE_END;
    }
  });

  const shaderPatch = (
    params: any,
    ref: React.MutableRefObject<any>,
    alphaExpr: string,
  ) => {
    params.uniforms.uTime = { value: 100 };
    params.uniforms.uFadeoutEdgeStart = { value: FADEOUT_EDGE_START };
    params.uniforms.uFadeoutEdgeEnd = { value: FADEOUT_EDGE_END };
    ref.current = params.uniforms;

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
      gl_FragColor.a = ${alphaExpr};`,
    );
  };

  return (
    <group>
      <mesh
        receiveShadow
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[60, 60, 64, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          wireframe={false}
          side={DoubleSide}
          transparent
          onBeforeCompile={(params) =>
            shaderPatch(params, uniformsRef, "(1.0 - pulse) * fadeOut")
          }
          color={PULSE_COLOR}
          metalness={FLOOR_METALNESS}
          roughness={FLOOR_ROUGHNESS}
        />
      </mesh>
      <mesh
        receiveShadow
        position={[0, -3.0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[60, 60, 64, 64]} />
        <meshStandardMaterial
          transparent
          ref={material2Ref}
          wireframe={false}
          side={DoubleSide}
          color={BASE_COLOR}
          metalness={FLOOR_METALNESS}
          roughness={FLOOR_ROUGHNESS}
          onBeforeCompile={(params) =>
            shaderPatch(params, uniforms2Ref, "pulse * fadeOut")
          }
        />
      </mesh>
    </group>
  );
}

interface UmbralExperienceProps {
  cameraY?: number;
  cameraZ?: number;
  modelY?: number;
}

function Experience({
  cameraY = -2.0,
  cameraZ = 5.8,
  modelY = -3,
}: UmbralExperienceProps) {
  const lightRef = useRef<DirectionalLight>(null!);

  useFrame((state) => {
    state.camera.position.set(0, cameraY, cameraZ);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Fragment>
      <ambientLight intensity={2.5} />
      <directionalLight
        ref={lightRef}
        position={[0, 6.5, -8.0]}
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
      <group position={[0, modelY, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Android isPressed={false} idle opacity={1} wireframe={false} />
      </group>
    </Fragment>
  );
}

interface UmbralSceneProps {
  cameraY?: number;
  cameraZ?: number;
  modelY?: number;
}

export default function UmbralScene({
  cameraY,
  cameraZ,
  modelY,
}: UmbralSceneProps) {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      shadows
    >
      <OrbitControls enabled={false} />
      <Experience cameraY={cameraY} cameraZ={cameraZ} modelY={modelY} />
      <color attach="background" args={["#d6d6cf"]} />
    </Canvas>
  );
}
