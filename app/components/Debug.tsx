import {
  FaceLandmarker,
  type FaceLandmarkerResult,
  type Landmark,
} from "@mediapipe/tasks-vision";
import FaceLandmarkManager from "../utils/FaceLandmarkManager";
//import { type Connection } from "../utils/FaceLandmarkManager";
import type { Point3D } from "../utils/Maths";
import {
  crossProduct,
  vectorBetweenPoints,
  angleBetweenVectorsWithDirection,
  scaleToRange,
} from "../utils/Maths";
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

    return { x: averageX, y: averageY, z: averageZ } as Point3D;
  };

  const rightAverage = getAverage(FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS);
  const leftAverage = getAverage(FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS);
  const lipsAverage = getAverage(FaceLandmarker.FACE_LANDMARKS_LIPS);

  const avg = (a: number, b: number) => (a + b) / 2;
  const middle = {
    x: avg(rightAverage.x, leftAverage.x),
    y: avg(rightAverage.y, leftAverage.y),
    z: avg(rightAverage.z, leftAverage.z),
  };

  const v1 = vectorBetweenPoints(rightAverage, leftAverage);
  const v2 = vectorBetweenPoints(rightAverage, lipsAverage);
  const normalVector = crossProduct(v1, v2);

  // Projection of normal onto x-z and y-z planes
  const normalXZ: Point3D = { x: normalVector.x, y: 0, z: normalVector.z };
  const normalYZ: Point3D = { x: 0, y: normalVector.y, z: normalVector.z };

  // Screen's z-axis
  const screenZ: Point3D = { x: 0, y: 0, z: 1 };

  // Angles
  const angleLeftRight = angleBetweenVectorsWithDirection(
    normalXZ,
    screenZ,
    normalVector
  );
  const angleUpDown = angleBetweenVectorsWithDirection(
    normalYZ,
    screenZ,
    normalVector
  );

  // Convert angles to degrees if necessary
  const angleLeftRightDeg = angleLeftRight * (180 / Math.PI);
  const angleUpDownDeg = angleUpDown * (180 / Math.PI);

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

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          overflow: "clip",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            backgroundColor: "red",
            width: "1rem",
            height: "1rem",
            borderRadius: "9999px",
            top: `calc(${scaleToRange(middle.y, 0.48, 0.57) * 100}% - 0.5rem)`,
            left: `calc(${
              (1 - scaleToRange(middle.x, 0.38, 0.62)) * 100
            }% - 0.5rem)`,
          }}
        >
          &nbsp;
        </div>
      </div>
      <h3>Debug</h3>
      <details>
        <summary>Face tracking</summary>
        <ul>
          <li>Head x: {middle.x}</li>
          <li>Head y: {middle.y}</li>
          <li>Left-right: {angleLeftRightDeg}</li>
          <li>{`${scaleToRange(-angleLeftRightDeg, -50, 15) * 100}%`}</li>
          <li>Up-down: {angleUpDownDeg}</li>
          <li>{`${scaleToRange(-angleUpDownDeg, -6, 20) * 100}%`}</li>
        </ul>
      </details>
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
