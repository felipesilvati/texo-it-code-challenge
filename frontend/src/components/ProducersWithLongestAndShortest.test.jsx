import { render, screen } from '@testing-library/react';
import { createTestQueryClient } from '@/utils/testHelper';
import ProducersWithLongestAndShortest from './ProducersWithLongestAndShortest';
import { QueryClientProvider } from '@tanstack/react-query';

jest.mock('@/utils/apiCalls', () => ({
  fetchProducersWithLongestAndShortestIntervals: jest.fn(),
}));

import { fetchProducersWithLongestAndShortestIntervals } from '@/utils/apiCalls';

function renderProducersWithLongestAndShortest() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProducersWithLongestAndShortest />
    </QueryClientProvider>
  );
}

describe('ProducersWithLongestAndShortest', () => {
  beforeEach(() => {
    fetchProducersWithLongestAndShortestIntervals.mockReset();
  });

  it('shows a loading indicator while fetching data', () => {
    fetchProducersWithLongestAndShortestIntervals.mockReturnValue(new Promise(() => { }));
    renderProducersWithLongestAndShortest();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows an error message when data fetching fails', async () => {
    fetchProducersWithLongestAndShortestIntervals.mockRejectedValue(new Error('Failed to load data'));
    renderProducersWithLongestAndShortest();
    expect(await screen.findByText('Failed to load producers with longest and shortest win intervals')).toBeInTheDocument();
  });

  it('displays data for both maximum and minimum win intervals', async () => {
    const mockData = {
      max: [
        { producer: 'Producer Max', interval: 10, previousWin: 2000, followingWin: 2010 }
      ],
      min: [
        { producer: 'Producer Min', interval: 2, previousWin: 2015, followingWin: 2017 }
      ]
    };

    fetchProducersWithLongestAndShortestIntervals.mockResolvedValue(mockData);
    renderProducersWithLongestAndShortest();

    for (const key in mockData)
      for (const item of mockData[key])
        for (const value of Object.values(item))
          expect(await screen.findByText(value)).toBeInTheDocument();
  });

})