// The basic demo is needs adjusting (light intensity) to work
// https://github.com/pmndrs/react-three-fiber/issues/2963

import * as THREE from "three";
import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { useHelper, PerspectiveCamera } from "@react-three/drei";
//import { useCursors } from "@/app/providers/cursors-context";
import Logo, { Loader } from "./Logo";

function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "white"} />
    </mesh>
  );
}

function CameraComponent(props) {
  const ref = useThree((state) => state.camera);
  useFrame(() => ref.current.updateProjectionMatrix());

  return <perspectiveCamera ref={ref} {...props} />;
}

function Light(props: { x: number; y: number; z: number; color: string }) {
  const rLight = useRef<THREE.SpotLight>(null!);
  //useHelper(rLight, THREE.SpotLightHelper, "red");

  return (
    <>
      <spotLight
        ref={rLight}
        position={[props.x, props.y, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1000}
        color={props.color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />
    </>
  );
}

function BackgroundPlane() {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
      <planeGeometry attach="geometry" args={[10, 10]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}

export default function Scene() {
  const rCanvas = useRef<HTMLCanvasElement>(null!);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseInCanvas, setMouseInCanvas] = useState(false);

  // color is a memoized random value of "red" or "blue" or "green"
  const color = useMemo(() => {
    const colors = ["red", "blue", "green"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  //const { others, socket } = useCursors();

  const handleMouseMove = (event: any) => {
    if (!rCanvas.current) return;
    if (!mouseInCanvas) return;

    // Get the x,y coordinates of the mouse relative to the canvas
    const { clientX, clientY } = event;
    const { left, top } = rCanvas.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    setMousePosition({ x, y });
    //socket?.send(JSON.stringify({ pointer: "mouse", x, y, color }));
    console.log("mouse position", x, y);
  };

  return (
    <>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        ref={rCanvas}
        onMouseEnter={() => setMouseInCanvas(true)}
        onMouseLeave={() => setMouseInCanvas(false)}
        onMouseMove={handleMouseMove}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={10} />
        <ambientLight intensity={0.4} />
        <Light
          x={-5 + mousePosition.x / 70}
          y={5 - mousePosition.y / 70}
          z={10}
          color={color}
        />

        <Suspense fallback={<Loader />}>
          <Logo />
        </Suspense>
        {/*
      {Object.entries(others).map(([id, cursor]) => (
        <Light
          key={id}
          x={-5 + cursor.x / 70}
          y={5 - cursor.y / 70}
          z={10}
          color={cursor.color || "white"}
        />
      ))}*/}
        <pointLight position={[-10, -10, -10]} intensity={400} />
        {/*<Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />*/}
        <BackgroundPlane />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: "0.25rem",
          left: "0.25rem",
          color: "white",
        }}
      >
        <div>mousePosition.x: {mousePosition.x}</div>
        <div>mousePosition.y: {mousePosition.y}</div>
        <div>mouseInCanvas: {mouseInCanvas ? "true" : "false"}</div>
      </div>
    </>
  );
}
