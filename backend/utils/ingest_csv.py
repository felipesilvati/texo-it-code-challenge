import pandas as pd
from models import Movie, Studio, Producer, Award

def ingest_csv_to_db(csv_path, app, db):
    with app.app_context():
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_path, delimiter=';', encoding='utf-8')

        # Iterate over the DataFrame
        for _, row in df.iterrows():
            movie = Movie(title=row['title'], year=row['year'])
            db.session.add(movie)

            # Handle studios
            if not pd.isna(row['studios']):
                studios = row['studios'].split(',')
                for studio_name in studios:
                    studio_name = studio_name.strip()
                    studio = Studio.query.filter_by(name=studio_name).first()
                    if not studio:
                        studio = Studio(name=studio_name)
                        db.session.add(studio)
                    movie.studios.append(studio)

            # Handle producers
            if not pd.isna(row['producers']):
                producers = row['producers'].split(',')
                for producer_name in producers:
                    producer_name = producer_name.strip()
                    producer = Producer.query.filter_by(name=producer_name).first()
                    if not producer:
                        producer = Producer(name=producer_name)
                        db.session.add(producer)
                    movie.producers.append(producer)

            # Handle winner
            is_winner = False
            if 'winner' in row and not pd.isna(row['winner']) and row['winner'].lower().strip() == 'yes':
                is_winner = True
            award = Award(is_winner=is_winner)
            movie.awards.append(award)

            db.session.commit()