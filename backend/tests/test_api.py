import pytest
from app import app as flask_app, db
from sqlalchemy.exc import OperationalError

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
        # Update the database URI to use an in-memory database for testing
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    with flask_app.app_context():
        db.create_all()
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_healthcheck_success(client):
    response = client.get('/api/healthcheck')
    assert response.status_code == 200
    assert response.json == {"status": "healthy", "db": "up"}

def test_healthcheck_failure(client, monkeypatch):
    # Patch the query method of the db.session to raise an OperationalError
    def mock_query(*args, **kwargs):
        raise OperationalError("mocked error", "mocked params", "mocked orig")
    
    monkeypatch.setattr(db.session, 'query', mock_query)

    response = client.get('/api/healthcheck')
    assert response.status_code == 500
    assert response.json == {"status": "unhealthy", "db": "down"}
