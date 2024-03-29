import React from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { fetchTopThreeStudiosWithWinners } from '@/utils/apiCalls';
import { onError } from '@/utils/helpers';

const { Text } = Typography;

export default function TopThreeStudiosWithWinners() {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchTopThreeStudiosWithWinners,
    queryKey: ['studiosWithWinCount'],
    onError,
  });

  if (isLoading) {
    return <Spin data-testid='loading-spinner' />;
  }

  if (isError) {
    return <Text>Failed to load studios with win count</Text>;
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Win Count',
      dataIndex: 'winCount',
      key: 'winCount',
    },
  ];

  return (
    <Card style={{ width: 550 }} title='Top 3 studios with winners'>
      <Table
        style={{ width: 500 }}
        dataSource={data}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
        rowKey='name'
      />
    </Card>
  );
}
