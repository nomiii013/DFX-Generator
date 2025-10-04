import os
from flask import Flask
from flask_cors import CORS
from extensions import db


def create_app():
    app = Flask(__name__)
    BASE = os.path.dirname(os.path.abspath(__file__))

    # ---------------- CONFIG ---------------- #
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE, 'database', 'dxf_tool.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['UPLOAD_FOLDER'] = os.path.join(BASE, 'static', 'uploads')
    app.config['GENERATED_FOLDER'] = os.path.join(BASE, 'generated_files')

    # ---------------- FOLDER CREATION ---------------- #
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['GENERATED_FOLDER'], exist_ok=True)
    os.makedirs(os.path.join(BASE, 'database'), exist_ok=True)

    # ---------------- EXTENSIONS ---------------- #
    db.init_app(app)

    # ✅ Enable CORS for frontend (React/Vite)
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",   # Vite dev server
                "http://127.0.0.1:5173",   # Alternate localhost
                "https://your-production-frontend.com"  # (optional) production frontend
            ],
            "supports_credentials": True
        }
    })

    # ---------------- BLUEPRINTS ---------------- #
    from routes.dxf_routes import dxf_bp
    from routes.admin_routes import admin_bp
    from routes.ai_routes import ai_bp

    # ✅ Register all API routes
    app.register_blueprint(dxf_bp, url_prefix="/api/dxf")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    # ---------------- ROOT ROUTE ---------------- #
    @app.route("/")
    def home():
        return {"message": "DXF Backend is running!"}

    return app


if __name__ == "__main__":
    app = create_app()

    # ✅ Initialize database tables if not exist
    with app.app_context():
        from models import init_db
        init_db(app)

    # ✅ Run Flask with open host so frontend can connect
    app.run(host="0.0.0.0", port=5000, debug=True)
