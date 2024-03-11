'use client';
import Layout from '@/components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YearsWithMultipleWinnersTable from '@/components/YearsWithMultipleWinnersTable';

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );

}

function Dashboard() {
  return (
    <Layout>
      <YearsWithMultipleWinnersTable />
    </Layout>
  );
}
