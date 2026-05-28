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
  // AUTH CHECK ON LOAD
  // =====================
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // =====================
  // LOGIN (simple demo)
  // =====================
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // =====================
  // ANALYZE SKETCH
  // =====================
  const analyzeSketch = async () => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

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

    } catch (err) {
      console.log(err);
      alert("Backend error");
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
  // UI
  // =====================
  return (
    <div style={page}>

      {/* HEADER */}
      <div style={header}>
        <h1 style={{ color: "#00ff99" }}>🎨 AI Sketch Mentor</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          {user ? (
            <>
              <span style={badge}>{user.email}</span>
              <button onClick={logout} style={btn}>Logout</button>
            </>
          ) : (
            <button onClick={login} style={btn}>Login</button>
          )}
        </div>
      </div>

      {/* BLOCK USER IF NOT LOGGED IN */}
      {!user ? (
        <div style={card}>
          <h2>Login required to continue</h2>
        </div>
      ) : (
        <>
          {/* INPUT */}
          <div style={card}>

            <input placeholder="Describe sketch" value={description}
              onChange={(e) => setDescription(e.target.value)} style={input} />

            <input placeholder="Goal" value={goal}
              onChange={(e) => setGoal(e.target.value)} style={input} />

            <select value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)} style={input}>
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>

            <select value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)} style={input}>
              <option>Realism</option>
              <option>Manga</option>
              <option>Anime</option>
            </select>

            <select value={mentorMode}
              onChange={(e) => setMentorMode(e.target.value)} style={input}>
              <option value="supportive">Supportive</option>
              <option value="harsh">Harsh</option>
            </select>

            <input type="file"
              onChange={(e) => setImage(e.target.files[0])} />

            <div style={{ marginTop: 10 }}>
              <button onClick={analyzeSketch} style={primaryBtn}>
                Analyze
              </button>

              <button onClick={getChallenge} style={secondaryBtn}>
                Daily Challenge
              </button>
            </div>

            {challenge && (
              <p style={{ color: "#ffd700" }}>{challenge}</p>
            )}

          </div>

          {/* RESULTS */}
          {result && (
            <div style={card}>

              <h2>🧠 Critique</h2>
              <p>{result.critique}</p>

              <h2>Strengths</h2>
              {(result.strengths || []).map((s, i) => <p key={i}>• {s}</p>)}

              <h2>Weaknesses</h2>
              {(result.weaknesses || []).map((w, i) => <p key={i}>• {w}</p>)}

              <h2>Next Step</h2>
              <p>{result.next_step}</p>

              <h2>Score</h2>
              <p>{result.confidence_score}/100</p>

              <h2>🔥 Streak: {streak}</h2>

              <SkillBars progress={result?.progress || {}} />
              <ProgressDashboard progress={result?.progress || {}} />

            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ===================== UI ===================== */

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
  alignItems: "center"
};

const card = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "16px",
  marginTop: "20px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "10px"
};

const btn = {
  padding: "8px 14px",
  borderRadius: "10px"
};

const primaryBtn = {
  background: "#00ff99",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  marginRight: "10px"
};

const secondaryBtn = {
  background: "#333",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none"
};

const badge = {
  background: "rgba(0,255,153,0.1)",
  border: "1px solid #00ff99",
  padding: "6px 10px",
  borderRadius: "20px"
};

export default App;