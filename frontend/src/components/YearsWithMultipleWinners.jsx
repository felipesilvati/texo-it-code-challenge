import React from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { fetchYearsWithMultipleWinners } from '@/utils/apiCalls';

const { Text } = Typography;

export default function YearsWithMultipleWinnersTable() {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchYearsWithMultipleWinners,
    queryKey: ['yearsWithMultipleWinners'],
    onError: (error) => console.error(error),
  });

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return <Text>Failed to load years with multiple winners</Text>;
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
  ];

  return (
    <Card style={{ width: 550 }} title='List years with multiple winners'>
      <Table
        style={{ width: 500 }}
        dataSource={data}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </Card>
  );
}
