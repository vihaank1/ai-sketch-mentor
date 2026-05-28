export default function Card({ title, children }) {
    return (
      <div style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "20px"
      }}>
        <h2 style={{ color: "#00ff99" }}>{title}</h2>
        <div>{children}</div>
      </div>
    );
  }