from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from openai import OpenAI
from datetime import datetime
from dotenv import load_dotenv
import os

# ==============================
# 🔐 Load environment variables
# ==============================
load_dotenv()

app = FastAPI(title="AI Learning Path Generator 🚀")

# ==============================
# 🌐 CORS
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production me specific domain lagana hoga
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# 🤖 OpenRouter API Setup
# ==============================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("🚨 Missing OPENROUTER_API_KEY in .env file!")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# ==============================
# 🧾 MODELS
# ==============================
class UserRequest(BaseModel):
    current_skills: List[str]
    goal: str

class ProgressUpdate(BaseModel):
    user_id: int
    completed_steps: List[str]

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict]] = []
    goal: Optional[str] = None
    skills: Optional[List[str]] = None

# ==============================
# 🗂 IN-MEMORY STORAGE
# ==============================
users_db = []
learning_paths_db = {}
user_progress_db = {}

# ==============================
# 🏁 ROUTES
# ==============================
@app.get("/")
def root():
    return {"message": "✅ Smart Learning Path Generator API is running!"}

# ... (rest of your routes remain unchanged)

# ==============================
# 🪜 Helper: Parse Steps
# ==============================
def parse_steps_from_ai(ai_text: str) -> List[Dict]:
    steps = []
    lines = ai_text.split('\n')
    current_step = None
    step_number = 1

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if (line.startswith(tuple(f"{i}." for i in range(1, 50))) or
            line.startswith(tuple(f"{i})" for i in range(1, 50))) or
            line.lower().startswith(("step", "phase", "-", "•", "*", "→"))):

            if current_step:
                steps.append(current_step)
                step_number += 1

            current_step = {
                "step_number": step_number,
                "description": line,
                "completed": False,
                "resources": []
            }

        elif "http" in line:
            if current_step:
                current_step["resources"].append(line)

        elif current_step:
            current_step["description"] += " " + line

    if current_step:
        steps.append(current_step)

    if not steps:
        steps = [{
            "step_number": 1,
            "description": "Follow the AI-generated roadmap step by step.",
            "completed": False,
            "resources": []
        }]

    return steps
