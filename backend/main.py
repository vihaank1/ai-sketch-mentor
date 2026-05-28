from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database.db import SessionLocal, UserProgress, Base, engine

from openai import OpenAI
from dotenv import load_dotenv

from services.session_manager import save_history, get_history
from services.challenges import get_daily_challenge

import base64
import os
import json
import re

# =========================
# ENV + DB INIT
# =========================

load_dotenv()
Base.metadata.create_all(bind=engine)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# =========================
# APP INIT
# =========================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# JSON CLEANER (SAFE)
# =========================

def clean_json(raw_text: str):
    cleaned = re.sub(r"```json|```", "", raw_text).strip()
    return json.loads(cleaned)

# =========================
# DB HELPERS
# =========================

def get_or_create_user(username: str, db: Session):
    user = db.query(UserProgress).filter(UserProgress.username == username).first()

    if not user:
        user = UserProgress(username=username)
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


# =========================
# CORE: SKETCH ANALYSIS
# =========================

@app.post("/analyze-sketch")
async def analyze_sketch(
    description: str = Form(...),
    goal: str = Form(...),
    difficulty: str = Form(...),
    art_style: str = Form(None),
    mentor_mode: str = Form("supportive"),
    image: UploadFile = File(None)
):

    image_info = f"Uploaded image: {image.filename}" if image else "No image provided"

    prompt = f"""
You are an elite AI art mentor.

User Profile:
- Style: {art_style}
- Mentor Mode: {mentor_mode}

Input:
- Description: {description}
- Goal: {goal}
- Difficulty: {difficulty}
- Image: {image_info}

Return ONLY valid JSON:

{{
  "critique": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "practice_exercises": ["..."],
  "next_step": "...",
  "confidence_score": 0,

  "progress": {{
    "anatomy": 0,
    "shading": 0,
    "perspective": 0,
    "composition": 0,
    "line_confidence": 0,
    "streak": 1
  }},

  "insights": ["..."]
}}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a professional art mentor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    raw = response.choices[0].message.content

    # =========================
    # SAFE JSON PARSE
    # =========================

    try:
        result = clean_json(raw)
    except Exception:
        return {
            "error": "Invalid JSON from model",
            "raw_response": raw
        }

    # =========================
    # SAVE GLOBAL HISTORY
    # =========================

    save_history({
        "description": description,
        "goal": goal,
        "art_style": art_style,
        "mentor_mode": mentor_mode,
        "result": result
    })

    # =========================
    # PHASE 5 — USER MEMORY (DB UPDATE)
    # =========================

    db = SessionLocal()
    user = get_or_create_user("default_user", db)

    p = result.get("progress", {})

    user.anatomy = int((user.anatomy + p.get("anatomy", 0)) / 2)
    user.shading = int((user.shading + p.get("shading", 0)) / 2)
    user.perspective = int((user.perspective + p.get("perspective", 0)) / 2)
    user.composition = int((user.composition + p.get("composition", 0)) / 2)
    user.line_confidence = int((user.line_confidence + p.get("line_confidence", 0)) / 2)

    user.streak = user.streak + 1

    history = user.history or []
    history.append({
        "description": description,
        "goal": goal,
        "score": result.get("confidence_score", 0)
    })

    user.history = history[-20:]

    db.commit()
    db.close()

    return result


# =========================
# IMAGE-ONLY ANALYSIS
# =========================

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

    image_bytes = await file.read()
    base64_image = base64.b64encode(image_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
Analyze this artwork and return:
- critique
- strengths
- weaknesses
- improvement exercises
"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        temperature=0.5
    )

    return {
        "analysis": response.choices[0].message.content
    }


# =========================
# HISTORY API
# =========================

@app.get("/history")
def history():
    return {"history": get_history()}


# =========================
# DAILY CHALLENGE API
# =========================

@app.get("/daily-challenge")
def daily_challenge():
    return {"challenge": get_daily_challenge()}


# =========================
# USER PROGRESS API (PORTFOLIO FEATURE)
# =========================

@app.get("/user/{username}")
def get_user(username: str):

    db = SessionLocal()
    user = get_or_create_user(username, db)

    data = {
        "skills": {
            "anatomy": user.anatomy,
            "shading": user.shading,
            "perspective": user.perspective,
            "composition": user.composition,
            "line_confidence": user.line_confidence
        },
        "streak": user.streak,
        "history": user.history
    }

    db.close()
    return data