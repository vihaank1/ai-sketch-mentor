# 🎨 AI Sketch Mentor

A personalized AI art coach that analyzes sketches, tracks artistic growth over time, and generates adaptive practice plans based on user weaknesses.

Built as a full-stack AI system combining vision analysis, structured feedback generation, and skill progression tracking.

---

## 🚀 What This Does

Users upload or describe a sketch and receive:

- Detailed AI critique (composition, anatomy, shading, perspective, line confidence)
- Strengths & weaknesses breakdown
- Personalized practice exercises
- Next-step improvement guidance
- Confidence scoring
- Skill progression tracking over time

The system continuously adapts feedback based on user history and skill trends.

---

## 🧠 Core Features

### 🎯 AI Art Critique Engine
- Structured evaluation of sketches using GPT-4.1-mini
- Multi-dimensional scoring system:
  - Anatomy
  - Shading
  - Perspective
  - Composition
  - Line confidence

### 📈 Skill Progress Tracking
- Visual skill growth over time
- Persistent streak system
- Automatic improvement weighting per submission
- Historical performance tracking

### 🧭 Personalized Mentor System
- Adaptive feedback based on:
  - Beginner / Intermediate / Advanced level
  - Art style preference (Realism, Manga, Anime, Stylized)
  - Mentor mode (Supportive / Direct)

### 🖼️ Image + Text Input Analysis
- Supports both:
  - Uploaded sketches (vision model)
  - Text-described drawings
- Unified feedback pipeline

### 📊 Progress Dashboard
- Radar-style skill visualization
- Real-time skill updates per submission
- Historical improvement insights

---

## 🏗️ System Architecture

**Frontend**
- React
- Axios API layer
- Recharts (skill visualization)
- Glassmorphic UI system

**Backend**
- FastAPI
- OpenAI GPT-4.1-mini
- SQLite (via SQLAlchemy)
- In-memory + persistent history tracking

**AI Pipeline**
1. User input (text + optional image)
2. Prompt engineering with user profile context
3. Structured JSON response generation
4. Skill scoring + progression update
5. History storage + retrieval

---

## 🧩 Key Design Principle

The system is designed around one idea:

> “Every sketch is not just evaluated — it is converted into measurable improvement data.”

Instead of static feedback, the model builds a continuous improvement loop.

---

## 📁 API Endpoints

### POST `/analyze-sketch`
Analyzes a sketch and returns structured critique + skill updates.

### POST `/analyze-image`
Vision-only sketch analysis.

### GET `/history`
Returns recent user sketches and results.

### GET `/daily-challenge`
Returns a randomized practice challenge.

### GET `/user/{username}`
Returns:
- Skill levels
- Streak
- Learning history

---

## 📊 Data Model (Simplified)

```json
{
  "anatomy": 0,
  "shading": 0,
  "perspective": 0,
  "composition": 0,
  "line_confidence": 0,
  "streak": 0
}