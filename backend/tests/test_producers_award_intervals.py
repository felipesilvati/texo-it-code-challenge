import pytest
from app import app as flask_app, db
from models import Producer, Movie, Award, MovieProducer, Studio, MovieStudio

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

def test_no_awards(client):
    # Test: GET /api/producers/award-intervals
    response = client.get('/api/producers/award-intervals')
    
    # Assert: "min" and "max" are both empty lists.
    assert response.status_code == 200
    assert response.json == {"min": [], "max": []}

def test_single_award(client):
    with flask_app.app_context():
        # Setup for a single award
        producer = Producer(name="Single Award Producer")
        movie = Movie(title="Single Award Movie", year=2020, producers=[producer])
        award = Award(movie=movie, is_winner=True)
        db.session.add_all([producer, movie, award])
        db.session.commit()

    response = client.get('/api/producers/award-intervals')
    assert response.status_code == 200
    assert response.json == {"min": [], "max": []}

def test_consecutive_years_awards(client):
    # Setup: Insert a producer with awards for consecutive years.
    with flask_app.app_context():
        producer = Producer(name="Consecutive Awards Producer")
        db.session.add(producer)
        db.session.commit()  # Ensure producer is committed to generate an ID.

        years = [2018, 2019, 2020]
        for year in years:
            movie = Movie(title=f"Movie {year}", year=year)
            db.session.add(movie)
            db.session.commit()  # Commit to ensure movie ID is generated.

            movie.producers.append(producer)
            award = Award(movie_id=movie.id, is_winner=True)
            db.session.add(award)

        db.session.commit()

    # Execute the test.
    response = client.get('/api/producers/award-intervals')
    assert response.status_code == 200
    data = response.json

    # Since the interval between consecutive years is always 1, we expect the min and max to be 1 for this setup.
    expected_interval = {"interval": 1, "previousWin": 2018, "followingWin": 2019, "producer": "Consecutive Awards Producer"}
    
    # Verify the 'min' and 'max' intervals match the expected outcome.
    assert any(interval for interval in data['min'] if interval == expected_interval), "'min' interval does not match the expected outcome."
    assert any(interval for interval in data['max'] if interval == expected_interval), "'max' interval does not match the expected outcome."
