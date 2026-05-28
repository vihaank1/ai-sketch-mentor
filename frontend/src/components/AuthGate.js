import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthGate({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();

  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>🎨 AI Sketch Mentor</h1>
        <button onClick={login}>Login with Google</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>👤 {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {children}
    </div>
  );
}