import React, { forwardRef } from "react";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { Texture, Vector2 } from "three";
import fragmentShader from "../../shaders/fragment.glsl";
import vertexShader from "../../shaders/vertical/vertex.glsl";

const CardVerticalMaterial = shaderMaterial(
  {
    // uTime: 0,
    uIntensity: 0,
    uCurveDistance: 0,
    uFullSizeX: 10 * 1.2,
    uTexture: null,
    uPlaneSize: new Vector2(0, 0),
    uImageRes: new Vector2(0, 0),
    uRgbOffset: new Vector2(0, 0),
  },

  vertexShader,
  fragmentShader
);

extend({ CardVerticalMaterial });

interface IProps {
  index: number;
  texture: any;
  positionX?: number;
  positionY?: number;
  cardHeight?: number;
  cardWidth?: number;
}

export const VerticalCard = forwardRef<any, IProps>((props, ref) => {
  const {
    index,
    texture,
    positionX = 0,
    positionY = 0,
    cardWidth = 1,
    cardHeight = 1.2,
  } = props;

  return (
    <mesh key={index} position-x={positionX} position-y={positionY}>
      <planeGeometry args={[cardWidth, cardHeight, 32, 32]} />
      {/* @ts-ignore */}
      <cardVerticalMaterial
        ref={ref}
        wireframe={false}
        uTexture={texture}
        uImageRes={
          new Vector2(texture.source.data.width, texture.source.data.height)
        }
        uPlaneSize={new Vector2(1, 1.2)}
        uIntensity={2.5}
        // uPlaneSize={new Vector2(1, 1.2)}
      />
    </mesh>
  );
});
