import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

export default function ProgressDashboard({ progress }) {

  const data = [
    { skill: "Anatomy", value: progress?.anatomy || 0 },
    { skill: "Shading", value: progress?.shading || 0 },
    { skill: "Perspective", value: progress?.perspective || 0 },
    { skill: "Composition", value: progress?.composition || 0 },
    { skill: "Line", value: progress?.line_confidence || 0 }
  ];

  return (
    <div style={{ marginTop: 30, height: 280 }}>

      <h2 style={{ marginBottom: 10 }}>
        📊 Growth Radar
      </h2>

      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis />
          <Radar
            dataKey="value"
            fill="#00ff99"
            fillOpacity={0.4}
            stroke="#00ff99"
          />
        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
}