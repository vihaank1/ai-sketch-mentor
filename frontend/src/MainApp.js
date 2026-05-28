import { useState } from "react";
import App from "./App";

export default function MainApp() {

  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div style={landing}>

        <h1 style={{ fontSize: 48, color: "#00ff99" }}>
          🎨 AI Sketch Mentor
        </h1>

        <p style={{ opacity: 0.7 }}>
          A personal AI art coach that tracks your improvement.
        </p>

        <button style={btn} onClick={() => setStarted(true)}>
          Start Training →
        </button>

      </div>
    );
  }

  return <App />;
}

const landing = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#0b0b0b",
  color: "white",
  textAlign: "center"
};

const btn = {
  marginTop: 20,
  padding: "12px 24px",
  background: "#00ff99",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};