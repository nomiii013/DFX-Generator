# init_db.py
from app import create_app
from models import init_db

app = create_app()
init_db(app)
print("Database created/initialized.")
