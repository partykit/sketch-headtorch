import type { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const meshColor = "#f0f0f0";
const faceOvalColor = "#0a84ff";
const lipsColor = "#0a84ff";
const lineWidth = 1.3;
const meshLineWidth = 0.5;

class FaceLandmarkManager {
  private static instance: FaceLandmarkManager = new FaceLandmarkManager();
  private results!: FaceLandmarkerResult;
  faceLandmarker!: FaceLandmarker | null;

  private constructor() {
    this.initializeModel();
  }

  static getInstance(): FaceLandmarkManager {
    return FaceLandmarkManager.instance;
  }

  initializeModel = async () => {
    this.faceLandmarker = null;
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    this.faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );
  };

  getResults = () => {
    return this.results;
  };

  detectLandmarks = (videoElement: HTMLVideoElement, time: number) => {
    if (!this.faceLandmarker) return;

    const results = this.faceLandmarker.detectForVideo(videoElement, time);
    this.results = results;
    return results;
  };

  drawLandmarks = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.results?.faceLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const drawingUtils = new DrawingUtils(ctx);

    for (const landmarks of this.results.faceLandmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: meshColor, lineWidth: meshLineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        { color: "#30FF30", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
        { color: "#30FF30", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
        { color: faceOvalColor, lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LIPS,
        { color: lipsColor, lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
        { color: "#FF3030", lineWidth: lineWidth }
      );
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
        { color: "#30FF30", lineWidth: lineWidth }
      );
    }
  };
}

export default FaceLandmarkManager;
