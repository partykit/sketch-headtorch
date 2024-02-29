import "./styles.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import EyeTracker from "./components/EyeTracker";
import Debug from "./components/Debug";

function App() {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <main style={{ width: "100%", minHeight: "100dvh", position: "relative" }}>
      <EyeTracker setIsTracking={setIsTracking} />
      {isTracking && <Debug />}
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
