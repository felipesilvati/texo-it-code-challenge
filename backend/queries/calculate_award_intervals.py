from models import db, Producer, Movie, Award, MovieProducer

def calculate_award_intervals():
    producers_intervals = []

    # Explicitly use db.session.query for querying producers who have won awards
    award_winning_producers = db.session.query(Producer) \
        .join(MovieProducer, Producer.id == MovieProducer.producer_id) \
        .join(Movie, Movie.id == MovieProducer.movie_id) \
        .join(Award, Movie.id == Award.movie_id) \
        .filter(Award.is_winner == True) \
        .distinct()

    for producer in award_winning_producers:
        win_years = sorted({
            award.movie.year
            for movie in producer.movies
            for award in movie.awards
            if award.is_winner
        })

        intervals = [
            {"previousWin": win_years[i], "followingWin": win_years[i + 1], "interval": win_years[i + 1] - win_years[i]}
            for i in range(len(win_years) - 1)
        ]

        for interval in intervals:
            interval['producer'] = producer.name
            producers_intervals.append(interval)

    if not producers_intervals:
        return {"min": [], "max": []}

    min_interval = min(producers_intervals, key=lambda x: x['interval'])['interval']
    max_interval = max(producers_intervals, key=lambda x: x['interval'])['interval']

    min_intervals = [i for i in producers_intervals if i['interval'] == min_interval]
    max_intervals = [i for i in producers_intervals if i['interval'] == max_interval]

    return {"min": min_intervals, "max": max_intervals}
