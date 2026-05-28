import { motion } from "framer-motion";

export default function LandingPage({ onStart }) {
  return (
    <div style={styles.container}>

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.title}
      >
        🎨 AI Sketch Mentor
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={styles.subtitle}
      >
        Your personal AI art coach that tracks your improvement like Duolingo for creativity.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        style={styles.button}
      >
        Start Improving →
      </motion.button>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #1a1a1a, #0a0a0a)",
    color: "white",
    textAlign: "center"
  },
  title: {
    fontSize: "50px",
    fontWeight: "bold"
  },
  subtitle: {
    marginTop: "15px",
    fontSize: "18px",
    opacity: 0.7,
    maxWidth: "500px"
  },
  button: {
    marginTop: "30px",
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    background: "#00ff99",
    fontWeight: "bold",
    cursor: "pointer"
  }
};