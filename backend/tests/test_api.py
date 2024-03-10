import pytest
from app import app as flask_app, db

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

def test_healthcheck(client):
    response = client.get('/api/healthcheck')
    assert response.status_code == 200
    assert response.json == {"status": "healthy", "db": "up"}
