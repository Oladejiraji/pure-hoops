import React, { forwardRef } from "react";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { Vector2 } from "three";
import fragmentShader from "../../shaders/fragment.glsl";
import vertexShader from "../../shaders/vertex.glsl";

const CardMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0,
    uCurveDistance: 0,
    uTexture: null,
    uPlaneSize: new Vector2(0, 0),
    uImageRes: new Vector2(0, 0),
    uRgbOffset: new Vector2(0, 0),
  },
  vertexShader,
  fragmentShader
);

extend({ CardMaterial });

interface IProps {
  index: number;
  texture: any;
  positionX?: number;
  positionY?: number;
}

export const Card = forwardRef<any, IProps>((props, ref) => {
  const { index, texture, positionX = 0, positionY = 0 } = props;

  return (
    <mesh key={index} position-x={positionX} position-y={positionY}>
      <planeGeometry args={[1, 1.2, 32, 32]} />
      {/* @ts-ignore */}
      <cardMaterial
        ref={ref}
        wireframe={false}
        uTexture={texture}
        uImageRes={
          new Vector2(texture.source.data.width, texture.source.data.height)
        }
        uIntensity={2.5}
        uPlaneSize={new Vector2(1, 1.2)}
      />
    </mesh>
  );
});
