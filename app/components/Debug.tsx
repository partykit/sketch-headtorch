import {
  FaceLandmarker,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import FaceLandmarkManager from "../utils/FaceLandmarkManager";
import { useEffect, useRef, useState } from "react";

export default function Debug() {
  const requestRef = useRef(0);
  const [results, setResults] = useState<FaceLandmarkerResult>();

  const animate = () => {
    const faceLandmarkManager = FaceLandmarkManager.getInstance();
    setResults(faceLandmarkManager.getResults());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const landmarkCoordinates = FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS.map(
    (landmark, i) =>
      results?.faceLandmarks[0]?.[landmark.start] ?? { x: 0, y: 0, z: 0 }
  );

  const averageX =
    landmarkCoordinates.reduce((sum, landmark) => sum + landmark.x, 0) /
    landmarkCoordinates.length;
  const averageY =
    landmarkCoordinates.reduce((sum, landmark) => sum + landmark.y, 0) /
    landmarkCoordinates.length;
  const averageZ =
    landmarkCoordinates.reduce((sum, landmark) => sum + landmark.z, 0) /
    landmarkCoordinates.length;

  return (
    <div>
      <h3>Debug</h3>
      <details>
        <summary>Right eye</summary>
        <pre>
          {JSON.stringify(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, null, 2)}
        </pre>
      </details>
      <details>
        <summary>Right iris</summary>
        <pre>
          {JSON.stringify(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, null, 2)}
        </pre>
        <div>Average X: {averageX}</div>
        <div>Average Y: {averageY}</div>
        <div>Average Z: {averageZ}</div>
      </details>
      <details>
        <summary>Detailed results</summary>
        <div>Landmarks #: {results?.faceLandmarks[0]?.length}</div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </details>
    </div>
  );
}
