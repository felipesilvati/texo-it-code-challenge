import { render } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Dashboard from '@/pages/index';
import { createTestQueryClient } from '@/utils/testHelpers';

jest.mock('@/components/YearsWithMultipleWinners', () => () => <div data-testid="YearsWithMultipleWinners" />);
jest.mock('@/components/TopThreeStudiosWithWinners', () => () => <div data-testid="TopThreeStudiosWithWinners" />);
jest.mock('@/components/ProducersWithLongestAndShortest', () => () => <div data-testid="ProducersWithLongestAndShortest" />);
jest.mock('@/components/ListMovieWinnersByYear', () => () => <div data-testid="ListMovieWinnersByYear" />);
jest.mock('@/components/Layout', () => ({ children }) => <div>{children}</div>);

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
useRouter.mockImplementation(() => ({
  push: mockPush,
  pathname: '/',
}));

function renderDashboard() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

describe('Dashboard', () => {
  it('renders child components correctly', () => {
    const { getByTestId } = renderDashboard();

    expect(getByTestId('YearsWithMultipleWinners')).toBeInTheDocument();
    expect(getByTestId('TopThreeStudiosWithWinners')).toBeInTheDocument();
    expect(getByTestId('ProducersWithLongestAndShortest')).toBeInTheDocument();
    expect(getByTestId('ListMovieWinnersByYear')).toBeInTheDocument();
  });
});
