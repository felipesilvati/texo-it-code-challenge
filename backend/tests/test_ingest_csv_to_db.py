import os
import pandas as pd
import pytest
from app import app as flask_app, db
from models import Movie, Studio, Producer, Award, MovieStudio, MovieProducer
from utils.ingest_csv import ingest_csv_to_db
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    with flask_app.app_context():
        db.create_all()
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(autouse=True)
def clear_database():
    with flask_app.app_context():
        MovieStudio.query.delete()
        MovieProducer.query.delete()
        Award.query.delete()
        Movie.query.delete()
        Studio.query.delete()
        Producer.query.delete()
        db.session.commit()

def test_ingest_csv_to_db_studios_producers_awards(app):
    # Assuming CSV_PATH is correctly set to your test CSV file
    csv_path = os.getenv('CSV_PATH')
    assert csv_path is not None, "CSV_PATH environment variable is not set."

    with app.app_context():
        ingest_csv_to_db(csv_path, app, db)

    # Load the CSV to a DataFrame for verification
    df = pd.read_csv(csv_path, delimiter=';', encoding='utf-8')

    # Verify Studios
    unique_studios = set(studio.strip() for studios in df['studios'].dropna() for studio in studios.split(','))
    for studio_name in unique_studios:
        assert Studio.query.filter_by(name=studio_name).count() == 1, f"Studio {studio_name} was not correctly ingested or is duplicated"

    # Verify Producers
    unique_producers = set(producer.strip() for producers in df['producers'].dropna() for producer in producers.split(','))
    for producer_name in unique_producers:
        assert Producer.query.filter_by(name=producer_name).count() == 1, f"Producer {producer_name} was not correctly ingested or is duplicated"

    # Verify Awards
    winners_from_csv = df[df['winner'].str.lower() == 'yes']['title'].tolist()
    for title in winners_from_csv:
        movie = Movie.query.filter_by(title=title).first()
        assert movie is not None, f"Movie {title} was not found in the database"
        assert any(award.is_winner for award in movie.awards), f"Movie {title} does not have a winning award"

    # Verify all movies have an award entry and the count matches
    assert Award.query.count() == len(df), "The number of awards does not match the number of movies"
