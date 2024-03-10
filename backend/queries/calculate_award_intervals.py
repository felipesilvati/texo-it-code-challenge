from models import Producer, MovieProducer, Movie, Award

def calculate_award_intervals():
    producers_intervals = []

    # Query for producers who have won awards, ensuring you're only considering winning awards.
    award_winning_producers = Producer.query.join(
        MovieProducer, Producer.id == MovieProducer.producer_id
    ).join(
        Movie, Movie.id == MovieProducer.movie_id
    ).join(
        Award, Movie.id == Award.movie_id
    ).filter(
        Award.is_winner == True
    ).distinct()

    for producer in award_winning_producers:
        # Extract years of winning, ensuring to sort them to calculate intervals correctly
        win_years = sorted(
            set(
                award.movie.year for award in producer.movies
                for award in award.awards if award.is_winner
            )
        )

        intervals = [
            {"previousWin": win_years[i], "followingWin": win_years[i + 1], "interval": win_years[i + 1] - win_years[i]}
            for i in range(len(win_years) - 1)
        ]

        for interval in intervals:
            interval['producer'] = producer.name
            producers_intervals.append(interval)

    # Now separate into min and max intervals
    if not producers_intervals:
        return {"min": [], "max": []}

    min_interval = min(producers_intervals, key=lambda x: x['interval'])['interval']
    max_interval = max(producers_intervals, key=lambda x: x['interval'])['interval']

    min_intervals = [interval for interval in producers_intervals if interval['interval'] == min_interval]
    max_intervals = [interval for interval in producers_intervals if interval['interval'] == max_interval]

    return {
        "min": min_intervals,
        "max": max_intervals
    }