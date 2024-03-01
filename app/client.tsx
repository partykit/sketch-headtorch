import "./styles.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import EyeTracker from "./components/EyeTracker";
import Debug from "./components/Debug";
import Frame from "./components/Frame";
import Scene from "./components/Scene";

function App() {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <main style={{ display: "flex", gap: "1rem" }}>
      <div>
        <EyeTracker setIsTracking={setIsTracking} />
        {isTracking && <Debug />}
      </div>
      <Frame>
        <Scene />
      </Frame>
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
