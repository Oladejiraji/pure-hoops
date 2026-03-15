import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { Texture, Vector2 } from "three";
import vertexShader from "../../shaders/template/vertex.glsl";
import fragmentShader from "../../shaders/template/fragment.glsl";

const CardMaterial = shaderMaterial(
  {
    uTime: 0,
    uTransition: 0,
    uTexture: null,
    uNextTexture: null,
    uCardSize: new Vector2(0),
    uImageResolution: new Vector2(0),
    uNextImageResolution: new Vector2(0),
  },
  vertexShader,
  fragmentShader,
);

extend({ CardMaterial });

function getResolution(texture: Texture): [number, number] {
  const img = texture.image;
  if (!img) return [1920, 1080];
  // Video elements use videoWidth/videoHeight
  if (img.videoWidth) return [img.videoWidth, img.videoHeight];
  // Image elements use width/height
  if (img.width) return [img.width, img.height];
  return [1920, 1080];
}

interface IProps {
  texture: Texture;
  nextTexture: Texture;
}

export const PixelatedCarouselPlane = forwardRef<any, IProps>((props, ref) => {
  const { texture, nextTexture } = props;
  const matRef = useRef<any>(null);

  useImperativeHandle(ref, () => matRef.current, []);

  const { height, width, aspect } = useThree((state) => state.viewport);

  // Keep resolution uniforms in sync every frame
  useFrame(() => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;

    const [tw, th] = getResolution(u.uTexture.value);
    u.uImageResolution.value.set(tw, th);

    const [nw, nh] = getResolution(u.uNextTexture.value);
    u.uNextImageResolution.value.set(nw, nh);
  });

  return (
    <mesh>
      <planeGeometry args={[width, height, Math.ceil(aspect * 64), 64]} />
      {/* @ts-ignore */}
      <cardMaterial
        ref={matRef}
        uTexture={texture}
        uNextTexture={nextTexture}
        uCardSize={new Vector2(width, height)}
      />
    </mesh>
  );
});

PixelatedCarouselPlane.displayName = "PixelatedCarouselPlane";
