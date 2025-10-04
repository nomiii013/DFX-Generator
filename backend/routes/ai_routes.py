# backend/routes/ai_routes.py
from flask import Blueprint, request, jsonify

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/suggest", methods=["POST"])
def suggest_design():
    data = request.json
    prompt = data.get("prompt", "").lower()

    font = "Arial"
    layout = "straight"
    template = "default"

    # Very simple rule-based AI
    if "modern" in prompt or "tech" in prompt:
        font = "Orbitron"
        layout = "straight"
    if "classic" in prompt or "heritage" in prompt:
        font = "Playfair Display"
        template = "heritage"
    if "farm" in prompt or "village" in prompt:
        font = "Raleway"
        template = "farm"
    if "camping" in prompt or "adventure" in prompt:
        font = "Poppins"
        template = "camping"
    if "bold" in prompt or "industrial" in prompt or "workshop" in prompt:
        font = "Oswald"
        layout = "stacked"
        template = "workshop"

    return jsonify({
        "font": font,
        "layout": layout,
        "template": template
    })
