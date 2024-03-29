import pytest
from app import app as flask_app, db
from models import Producer, Movie, Award, MovieProducer, Studio, MovieStudio
from sqlalchemy.exc import OperationalError

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

class TestProducerAwardIntervals:
    def test_no_awards(self, client):
        # Empty database, no awards.
        response = client.get('/api/producers/award-intervals')
        
        # Assert: "min" and "max" are both empty lists.
        assert response.status_code == 200
        assert response.json == {"min": [], "max": []}

    def test_single_award(self, client):
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

    def test_consecutive_years_awards(self, client):
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

    def test_various_intervals(self, client):
        # Setup: Insert producers with awards in non-consecutive years.
        with flask_app.app_context():
            producer1 = Producer(name="Varied Interval Producer 1")
            producer2 = Producer(name="Varied Interval Producer 2")
            db.session.add_all([producer1, producer2])
            
            # Create movies and awards with varying intervals for producer1
            movie_years_1 = [2000, 2005, 2010]  # Intervals: 5, 5
            for year in movie_years_1:
                movie = Movie(title=f"Movie {year}", year=year)
                db.session.add(movie)
                db.session.commit()
                movie.producers.append(producer1)
                award = Award(movie_id=movie.id, is_winner=True)
                db.session.add(award)
            
            # Create movies and awards with different intervals for producer2
            movie_years_2 = [2001, 2004, 2012]  # Intervals: 3, 8
            for year in movie_years_2:
                movie = Movie(title=f"Movie {year}", year=year)
                db.session.add(movie)
                db.session.commit()
                movie.producers.append(producer2)
                award = Award(movie_id=movie.id, is_winner=True)
                db.session.add(award)

            db.session.commit()

        # Test: GET /api/producers/award-intervals
        response = client.get('/api/producers/award-intervals')
        assert response.status_code == 200
        data = response.json

        # Expected intervals are based on the setup data above.
        # Assert that the min interval is correctly identified as 3 years (2001 to 2004 for producer2).
        expected_min_interval = {"interval": 3, "previousWin": 2001, "followingWin": 2004}
        assert any(interval for interval in data['min'] if interval["interval"] == expected_min_interval["interval"] and interval["previousWin"] == expected_min_interval["previousWin"] and interval["followingWin"] == expected_min_interval["followingWin"]), "'min' interval does not match the expected outcome."

        # Assert that the max interval is correctly identified as 8 years (2004 to 2012 for producer2).
        expected_max_interval = {"interval": 8, "previousWin": 2004, "followingWin": 2012}
        assert any(interval for interval in data['max'] if interval["interval"] == expected_max_interval["interval"] and interval["previousWin"] == expected_max_interval["previousWin"] and interval["followingWin"] == expected_max_interval["followingWin"]), "'max' interval does not match the expected outcome."

    def test_identical_intervals(self, client):
        # Setup: Insert producers with identical award intervals.
        with flask_app.app_context():
            # Producers with identical shortest interval of 2 years
            producer1 = Producer(name="Producer Short 1")
            producer2 = Producer(name="Producer Short 2")
            # Producers with identical longest interval of 4 years
            producer3 = Producer(name="Producer Long 1")
            producer4 = Producer(name="Producer Long 2")
            db.session.add_all([producer1, producer2, producer3, producer4])
            
            # Producer 1 and 2 setup for shortest interval of 2 years
            years_short = [2010, 2012]  # Interval: 2
            for year in years_short:
                movie = Movie(title=f"Short Interval Movie {year}", year=year)
                db.session.add(movie)
                db.session.commit()
                movie.producers.extend([producer1, producer2])
                award = Award(movie_id=movie.id, is_winner=True)
                db.session.add(award)
            
            # Producer 3 and 4 setup for longest interval of 4 years
            years_long = [2000, 2004]  # Interval: 4
            for year in years_long:
                movie = Movie(title=f"Long Interval Movie {year}", year=year)
                db.session.add(movie)
                db.session.commit()
                movie.producers.extend([producer3, producer4])
                award = Award(movie_id=movie.id, is_winner=True)
                db.session.add(award)

            db.session.commit()

        # Test: GET /api/producers/award-intervals
        response = client.get('/api/producers/award-intervals')
        assert response.status_code == 200
        data = response.json

        # Assert that both shortest interval producers are correctly identified.
        min_intervals = data['min']
        assert len([interval for interval in min_intervals if interval["interval"] == 2 and interval["producer"] in ["Producer Short 1", "Producer Short 2"]]) == 2, "Not all producers with the shortest interval are returned."

        # Assert that both longest interval producers are correctly identified.
        max_intervals = data['max']
        assert len([interval for interval in max_intervals if interval["interval"] == 4 and interval["producer"] in ["Producer Long 1", "Producer Long 2"]]) == 2, "Not all producers with the longest interval are returned."

    def test_error_handling(self, client, monkeypatch):
        def mock_query(*args, **kwargs):
            raise OperationalError("mocked error", "mocked params", "mocked orig")
        # Mock calculate_award_intervals to raise an exception
        monkeypatch.setattr(db.session, 'query', mock_query)

        response = client.get('/api/producers/award-intervals')
        assert response.status_code == 500
        assert "error" in response.json

