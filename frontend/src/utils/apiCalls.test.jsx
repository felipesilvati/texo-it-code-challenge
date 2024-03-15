jest.mock('axios');
jest.mock('@/utils/constants', () => ({
  BASE_API_URL: 'http://mockedurl.com',
}));

import axios from 'axios';
import { fetchMovieWinnersByYear, fetchMovies, fetchProducersWithLongestAndShortestIntervals, fetchTopThreeStudiosWithWinners, fetchYearsWithMultipleWinners } from './apiCalls';

const mockedUrl = 'http://mockedurl.com';

describe('fetchMovies', () => {
  it('calls axios with the correct URL and returns data', async () => {
    const mockData = { content: ['Movie 1', 'Movie 2'] };
    axios.get.mockResolvedValue({ data: mockData });

    const params = {
      queryKey: ['listMovies', 1, 10, { year: 2020, winner: true }],
    };

    const result = await fetchMovies(params);

    expect(axios.get).toHaveBeenCalledWith(`${mockedUrl}?page=1&size=10&year=2020&winner=true`);
    expect(result).toEqual(mockData);
  });
});


describe('fetchYearsWithMultipleWinners', () => {
  it('fetches years with multiple winners and returns data', async () => {
    const mockData = { years: ['2000', '2005', '2010'] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchYearsWithMultipleWinners();

    expect(axios.get).toHaveBeenCalledWith(`${mockedUrl}?projection=years-with-multiple-winners`)
    expect(result).toEqual(mockData.years);
  });
});

describe('fetchTopThreeStudiosWithWinners', () => {
  it('fetches top three studios with winners and returns sliced data', async () => {
    const mockData = { studios: [{ name: 'Studio 1', winCount: 5 }, { name: 'Studio 2', winCount: 4 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchTopThreeStudiosWithWinners();

    expect(axios.get).toHaveBeenCalledWith(`${mockedUrl}?projection=studios-with-win-count`);
    expect(result).toEqual(mockData.studios.slice(0, 3));
  });
});

describe('fetchMovieWinnersByYear', () => {
  const year = 2020;
  const mockData = { content: ['Movie 1', 'Movie 2'] };

  it('fetches movie winners by year and returns data', async () => {
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchMovieWinnersByYear(year);

    expect(axios.get).toHaveBeenCalledWith(`${mockedUrl}?winner=true&year=${year}`);
    expect(result).toEqual(mockData);
  });
});

describe('fetchProducersWithLongestAndShortestIntervals', () => {
  it('fetches producers with longest and shortest win intervals and returns data', async () => {
    const mockData = { max: [{ producer: 'Producer Max', interval: 10 }], min: [{ producer: 'Producer Min', interval: 1 }] };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchProducersWithLongestAndShortestIntervals();

    expect(axios.get).toHaveBeenCalledWith(`${mockedUrl}?projection=max-min-win-interval-for-producers`);
    expect(result).toEqual(mockData);
  });
});