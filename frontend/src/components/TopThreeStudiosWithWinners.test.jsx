import { render, screen } from '@testing-library/react';
import { createTestQueryClient } from '@/utils/testHelper';
import { QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/utils/apiCalls', () => ({
  fetchTopThreeStudiosWithWinners: jest.fn(),
}));

import { fetchTopThreeStudiosWithWinners } from '@/utils/apiCalls';
import TopThreeStudiosWithWinners from './TopThreeStudiosWithWinners';

function renderTopThreeStudiosWithWinners() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <TopThreeStudiosWithWinners />
    </QueryClientProvider>
  );
}

describe('TopThreeStudiosWithWinners', () => {
  beforeEach(() => {
    fetchTopThreeStudiosWithWinners.mockReset();
  });

  it('shows a loading indicator while fetching data', () => {
    fetchTopThreeStudiosWithWinners.mockReturnValue(new Promise(() => { }));
    renderTopThreeStudiosWithWinners();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays an error message when the API call fails', async () => {
    fetchTopThreeStudiosWithWinners.mockRejectedValue(new Error('Failed to fetch'));
    renderTopThreeStudiosWithWinners();
    expect(await screen.findByText('Failed to load studios with win count')).toBeInTheDocument();
  });

  it('displays top three studios with their win counts', async () => {
    const mockData = [
      { name: 'Studio A', winCount: 10 },
      { name: 'Studio B', winCount: 8 },
      { name: 'Studio C', winCount: 5 },
    ];

    fetchTopThreeStudiosWithWinners.mockResolvedValue(mockData);
    renderTopThreeStudiosWithWinners();

    for (const studio of mockData)
      for (const value of Object.values(studio))
        expect(await screen.findByText(value)).toBeInTheDocument();
  });
})