import React from 'react';
import { Card, Typography, Table, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';

const { Text, Title } = Typography;

export default function YearsWithMultipleWinnersTable() {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}/?projection=years-with-multiple-winners`)
      .then((res) => res.data?.years),
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
