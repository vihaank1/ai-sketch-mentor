import random

challenges = [
    "Draw 10 hands in different poses",
    "Practice 1-point perspective rooms",
    "Do 30-second gesture sketches (x10)",
    "Draw 5 faces from different angles",
    "Shade a sphere using 3 light sources"
]

def get_daily_challenge():
    return random.choice(challenges)