from flask import Blueprint, request, jsonify, current_app, send_from_directory, send_file
from werkzeug.utils import secure_filename
from extensions import db
from models import Font, Template, Analytics  # ✅ Make sure Analytics model exists
import os, uuid, csv

admin_bp = Blueprint("admin_bp", __name__)

ALLOWED_EXT = {'ttf', 'otf', 'dxf', 'svg', 'png', 'jpg', 'jpeg'}


# ✅ Helper: check file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


# ✅ List all fonts
@admin_bp.route("/fonts", methods=["GET"])
def list_fonts():
    fonts = Font.query.order_by(Font.uploaded_at.desc()).all()
    return jsonify([
        {"id": f.id, "name": f.name, "filename": f.filename, "is_premium": f.is_premium}
        for f in fonts
    ])


# ✅ Upload font
@admin_bp.route("/fonts/upload", methods=["POST"])
def upload_font():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    fname = secure_filename(file.filename)
    unique = f"{uuid.uuid4().hex}_{fname}"
    save_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(save_folder, exist_ok=True)
    file.save(os.path.join(save_folder, unique))

    name = request.form.get('name', fname)
    is_premium = request.form.get('is_premium', '0') == '1'
    font = Font(name=name, filename=unique, is_premium=is_premium)
    db.session.add(font)
    db.session.commit()

    return jsonify({"success": True, "id": font.id})


# ✅ Remove font
@admin_bp.route("/fonts/<int:font_id>", methods=["DELETE"])
def remove_font(font_id):
    font = Font.query.get(font_id)
    if not font:
        return jsonify({"error": "Font not found"}), 404
    db.session.delete(font)
    db.session.commit()
    return jsonify({"message": "Font removed successfully"})


# ✅ Upload template
@admin_bp.route("/templates/upload", methods=["POST"])
def upload_template():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    fname = secure_filename(file.filename)
    unique = f"{uuid.uuid4().hex}_{fname}"
    save_folder = current_app.config['UPLOAD_FOLDER']
    os.makedirs(save_folder, exist_ok=True)
    file.save(os.path.join(save_folder, unique))

    name = request.form.get('name', fname)
    category = request.form.get('category', 'general')
    is_premium = request.form.get('is_premium', '0') == '1'

    tpl = Template(name=name, filename=unique, category=category, is_premium=is_premium)
    db.session.add(tpl)
    db.session.commit()

    return jsonify({"success": True, "id": tpl.id})


# ✅ Remove template
@admin_bp.route("/templates/<int:tpl_id>", methods=["DELETE"])
def remove_template(tpl_id):
    tpl = Template.query.get(tpl_id)
    if not tpl:
        return jsonify({"error": "Template not found"}), 404
    db.session.delete(tpl)
    db.session.commit()
    return jsonify({"message": "Template removed successfully"})


# ✅ Serve uploaded files
@admin_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(folder, filename)


# ✅ Analytics overview
@admin_bp.route("/analytics", methods=["GET"])
def analytics():
    data = (
        db.session.query(Analytics.layout, db.func.count(Analytics.id))
        .group_by(Analytics.layout)
        .all()
    )
    return jsonify([{"layout": row[0], "count": row[1]} for row in data])


# ✅ Export analytics to CSV
@admin_bp.route("/analytics/export", methods=["GET"])
def export_analytics():
    path = os.path.join(current_app.root_path, "analytics_export.csv")
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Layout", "Downloads"])
        for layout, count in (
            db.session.query(Analytics.layout, db.func.count(Analytics.id))
            .group_by(Analytics.layout)
            .all()
        ):
            writer.writerow([layout, count])
    return send_file(path, as_attachment=True)


# ✅ Manage pricing tiers (dummy data for now)
@admin_bp.route("/pricing", methods=["GET"])
def get_pricing():
    # Example data — replace with DB model later
    return jsonify([
        {"tier": "Free", "price": 0, "features": ["Basic Fonts", "Limited Templates"]},
        {"tier": "Pro", "price": 9.99, "features": ["All Fonts", "Unlimited DXFs"]},
        {"tier": "Enterprise", "price": 29.99, "features": ["Custom Branding", "Priority Support"]},
    ])
