import React from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { fetchYearsWithMultipleWinners } from '@/utils/apiCalls';
import { onError } from '@/utils/helpers';

const { Text } = Typography;

export default function YearsWithMultipleWinners() {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchYearsWithMultipleWinners,
    queryKey: ['yearsWithMultipleWinners'],
    onError,
  });

  if (isLoading) {
    return <Spin data-testid='loading-spinner' />;
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
        rowKey='year'
      />
    </Card>
  );
}
