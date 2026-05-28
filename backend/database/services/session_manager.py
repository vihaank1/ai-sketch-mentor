# backend/services/session_manager.py

# =========================
# SIMPLE IN-MEMORY STORAGE
# =========================

user_history = []


def save_history(entry):
    user_history.append(entry)


def get_history():
    return user_history[-20:]  # last 20 sketches