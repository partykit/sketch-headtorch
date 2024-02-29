import {
  FaceLandmarker,
  type FaceLandmarkerResult,
  type Landmark,
} from "@mediapipe/tasks-vision";
import FaceLandmarkManager from "../utils/FaceLandmarkManager";
import { type Connection } from "../utils/FaceLandmarkManager";
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

  // e.g. FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS
  const getAverage = (landmark: any[]) => {
    const landmarkCoordinates = landmark.map(
      (connection, i) =>
        results?.faceLandmarks[0]?.[connection.start] ?? { x: 0, y: 0, z: 0 }
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

    return { x: averageX, y: averageY, z: averageZ };
  };

  const rightAverage = getAverage(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS);
  const leftAverage = getAverage(FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS);
  const middle = {
    x: (rightAverage.x + leftAverage.x) / 2,
    y: (rightAverage.y + leftAverage.y) / 2,
    z: (rightAverage.z + leftAverage.z) / 2,
  };

  const getBlendShape = (category: string) => {
    return results?.faceBlendshapes[0]?.categories.find(
      (c) => c.categoryName === category
    );
  };

  // All of these are scores of 0 -> 1
  const left = getBlendShape("eyeLookOutLeft")?.score ?? 0;
  const right = getBlendShape("eyeLookOutRight")?.score ?? 0;
  const up = getBlendShape("eyeLookUpRight")?.score ?? 0;
  const down = getBlendShape("eyeLookDownRight")?.score ?? 0;

  let leftright = 0.5;
  if (left ?? 0 > 0.5) {
    leftright = 1 - left;
  } else {
    leftright = right;
  }

  let updown = 0.5;
  if (up ?? 0 > 0.5) {
    updown = 1 - up;
  } else {
    updown = down;
  }

  return (
    <div>
      <div
        style={{
          position: "absolute",
          backgroundColor: "red",
          width: "1rem",
          height: "1rem",
          borderRadius: "9999px",
          top: `${middle.y * 100}%`,
          left: `${(1 - middle.x) * 100}%`,
        }}
      >
        &nbsp;
      </div>
      <h3>Debug</h3>
      <details>
        <summary>blendShapes</summary>
        <ul>
          <li>eyeLookOutLeft: {left}</li>
          <li>eyeLookOutRight: {right}</li>
          <li>eyeLookUpRight: {up}</li>
          <li>eyeLookDownRight: {down}</li>
        </ul>
      </details>
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
        <div>Average X: {rightAverage.x}</div>
        <div>Average Y: {rightAverage.y}</div>
        <div>Average Z: {rightAverage.z}</div>
      </details>
      <details>
        <summary>Detailed results</summary>
        <div>Landmarks #: {results?.faceLandmarks[0]?.length}</div>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </details>
    </div>
  );
}
