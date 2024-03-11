import React from 'react';
import { Typography, Table, Spin, Card, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';

const { Text, Title } = Typography;

export default function ProducersWithLongestAndShortest() {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}/?projection=max-min-win-interval-for-producers`)
      .then((res) => res.data),
    queryKey: ['maxMinWinIntervalForProducers'],
    onError: (error) => console.error(error),
  });

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return <Text>Failed to load producers with longest and shortest win intervals</Text>;
  }

  const columns = [
    { title: 'Producer', dataIndex: 'producer', key: 'producer' },
    { title: "Interval", dataIndex: "interval", key: "interval" },
    { title: 'Previous Year', dataIndex: "previousWin", key: "previousWin" },
    { title: 'Following Year', dataIndex: "followingWin", key: "followingWin" },
  ];

  return (
    <Card style={{ marginTop: 16, width: 550 }} title='Producers with longest and shortest interval between wins'>
      <Flex vertical>
        <Table
          title={() => <Title level={5}>Maximum</Title>}
          style={{ width: 500 }}
          dataSource={data?.max}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
        />

        <Table
          title={() => <Title level={5}>Minimum</Title>}
          style={{ width: 500 }}
          dataSource={data?.min}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
        />
      </Flex>
    </Card>
  );
}
