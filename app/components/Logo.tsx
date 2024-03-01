// How to load models
// https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Html, useProgress } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

export default function Logo() {
  const gltf = useLoader(GLTFLoader, "/assets/PartyKit_3DLogo_19Oct.gltf");
  //const gltf = useLoader(GLTFLoader, "/assets/PK-Balloon_logo.gltf");
  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  return <primitive object={gltf.scene} scale={[5, 5, 5]} />;
}
