import React, { createRef, Fragment, useEffect, useRef } from "react";
import { Group } from "three";
import { useTexture } from "@react-three/drei";
import { NUMBER_OF_CARDS, textures } from "@/utils/static";
import { Card } from "./card";
import { useLenis } from "lenis/react";
import Lenis from "lenis";
import { Leva, useControls } from "leva";
import { VerticalCard } from "./vertical-card";

export function VerticalExperience() {
  const groupRef = useRef<Group>(null);
  const materialRefs = useRef(
    Array.from({ length: NUMBER_OF_CARDS }).map(() => createRef<any>())
  );

  // useControls({
  //   curveIntensity: {
  //     min: 1,
  //     max: 4,
  //     value: 2.5,
  //     step: 0.1,
  //     onChange: (e) => {
  //       materialRefs.current.forEach((item) => {
  //         item.current.uniforms.uIntensity.value = e;
  //       });
  //     },
  //   },

  //   curveDistance: {
  //     min: 0.1,
  //     max: 1,
  //     value: 0.9,
  //     step: 0.1,
  //     onChange: (e) => {
  //       materialRefs.current.forEach((item) => {
  //         item.current.uniforms.uCurveDistance.value = 1 - e;
  //       });
  //     },
  //   },
  // });

  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    handleScroll(lenis);
    function handleScroll(e: Lenis) {
      if (groupRef.current) {
        groupRef.current.position.y = -e.progress * (NUMBER_OF_CARDS - 1) * 1.3;

        materialRefs.current.forEach((item) => {
          item.current.uniforms.uRgbOffset.value.x = e.velocity * 0.001;
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
              <VerticalCard
                ref={materialRefs.current[index]}
                key={index}
                index={index}
                texture={texture}
                positionY={index * 1.3}
              />
            );
          })}
      </group>
    </Fragment>
  );
}
