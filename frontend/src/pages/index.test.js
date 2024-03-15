import { render } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Dashboard from '@/pages/index';
import { createTestQueryClient } from '@/utils/testHelpers';

const YearsWithMultipleWinnersMock = () => <div data-testid="YearsWithMultipleWinners" />;
YearsWithMultipleWinnersMock.displayName = 'YearsWithMultipleWinnersMock';
jest.mock('@/components/YearsWithMultipleWinners', () => YearsWithMultipleWinnersMock);

const TopThreeStudiosWithWinnersMock = () => <div data-testid="TopThreeStudiosWithWinners" />;
TopThreeStudiosWithWinnersMock.displayName = 'TopThreeStudiosWithWinnersMock';
jest.mock('@/components/TopThreeStudiosWithWinners', () => TopThreeStudiosWithWinnersMock);

const ProducersWithLongestAndShortestMock = () => <div data-testid="ProducersWithLongestAndShortest" />;
ProducersWithLongestAndShortestMock.displayName = 'ProducersWithLongestAndShortestMock';
jest.mock('@/components/ProducersWithLongestAndShortest', () => ProducersWithLongestAndShortestMock);

const ListMovieWinnersByYearMock = () => <div data-testid="ListMovieWinnersByYear" />;
ListMovieWinnersByYearMock.displayName = 'ListMovieWinnersByYearMock';
jest.mock('@/components/ListMovieWinnersByYear', () => ListMovieWinnersByYearMock);

const LayoutMock = ({ children }) => <div>{children}</div>;
LayoutMock.displayName = 'LayoutMock';
jest.mock('@/components/Layout', () => LayoutMock);


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
