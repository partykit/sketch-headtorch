import "./styles.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import EyeTracker from "./components/EyeTracker";
import Debug from "./components/Debug";
import Frame from "./components/Frame";
import Scene from "./components/Scene";
import PresenceProvider from "./presence/presence-context";

const pageId = window?.location.href
  ? btoa(window.location.href.split(/[?#]/)[0])
  : "default";

function App() {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <PresenceProvider
      room={pageId}
      presence={{
        name: "Anonymous User",
        color: "#0000f0",
      }}
    >
      <main style={{ display: "flex", gap: "1rem" }}>
        <div>
          <EyeTracker setIsTracking={setIsTracking} />
          {isTracking && <Debug />}
        </div>
        <Frame>
          <Scene />
        </Frame>
      </main>
    </PresenceProvider>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
