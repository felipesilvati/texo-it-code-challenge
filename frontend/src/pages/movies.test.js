import { render, act, waitFor } from '@testing-library/react';
import Movies from './movies';
import { fetchMovies } from '@/utils/apiCalls';
import { createTestQueryClient } from '@/utils/testHelpers';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';

jest.mock('@/utils/apiCalls', () => ({
  fetchMovies: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
useRouter.mockImplementation(() => ({
  push: mockPush,
  pathname: '/movies',
}));

function renderMovies() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Movies />
    </QueryClientProvider>
  );
}

describe('Movies Pagination', () => {
  beforeEach(() => {
    fetchMovies.mockResolvedValue({
      totalElements: 50,
      content: Array(10).fill().map((_, index) => ({
        id: index,
        title: `Movie ${index}`,
        year: `Year ${index}`,
        winner: index % 2 === 0,
      })),
    });
  });

  it('fetches movies with correct initial parameters', async () => {
    const { findByText } = renderMovies();
    expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({
      queryKey: ['listMovies', 0, 10, { year: null, winner: null }]
    }));
    expect(await findByText('1-10 of 50 movies')).toBeInTheDocument();
  });

  it('fetches the next page when the next page button is clicked', async () => {
    const { findByRole } = renderMovies();
    fetchMovies.mockResolvedValue({
      totalElements: 50,
      content: Array(10).fill().map((_, index) => ({
        id: index,
        title: `Movie ${index}`,
        year: `Year ${index}`,
        winner: index % 2 === 0,
      })),
    });

    const nextPageButton = await findByRole('listitem', { name: /next page/i });

    await act(async () => {
      nextPageButton.click();
    })

    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['listMovies', 1, 10, { year: null, winner: null }] }))
    })
  });

  it('fetches the previous page when the previous page button is clicked', async () => {
    const { findByRole } = renderMovies();
    fetchMovies.mockResolvedValue({
      totalElements: 50,
      content: Array(10).fill().map((_, index) => ({
        id: index,
        title: `Movie ${index}`,
        year: `Year ${index}`,
        winner: index % 2 === 0,
      })),
    });


    const nextPageButton = await findByRole('listitem', { name: /next page/i });

    await act(async () => {
      nextPageButton.click();
    })

    const previousPageButton = await findByRole('listitem', { name: /previous page/i });

    await act(async () => {
      previousPageButton.click();
    })

    await waitFor(() => {
      expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['listMovies', 0, 10, { year: null, winner: null }] }))
    })
  });
});
