import FaceLandmarkManager from "../utils/FaceLandmarkManager";
import { useEffect, useRef } from "react";

interface DrawLandmarkCanvasProps {
  width: number;
  height: number;
}
export default function DrawLandmarkCanvas({
  width,
  height,
}: DrawLandmarkCanvasProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef(0);

  const animate = () => {
    if (drawCanvasRef.current) {
      drawCanvasRef.current.width = width;
      drawCanvasRef.current.height = height;
      const faceLandmarkManager = FaceLandmarkManager.getInstance();
      faceLandmarkManager.drawLandmarks(drawCanvasRef.current);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        transform: "scaleX(-1)",
      }}
      ref={drawCanvasRef}
    ></canvas>
  );
}
