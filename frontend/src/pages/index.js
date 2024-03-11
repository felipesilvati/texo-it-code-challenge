'use client';
import Layout from '@/components/layout';
import { Typography } from 'antd';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
const { Text } = Typography;

const baseApiUrl = 'https://tools.texoit.com/backend-java/api/movies'

export default function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );

}

function Dashboard() {
  const yearsWithMultipleWinners = useQuery({
    queryFn: () => axios.get(baseApiUrl + '/?projection=years-with-multiple-winners'),
    queryKey: ['yearsWithMultipleWinners'],
  })

  return (
    <Layout>
      <Text>Dashboard Page Here</Text>
      <div>{JSON.stringify(yearsWithMultipleWinners?.data)}</div>
    </Layout>
  );
}
