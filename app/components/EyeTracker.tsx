import FaceLandmarkManager from "../utils/FaceLandmarkManager";
import { useEffect, useRef, useState } from "react";
import DrawLandmarkCanvas from "./DrawLandmarkCanvas";

export default function EyeTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(-1);
  const requestRef = useRef(0);
  const [videoSize, setVideoSize] = useState<{
    width: number;
    height: number;
  }>();

  const animate = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      try {
        const faceLandmarkManager = FaceLandmarkManager.getInstance();
        faceLandmarkManager.detectLandmarks(videoRef.current, Date.now());
      } catch (e) {
        console.log(e);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const getUserCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setVideoSize({
              width: videoRef.current!.offsetWidth,
              height: videoRef.current!.offsetHeight,
            });
            videoRef.current!.play();

            // Start animation once video is loaded
            requestRef.current = requestAnimationFrame(animate);
          };
        }
      } catch (e) {
        console.log(e);
        alert("Failed to load webcam!");
      }
    };
    getUserCamera();

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div>
      <video
        className="w-full h-auto"
        ref={videoRef}
        loop={true}
        muted={true}
        autoPlay={true}
        playsInline={true}
        style={{ transform: "scaleX(-1)" }}
      ></video>
      {videoSize && (
        <DrawLandmarkCanvas width={videoSize.width} height={videoSize.height} />
      )}
    </div>
  );
}
