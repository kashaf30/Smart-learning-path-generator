from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from openai import OpenAI
from datetime import datetime

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
OPENROUTER_API_KEY = "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"
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

# ✅ Create user
@app.post("/create-user")
def create_user(request: UserRequest):
    user_id = len(users_db) + 1
    users_db.append({
        "user_id": user_id,
        "skills": request.current_skills,
        "goal": request.goal,
        "created_at": datetime.now().isoformat()
    })
    return {"user_id": user_id, "message": "User created successfully!"}

# ✅ Generate Learning Path
@app.post("/generate-ai-path")
def generate_ai_path(request: UserRequest):
    try:
        prompt = f"""
        Create a **clear and practical step-by-step learning path** for a person who already knows:
        {request.current_skills}
        and wants to become: {request.goal}.

        Include:
        1. Phases with estimated duration
        2. Skills to learn in each phase
        3. Real-world project ideas
        4. Free & paid resources (with URLs)
        5. Total estimated time to achieve the goal.

        ➤ Make the roadmap **easy to follow for beginners**.
        ➤ Use numbered steps and bullet points for clarity.
        """

        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1800
        )

        ai_response = response.choices[0].message.content.strip()
        steps = parse_steps_from_ai(ai_response)

        learning_path = {
            "goal": request.goal,
            "current_skills": request.current_skills,
            "ai_generated_path": ai_response,
            "steps": steps,
            "created_at": datetime.now().isoformat(),
            "total_steps": len(steps)
        }

        # 🧠 Memory me save krna (taake chat ko yaad rahe)
        learning_paths_db[request.goal] = learning_path

        return {"success": True, "path": learning_path}
    except Exception as e:
        return {"error": f"AI generation failed: {str(e)}"}

# ✅ Chat with memory
@app.post("/chat-with-ai")
def chat_with_ai(chat_request: ChatRequest):
    try:
        user_message = chat_request.message
        conversation_history = chat_request.history or []
        goal = chat_request.goal
        skills = chat_request.skills or []

        # 🎯 Context — agar pehle kuch generate hua hai
        context = ""
        if goal in learning_paths_db:
            context = (
                f"User goal: {goal}\n"
                f"Here is the previously generated learning path:\n"
                f"{learning_paths_db[goal]['ai_generated_path']}\n\n"
            )
        elif goal and skills:
            context = f"User wants to become {goal} and knows {', '.join(skills)}."

        messages = [
            {"role": "system", "content": f"You are a helpful AI learning assistant. {context}"},
            *conversation_history,
            {"role": "user", "content": user_message}
        ]

        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        return {"success": True, "response": response.choices[0].message.content}
    except Exception as e:
        return {"error": f"Chat failed: {str(e)}"}

# ✅ Update Progress
@app.post("/update-progress")
def update_progress(update: ProgressUpdate):
    try:
        user_progress_db[update.user_id] = {
            "completed_steps": update.completed_steps,
            "updated_at": datetime.now().isoformat()
        }
        return {"success": True, "message": "Progress updated successfully!"}
    except Exception as e:
        return {"error": f"Progress update failed: {str(e)}"}

# ✅ Get User Progress
@app.get("/user-progress/{user_id}")
def get_user_progress(user_id: int):
    return user_progress_db.get(user_id, {"completed_steps": []})

# ✅ All Paths
@app.get("/all-paths")
def get_all_paths():
    return list(learning_paths_db.values())

# ✅ Delete Path
@app.delete("/delete-path/{goal}")
def delete_path(goal: str):
    if goal in learning_paths_db:
        del learning_paths_db[goal]
        return {"success": True, "message": "Path deleted successfully!"}
    return {"error": "Path not found."}

# ✅ Users
@app.get("/get-users")
def get_users():
    return {"users": users_db}

# ✅ Single Path
@app.get("/get-ai-path/{goal}")
def get_ai_path(goal: str):
    if goal in learning_paths_db:
        return {"goal": goal, "path": learning_paths_db[goal]}
    return {"error": "Path not generated yet."}

# ✅ Test AI
@app.get("/test-ai")
def test_ai():
    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello, are you working?"}],
            max_tokens=30
        )
        return {"ai_test": "✅ Working", "response": response.choices[0].message.content}
    except Exception as e:
        return {"ai_test": "❌ Failed", "error": str(e)}

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
