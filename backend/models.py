# models.py
from datetime import datetime
from extensions import db

class Font(db.Model):
    __tablename__ = "fonts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    filename = db.Column(db.String(400), nullable=False)   # saved file path (relative)
    is_premium = db.Column(db.Boolean, default=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Template(db.Model):
    __tablename__ = "templates"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    filename = db.Column(db.String(400), nullable=False)
    category = db.Column(db.String(120), nullable=True)
    is_premium = db.Column(db.Boolean, default=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Analytics(db.Model):
    __tablename__ = "analytics"
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(100), nullable=False)   # e.g., "download", "preview"
    font_id = db.Column(db.Integer, nullable=True)
    template_id = db.Column(db.Integer, nullable=True)
    layout = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

def init_db(app):
    # Create tables
    with app.app_context():
        db.create_all()
