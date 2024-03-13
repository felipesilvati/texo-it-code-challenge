import React from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';

const { Text } = Typography;

export default function TopThreeStudiosWithWinnersTable() {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}/?projection=studios-with-win-count`)
      .then((res) => res.data?.studios?.slice(0, 3)),
    queryKey: ['studiosWithWinCount'],
    onError: (error) => console.error(error),
  });

  if (isLoading) {
    return <Spin />;
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
      />
    </Card>
  );
}
