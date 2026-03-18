import React, { createRef, Fragment, useEffect, useRef } from "react";
import { Group } from "three";
import { useTexture } from "@react-three/drei";
import { NUMBER_OF_CARDS, textures } from "@/utils/static";
import { Card } from "./card";
import { useLenis } from "lenis/react";
import Lenis from "lenis";

export function Experience() {
  const groupRef = useRef<Group>(null);
  const materialRefs = useRef(
    Array.from({ length: NUMBER_OF_CARDS }).map(() => createRef<any>()),
  );

  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    handleScroll(lenis);
    function handleScroll(e: Lenis) {
      if (groupRef.current) {
        groupRef.current.position.x = -e.progress * (NUMBER_OF_CARDS - 1) * 1.2;

        materialRefs.current.forEach((item) => {
          if (item.current)
            item.current.uniforms.uRgbOffset.value.x = e.velocity * 0.002;
        });
      }
    }
    lenis?.on("scroll", handleScroll);

    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return (
    <Fragment>
      <group ref={groupRef}>
        {Array(NUMBER_OF_CARDS)
          .fill(0)
          .map((_, index) => {
            const texture = useTexture(textures[index % textures.length]);
            return (
              <Card
                ref={materialRefs.current[index]}
                key={index}
                index={index}
                texture={texture}
                positionX={index * 1.2}
              />
            );
          })}
      </group>
    </Fragment>
  );
}
