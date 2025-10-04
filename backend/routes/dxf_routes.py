# backend/routes/dxf_routes.py

from flask import Blueprint, request, send_file, current_app, jsonify
import os, uuid
from services.dxf_service import generate_dxf
from models import Analytics
from extensions import db
from services.preview_service import create_preview_png_bytes
from io import BytesIO

dxf_bp = Blueprint("dxf_bp", __name__)

# ---------------- DXF GENERATION ROUTE ---------------- #
@dxf_bp.route("/generate", methods=["POST"])
def generate():
    """
    POST JSON: { "text": "BITF23M001", "layout": "straight", "height": 20, "font": null }
    Returns: DXF file as attachment
    """
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400

    layout = data.get("layout", "straight")
    height = int(data.get("height", 20))
    font = data.get("font")  # optional

    # create output filename
    filename = f"{uuid.uuid4().hex}.dxf"
    out_folder = current_app.config["GENERATED_FOLDER"]
    out_path = os.path.join(out_folder, filename)

    # generate DXF file
    generate_dxf(text, out_path, layout=layout, height=height, font=font)

    # log analytics
    try:
        a = Analytics(action="download", layout=layout)
        db.session.add(a)
        db.session.commit()
    except Exception:
        db.session.rollback()

    # return file to user
    return send_file(out_path, as_attachment=True, download_name=f"{text}.dxf")


# ---------------- PREVIEW ROUTE ---------------- #
@dxf_bp.route("/preview", methods=["POST"])
def preview():
    """
    POST JSON: { text, layout, font, height, template, scale, watermark }
    Returns: PNG image bytes (image/png)
    """
    data = request.get_json() or {}
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400

    layout = data.get("layout", "straight")
    font = data.get("font")
    height = int(data.get("height", 20))
    template = data.get("template", None)
    scale = float(data.get("scale", 1.0))
    watermark = bool(data.get("watermark", False))

    try:
        png_bytes = create_preview_png_bytes(
            text=text,
            layout=layout,
            font_name=font,
            height=height,
            template=template,
            scale=scale,
            watermark=watermark,
            width_px=1200,
            height_px=600
        )
    except Exception as e:
        return jsonify({
            "error": "preview generation failed",
            "detail": str(e)
        }), 500

    # return image to frontend
    return send_file(
        BytesIO(png_bytes),
        mimetype="image/png",
        download_name="preview.png"
    )
