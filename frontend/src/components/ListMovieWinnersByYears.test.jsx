import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

jest.mock('@/utils/apiCalls', () => ({
  fetchMovieWinnersByYear: jest.fn(),
}));

import { fetchMovieWinnersByYear } from '@/utils/apiCalls';

const createTestQueryClient = () => new QueryClient({
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    error: process.env.NODE_ENV === 'test' ? () => { } : console.error,
  },
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderListMovieWinnersByYear() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ListMovieWinnersByYear />
    </QueryClientProvider>
  );
}

function searchForYear(year) {
  const input = screen.getByTestId('search-text');
  fireEvent.change(input, { target: { value: year.toString() } });
  fireEvent.keyDown(input, { key: 'Enter', code: 13 });
}

const movieData = { id: 1, year: 1989, title: 'Movie Title' };

describe('ListMovieWinnersByYear', () => {
  beforeEach(() => {
    fetchMovieWinnersByYear.mockReset();
  });

  it('initially renders with no data', () => {
    renderListMovieWinnersByYear();
    expect(screen.getByTestId('search-text')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.queryByText('No data')).toBeInTheDocument();
    expect(fetchMovieWinnersByYear).not.toHaveBeenCalled();
  });

  it('displays a list of movie winners when the search button is clicked', async () => {
    fetchMovieWinnersByYear.mockResolvedValue([movieData]);
    renderListMovieWinnersByYear();
    searchForYear(movieData.year);
    expect(fetchMovieWinnersByYear).toHaveBeenCalledWith(movieData.year);
    expect(await screen.findByText(movieData.title)).toBeInTheDocument();
  });

  it('triggers search when Enter is pressed', async () => {
    fetchMovieWinnersByYear.mockResolvedValue([movieData]);
    renderListMovieWinnersByYear();
    searchForYear(movieData.year);
    expect(fetchMovieWinnersByYear).toHaveBeenCalledWith(movieData.year);
    expect(await screen.findByText(movieData.title)).toBeInTheDocument();
  });

  it('displays an error message when the API call fails', async () => {
    fetchMovieWinnersByYear.mockRejectedValue(new Error('Failed to fetch'));
    renderListMovieWinnersByYear();
    searchForYear(movieData.year);
    expect(await screen.findByText('Failed to load data')).toBeInTheDocument();
    expect(await screen.getByTestId('error-message')).toBeInTheDocument();
  });
});
