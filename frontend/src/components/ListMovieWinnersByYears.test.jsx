import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

jest.mock('@/utils/apiCalls', () => ({
  fetchMovieWinnersByYear: jest.fn(),
}));
import { fetchMovieWinnersByYear } from '@/utils/apiCalls';

fetchMovieWinnersByYear.mockResolvedValue([
  { id: 1, year: 2020, title: 'Movie Title' }
]);

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ListMovieWinnersByYear', () => {
  it('renders without crashing', async () => {
    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListMovieWinnersByYear />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('search-text')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();

    const input = screen.getByTestId('search-text');
    fireEvent.change(input, { target: { value: '1989' } });
    expect(input.value).toBe('1989');
    fireEvent.click(screen.getByTestId('search-button'));

    expect(await screen.findByText('Movie Title')).toBeInTheDocument();
  });
});
