// src/components/SkillBars.js

export default function SkillBars({ progress }) {

    return (
      <div style={{ marginTop: "40px" }}>
  
        <h2>📈 Skill Progress</h2>
  
        {Object.entries(progress).map(([skill, value]) => (
  
          typeof value === "number" && (
  
            <div
              key={skill}
              style={{ marginBottom: "20px" }}
            >
  
              <p style={{ marginBottom: "8px" }}>
                {skill}
              </p>
  
              <div
                style={{
                  background: "#333",
                  height: "20px",
                  borderRadius: "10px",
                  overflow: "hidden"
                }}
              >
  
                <div
                  style={{
                    width: `${value}%`,
                    background: "#00ff99",
                    height: "100%",
                    borderRadius: "10px",
                    transition: "0.5s"
                  }}
                />
  
              </div>
  
            </div>
          )
        ))}
  
      </div>
    );
  }