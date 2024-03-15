import { render, act, waitFor, fireEvent } from '@testing-library/react';
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

describe('movies page', () => {
  beforeEach(() => {
    fetchMovies.mockReset();
  })
  describe('fetching data', () => {
    it('renders a loading spinner when movies are being fetched', () => {
      fetchMovies.mockReturnValue(new Promise(() => { }));
      const { getByTestId } = renderMovies();
      expect(getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders an error message when movies fail to load', async () => {
      fetchMovies.mockRejectedValue(new Error('Failed to load movies'));
      const { findByText } = renderMovies();
      expect(await findByText('Failed to load movies')).toBeInTheDocument();
    });
  })

  describe('filtering', () => {
    it('fetches movies with correct initial parameters', async () => {
      fetchMovies.mockResolvedValue({
        totalElements: 0,
        content: [],
      });
      renderMovies();
      expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({
        queryKey: ['listMovies', 0, 10, { year: null, winner: null }]
      }));
    });

    describe('year filter', () => {
      it('fetches movies with the correct year filter when a year is selected', async () => {
        fetchMovies.mockResolvedValue({
          totalElements: 0,
          content: [
            {
              id: 1,
              title: 'Movie 1',
              year: '1989',
              winner: true,
            }
          ],
        });

        const { findByTestId } = renderMovies();

        const yearFilterButton = await findByTestId('year-filter-icon');
        await act(async () => {
          fireEvent.click(yearFilterButton);
        });

        const yearInput = await findByTestId('year-input');

        await act(async () => {
          fireEvent.change(yearInput, { target: { value: '1989' } });
        });

        const searchButton = await findByTestId('search-button');
        await act(async () => {
          fireEvent.click(searchButton);
        });

        await waitFor(() => {
          expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({
            queryKey: ['listMovies', 0, 10, { year: '1989', winner: null }]
          }));
        });
      });
    });

    describe('winner filter', () => {
      it('fetches movies with the correct winner filter when a winner is selected', async () => {
        fetchMovies.mockResolvedValue({
          totalElements: 0,
          content: [],
        });

        const { findByTestId, findByLabelText } = renderMovies();

        // First, click the winner filter icon to display the winner filter options
        const winnerFilterIcon = await findByTestId('winner-filter-icon');
        await act(async () => {
          fireEvent.click(winnerFilterIcon);
        });

        // Now that the filter options are visible, click on the "Yes" radio button
        const winnerYesOption = await findByLabelText(/Yes/i);
        await act(async () => {
          fireEvent.click(winnerYesOption);
        });

        // After clicking "Yes", the dropdown should automatically close, and the filter should be applied
        // So, we wait for fetchMovies to be called with the updated filters
        await waitFor(() => {
          expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({
            queryKey: ['listMovies', 0, 10, { year: null, winner: 'true' }] // Assuming 'true' as a string based on your WinnerFilterDropdown component's logic
          }));
        });
      });
    });

    it('applies both year and winner filters when both are selected', async () => {
      fetchMovies.mockResolvedValue({
        totalElements: 0,
        content: [],
      });

      const { findByTestId, findByLabelText } = renderMovies();

      // First, click the year filter icon to display the year filter options
      const yearFilterIcon = await findByTestId('year-filter-icon');
      await act(async () => {
        fireEvent.click(yearFilterIcon);
      });

      // Now that the filter options are visible, enter a year and click the search button
      const yearInput = await findByTestId('year-input');
      await act(async () => {
        fireEvent.change(yearInput, { target: { value: '1989' } });
      });

      const yearSearchButton = await findByTestId('search-button');
      await act(async () => {
        fireEvent.click(yearSearchButton);
      });

      // Now, click the winner filter icon to display the winner filter options
      const winnerFilterIcon = await findByTestId('winner-filter-icon');
      await act(async () => {
        fireEvent.click(winnerFilterIcon);
      });

      // Now that the filter options are visible, click on the "Yes" radio button
      const winnerYesOption = await findByLabelText(/Yes/i);
      await act(async () => {
        fireEvent.click(winnerYesOption);
      });

      // After clicking "Yes", the dropdown should automatically close, and the filter should be applied
      // So, we wait for fetchMovies to be called with the updated filters
      await waitFor(() => {
        expect(fetchMovies).toHaveBeenCalledWith(expect.objectContaining({
          queryKey: ['listMovies', 0, 10, { year: '1989', winner: 'true' }] // Assuming 'true' as a string based on your WinnerFilterDropdown component's logic
        }));
      });
    })

  })

  describe('pagination', () => {
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
})