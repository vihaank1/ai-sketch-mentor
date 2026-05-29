import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "./lib/supabaseClient";

import SkillBars from "./components/SkillBars";
import ProgressDashboard from "./components/ProgressDashboard";

function App() {
  // =====================
  // AUTH STATE
  // =====================
  const [user, setUser] = useState(null);

  // =====================
  // APP STATE
  // =====================
  const [started, setStarted] = useState(false);

  // =====================
  // INPUT STATE
  // =====================
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [artStyle, setArtStyle] = useState("Realism");
  const [image, setImage] = useState(null);
  const [mentorMode, setMentorMode] = useState("supportive");

  // =====================
  // UI STATE
  // =====================
  const [result, setResult] = useState(null);
  const [challenge, setChallenge] = useState("");
  const [streak, setStreak] = useState(0);

  // =====================
  // AUTH INIT
  // =====================
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // =====================
  // AUTH
  // =====================
  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // =====================
  // ANALYZE
  // =====================
  const analyzeSketch = async () => {
    try {
      if (!user) return alert("Login required");

      const formData = new FormData();

      formData.append("description", description);
      formData.append("goal", goal);
      formData.append("difficulty", difficulty);
      formData.append("art_style", artStyle);
      formData.append("mentor_mode", mentorMode);
      formData.append("user_id", user.id);

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://127.0.0.1:8000/analyze-sketch",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);

      if (res.data?.progress?.streak) {
        setStreak(res.data.progress.streak);
      }

    } catch (e) {
      console.log(e);
    }
  };

  // =====================
  // DAILY CHALLENGE
  // =====================
  const getChallenge = async () => {
    const res = await axios.get("http://127.0.0.1:8000/daily-challenge");
    setChallenge(res.data?.challenge || "");
  };

  // =====================
  // LANDING PAGE
  // =====================
  if (!started) {
    return (
      <div style={landing}>
        <div style={glassHero}>
          <h1 style={{ fontSize: 52 }}>AI Sketch Mentor</h1>
          <p style={{ opacity: 0.7, fontSize: 18 }}>
            A precision art feedback system that analyzes your drawings like a professional mentor.
          </p>

          <button style={cta} onClick={() => setStarted(true)}>
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // =====================
  // APP UI
  // =====================
  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <h1 style={{ fontSize: 22 }}>🎨 AI Sketch Mentor</h1>

        <div style={{ display: "flex", gap: 10 }}>
          {user ? (
            <>
              <span style={badge}>{user.email}</span>
              <button style={btn} onClick={logout}>Logout</button>
            </>
          ) : (
            <button style={btn} onClick={login}>Login</button>
          )}
        </div>
      </div>

      {!user ? (
        <div style={card}>Please login to continue</div>
      ) : (
        <>
          {/* INPUT CARD */}
          <div style={card}>
            <input placeholder="Describe sketch" value={description}
              onChange={(e) => setDescription(e.target.value)} style={input} />

            <input placeholder="Goal" value={goal}
              onChange={(e) => setGoal(e.target.value)} style={input} />

            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={input}>
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>

            <select value={artStyle} onChange={(e) => setArtStyle(e.target.value)} style={input}>
              <option>Realism</option>
              <option>Manga</option>
              <option>Anime</option>
            </select>

            <select value={mentorMode} onChange={(e) => setMentorMode(e.target.value)} style={input}>
              <option value="supportive">Supportive</option>
              <option value="harsh">Harsh</option>
            </select>

            <input type="file" onChange={(e) => setImage(e.target.files[0])} />

            <div style={{ marginTop: 12 }}>
              <button onClick={analyzeSketch} style={primaryBtn}>Analyze</button>
              <button onClick={getChallenge} style={secondaryBtn}>Challenge</button>
            </div>

            {challenge && <p style={{ color: "#ffd700" }}>{challenge}</p>}
          </div>

          {/* RESULTS */}
          {result && (
            <div style={card}>
              <h2>Insight Report</h2>
              <p>{result.critique}</p>

              <h3>Strengths</h3>
              {(result.strengths || []).map((s, i) => <p key={i}>• {s}</p>)}

              <h3>Weaknesses</h3>
              {(result.weaknesses || []).map((w, i) => <p key={i}>• {w}</p>)}

              <h3>Next Step</h3>
              <p>{result.next_step}</p>

              <h3>Score</h3>
              <p>{result.confidence_score}/100</p>

              <h3>🔥 Streak: {streak}</h3>

              <SkillBars progress={result?.progress || {}} />
              <ProgressDashboard progress={result?.progress || {}} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =====================
   STRIPE-STYLE UI SYSTEM
===================== */

const landing = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #111, #000)"
};

const glassHero = {
  padding: "60px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px)",
  textAlign: "center",
  maxWidth: 600
};

const cta = {
  marginTop: 20,
  padding: "12px 24px",
  background: "#00ff99",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer"
};

const page = {
  background: "#0b0b0b",
  minHeight: "100vh",
  padding: "40px",
  color: "white",
  fontFamily: "Arial"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20
};

const card = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "20px",
  marginTop: "20px",
  backdropFilter: "blur(10px)"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "10px",
  border: "none",
  outline: "none"
};

const btn = {
  padding: "8px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "white"
};

const primaryBtn = {
  background: "#00ff99",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  marginRight: 10
};

const secondaryBtn = {
  background: "#222",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)"
};

const badge = {
  background: "rgba(0,255,153,0.1)",
  border: "1px solid #00ff99",
  padding: "6px 10px",
  borderRadius: "20px"
};

export default App;