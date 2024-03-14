import { render, screen } from '@testing-library/react';
import { createTestQueryClient } from '@/utils/testHelper';
import { QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/utils/apiCalls', () => ({
  fetchYearsWithMultipleWinners: jest.fn(),
}));

import { fetchYearsWithMultipleWinners } from '@/utils/apiCalls';
import YearsWithMultipleWinners from './YearsWithMultipleWinners';

function renderYearsWithMultipleWinners() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <YearsWithMultipleWinners />
    </QueryClientProvider>
  );
}

describe('YearsWithMultipleWinners', () => {
  it('shows a loading indicator while fetching data', () => {
    fetchYearsWithMultipleWinners.mockReturnValue(new Promise(() => { }));
    renderYearsWithMultipleWinners();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays an error message when the API call fails', async () => {
    fetchYearsWithMultipleWinners.mockRejectedValue(new Error('Failed to fetch'));
    renderYearsWithMultipleWinners();
    expect(await screen.findByText('Failed to load years with multiple winners')).toBeInTheDocument();
  });

  it('displays years with multiple winners and their win counts', async () => {
    const mockData = [
      { year: 2001, winnerCount: 2 },
      { year: 2003, winnerCount: 3 },
      { year: 2005, winnerCount: 4 },
    ];

    fetchYearsWithMultipleWinners.mockResolvedValue(mockData);
    renderYearsWithMultipleWinners();

    // Check that all years are rendered with their win counts
    for (const item of mockData)
      for (const value of Object.values(item))
        expect(await screen.findByText(value)).toBeInTheDocument();
  });

})