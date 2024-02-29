import "./styles.css";
import { createRoot } from "react-dom/client";
import EyeTracker from "./components/EyeTracker";

function App() {
  return (
    <main>
      <EyeTracker />
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
