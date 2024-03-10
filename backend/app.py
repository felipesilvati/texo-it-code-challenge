import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from config import Config
from utils.ingest_csv import ingest_csv_to_db
from models import db, Movie

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

load_dotenv()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/movies')
def list_movies():
    movies = Movie.query.all()
    movies_info = []
    for movie in movies:
        movies_info.append({
            "title": movie.title,
            "year": movie.year,
            "studios": [studio.name for studio in movie.studios],
            "producers": [producer.name for producer in movie.producers],
            "winner": any(award.is_winner for award in movie.awards)
        })
    return jsonify(movies_info)


if __name__ == '__main__':
    csv_path = os.getenv('CSV_PATH')
    if csv_path:
        ingest_csv_to_db(csv_path, app, db)
    app.run(debug=True)
