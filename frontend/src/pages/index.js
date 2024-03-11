'use client';
import Layout from '@/components/layout';
import { Typography, Spin, Table } from 'antd';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
const { Text, Title } = Typography;

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

  const maybeRenderYearsWithMultipleWinners = () => {
    if (yearsWithMultipleWinners.isLoading) {
      return <Spin />
    }

    if (yearsWithMultipleWinners.isError) {
      return <Text>Failed to load years with multiple winners</Text>
    }

    const columns = [
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: 'Win Count',
        dataIndex: 'winnerCount',
        key: 'winnerCount',
      },

    ]

    return (
      <Table
        title={() => <Title level={5}>List Winners with Multiple Winners</Title>}
        style={{ width: 350 }}
        dataSource={yearsWithMultipleWinners?.data?.data?.years}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />)
  }

  return (
    <Layout>
      {maybeRenderYearsWithMultipleWinners()}
    </Layout>
  );
}
