import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from utils.ingest_csv import ingest_csv_to_db
from models import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

load_dotenv()

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    csv_path = os.getenv('CSV_PATH')
    if csv_path:
        ingest_csv_to_db(csv_path, app, db)
    app.run(debug=True)
