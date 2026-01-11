import { useRef, useState, useEffect } from "react";

function App() {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("-");
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 420, 420);
  }, []);

  const draw = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 12, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 420, 420);
    setPrediction("-");
    setConfidence(0);
  };

  const predictDigit = async () => {
    setLoading(true);
    const image = canvasRef.current.toDataURL("image/png");

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const data = await res.json();

    setPrediction(data.digit);
    setConfidence(data.confidence);

    setHistory((prev) => [
      { digit: data.digit, confidence: data.confidence, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);

    drawBoundingBox(data.bbox);
    setLoading(false);
  };

  const clamp = (v) => Math.max(0, Math.min(1, v));

  const drawBoundingBox = ([xmin, ymin, xmax, ymax]) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    xmin = clamp(xmin);
    ymin = clamp(ymin);
    xmax = clamp(xmax);
    ymax = clamp(ymax);

    const x = xmin * canvas.width;
    const y = ymin * canvas.height;
    const w = (xmax - xmin) * canvas.width;
    const h = (ymax - ymin) * canvas.height;

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, w, h);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", background: "linear-gradient(135deg,#667eea,#764ba2)" }}>
      
      {/* Sidebar */}
      <div style={{ width: 300, background: "#0f172a", color: "white", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        <h2>🤖 Digit AI</h2>

        <button onClick={clearCanvas} style={btnGray}>🧹 Clear</button>
        <button onClick={predictDigit} style={btnPrimary}>
          {loading ? "🔍 Detecting..." : "🚀 Predict"}
        </button>

        <div style={card}>
          <h3>📊 Result</h3>
          <p style={{ fontSize: 26 }}>Digit: <b style={{ color: "#60a5fa" }}>{prediction}</b></p>
          <p>Confidence: <b>{confidence}%</b></p>

          <div style={{ height: 10, background: "#1e293b", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ width: `${confidence}%`, height: "100%", background: "#22c55e" }}></div>
          </div>
        </div>

        <div style={card}>
          <h3>🕒 History</h3>
          {history.length === 0 && <p style={{ opacity: 0.6 }}>No predictions yet</p>}
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Digit {h.digit}</span>
              <span>{h.confidence}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
          <h1 style={{ textAlign: "center" }}>✍️ Draw a Digit</h1>

          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            onMouseMove={(e) => e.buttons === 1 && draw(e)}
            style={{ border: "4px solid #0f172a", borderRadius: 16, cursor: "crosshair" }}
          />

          <p style={{ textAlign: "center", marginTop: 10 }}>
            Draw and click <b>Predict</b>
          </p>
        </div>
      </div>
    </div>
  );
}

const btnPrimary = {
  padding: 14,
  borderRadius: 10,
  border: "none",
  background: "#6366f1",
  color: "white",
  fontSize: 16,
  cursor: "pointer"
};

const btnGray = {
  ...btnPrimary,
  background: "#334155"
};

const card = {
  background: "#020617",
  padding: 16,
  borderRadius: 12
};

export default App;
