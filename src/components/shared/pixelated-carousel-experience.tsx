import React, { useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { PixelatedCarouselPlane } from "./pixelated-carousel-plane";
import { easing } from "maath";

const videoOpts = {
  muted: true,
  loop: true,
  playsInline: true,
  crossOrigin: "anonymous",
} as const;

interface PixelatedCarouselExperienceProps {
  onIndexChange?: (index: number) => void;
}

export function PixelatedCarouselExperience({ onIndexChange }: PixelatedCarouselExperienceProps) {
  const tex0 = useVideoTexture("/media/videos/pixel1.mp4", videoOpts);
  const tex1 = useVideoTexture("/media/videos/pixel2.mp4", videoOpts);
  const tex2 = useVideoTexture("/media/videos/pixel3.mp4", videoOpts);
  const tex3 = useVideoTexture("/media/videos/pixel4.mp4", videoOpts);
  const textures = [tex0, tex1, tex2, tex3];

  const materialRef = useRef<any>(null);
  const currentIndex = useRef(0);
  const targetTransition = useRef(0);
  const isTransitioning = useRef(false);
  const autoTimerRef = useRef(0);
  const directionRef = useRef(1);

  const getNextIndex = useCallback(
    (dir: number) => {
      return (currentIndex.current + dir + textures.length) % textures.length;
    },
    [textures.length],
  );

  const triggerTransition = useCallback(
    (dir: number) => {
      if (isTransitioning.current) return;
      directionRef.current = dir;
      const nextIdx = getNextIndex(dir);

      if (materialRef.current) {
        const nextTex = textures[nextIdx];
        materialRef.current.uniforms.uNextTexture.value = nextTex;
        materialRef.current.uniforms.uNextImageResolution.value.set(
          nextTex.image.videoWidth || 1920,
          nextTex.image.videoHeight || 1080,
        );
      }

      isTransitioning.current = true;
      targetTransition.current = 1;
      autoTimerRef.current = 0;
    },
    [textures, getNextIndex],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        triggerTransition(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        triggerTransition(-1);
      }
    };

    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleWheel = (e: WheelEvent) => {
      if (wheelTimeout) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      triggerTransition(dir);
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 800);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [triggerTransition]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    const uniforms = materialRef.current.uniforms;

    if (!isTransitioning.current) {
      autoTimerRef.current += delta;
      if (autoTimerRef.current >= 5) {
        triggerTransition(1);
      }
    }

    if (isTransitioning.current) {
      easing.damp(
        uniforms.uTransition,
        "value",
        targetTransition.current,
        0.4,
        delta,
      );

      if (uniforms.uTransition.value > 0.98) {
        uniforms.uTransition.value = 0;
        currentIndex.current = getNextIndex(directionRef.current);

        const curTex = textures[currentIndex.current];
        uniforms.uTexture.value = curTex;
        uniforms.uImageResolution.value.set(
          curTex.image.videoWidth || 1920,
          curTex.image.videoHeight || 1080,
        );

        isTransitioning.current = false;
        targetTransition.current = 0;
        autoTimerRef.current = 0;
        onIndexChange?.(currentIndex.current);
      }
    }
  });

  const nextIdx = getNextIndex(1);

  return (
    <PixelatedCarouselPlane
      ref={materialRef}
      texture={textures[0]}
      nextTexture={textures[nextIdx]}
    />
  );
}
