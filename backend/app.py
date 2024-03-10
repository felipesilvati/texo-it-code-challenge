import os
from dotenv import load_dotenv
from flask import Flask, jsonify, make_response
from config import Config
from utils.ingest_csv import ingest_csv_to_db
from models import db, Movie
from queries.calculate_award_intervals import calculate_award_intervals

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

load_dotenv()

@app.route('/api/healthcheck', methods=['GET'])
def healthcheck():
    try:
        db.session.query(Movie.id).first()
        return jsonify({"status": "healthy", "db": "up"}), 200
    except Exception as e:
        app.logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy", "db": "down"}), 500

@app.route('/api/producers/award-intervals', methods=['GET'])
def get_producer_award_intervals():
    try:
        intervals = calculate_award_intervals()
        return jsonify(intervals)
    except Exception as e:
        return make_response(jsonify({"error": "Internal Server Error"}), 500)

if __name__ == '__main__':
    csv_path = os.getenv('CSV_PATH')
    if csv_path:
        ingest_csv_to_db(csv_path, app, db)
    app.run(debug=True)
