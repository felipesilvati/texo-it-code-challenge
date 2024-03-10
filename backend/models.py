from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Movie(db.Model):
    __tablename__ = 'movie'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    studios = db.relationship('Studio', secondary='movie_studio', back_populates='movies')
    producers = db.relationship('Producer', secondary='movie_producer', back_populates='movies')
    awards = db.relationship('Award', backref='movie', lazy='dynamic')

class Studio(db.Model):
    __tablename__ = 'studio'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    movies = db.relationship('Movie', secondary='movie_studio', back_populates='studios')

class Producer(db.Model):
    __tablename__ = 'producer'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    movies = db.relationship('Movie', secondary='movie_producer', back_populates='producers')

class MovieStudio(db.Model):
    __tablename__ = 'movie_studio'
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), primary_key=True)
    studio_id = db.Column(db.Integer, db.ForeignKey('studio.id'), primary_key=True)

class MovieProducer(db.Model):
    __tablename__ = 'movie_producer'
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), primary_key=True)
    producer_id = db.Column(db.Integer, db.ForeignKey('producer.id'), primary_key=True)

class Award(db.Model):
    __tablename__ = 'award'
    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    is_winner = db.Column(db.Boolean, default=False, nullable=False)
