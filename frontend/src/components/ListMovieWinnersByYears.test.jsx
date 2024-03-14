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

describe('ListMovieWinnersByYear', () => {
  beforeEach(() => {
    fetchMovieWinnersByYear.mockReset();
  });

  it('initially renders with no data', () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListMovieWinnersByYear />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('search-text')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.queryByText('No data')).toBeInTheDocument();
    expect(fetchMovieWinnersByYear).not.toHaveBeenCalled();
  });

  it('displays a list of movie winners when the search button is clicked', async () => {
    fetchMovieWinnersByYear.mockResolvedValue([
      { id: 1, year: 1989, title: 'Movie Title' }
    ]);
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListMovieWinnersByYear />
      </QueryClientProvider>
    );

    const input = screen.getByTestId('search-text');
    fireEvent.change(input, { target: { value: '1989' } });
    expect(input.value).toBe('1989');
    fireEvent.click(screen.getByTestId('search-button'));

    expect(fetchMovieWinnersByYear).toHaveBeenCalledWith(1989);
    expect(await screen.findByText('Movie Title')).toBeInTheDocument();
  });

  it('triggers search when Enter is pressed', async () => {
    fetchMovieWinnersByYear.mockResolvedValue([
      { id: 1, year: 1989, title: 'Movie Title' }
    ]);

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListMovieWinnersByYear />
      </QueryClientProvider>
    );

    const input = screen.getByTestId('search-text');
    fireEvent.change(input, { target: { value: '1989' } });

    fireEvent.keyDown(input, { key: 'Enter', code: 13 });

    expect(fetchMovieWinnersByYear).toHaveBeenCalledWith(1989);
    expect(await screen.findByText('Movie Title')).toBeInTheDocument();
  });

  it('displays an error message when the API call fails', async () => {
    // Forces the mock to return a rejected promise
    fetchMovieWinnersByYear.mockRejectedValue(new Error('Failed to fetch'));

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListMovieWinnersByYear />
      </QueryClientProvider>
    );

    const input = screen.getByTestId('search-text');
    fireEvent.change(input, { target: { value: '1989' } });
    expect(input.value).toBe('1989');
    fireEvent.click(screen.getByTestId('search-button'));

    expect(await screen.findByText('Failed to load data')).toBeInTheDocument();
    expect(await screen.getByTestId('error-message')).toBeInTheDocument();
  });

});
