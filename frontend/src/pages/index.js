'use client';
import { Flex } from 'antd'
import Layout from '@/components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YearsWithMultipleWinnersTable from '@/components/YearsWithMultipleWinnersTable';
import TopThreeStudiosWithWinnersTable from '@/components/TopThreeStudiosWithWinnersTable';
import ProducersWithLongestAndShortest from '@/components/ProducersWithLongestAndShortest';
import ListMovieWinnersByYear from '@/components/ListMovieWinnersByYear';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        keepPreviousData: true,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );

}

function Dashboard() {
  return (
    <Layout>
      <Flex gap='large'>
        <YearsWithMultipleWinnersTable />
        <TopThreeStudiosWithWinnersTable />
      </Flex>

      <Flex gap='large'>
        <ProducersWithLongestAndShortest />
        <ListMovieWinnersByYear />
      </Flex>
    </Layout>
  );
}
