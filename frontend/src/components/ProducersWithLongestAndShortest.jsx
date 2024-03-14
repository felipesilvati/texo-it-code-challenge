import React from 'react';
import { Typography, Table, Spin, Card, Flex } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { onError } from '@/utils/helpers';
import { fetchProducersWithLongestAndShortestIntervals } from '@/utils/apiCalls';

const { Text, Title } = Typography;

export default function ProducersWithLongestAndShortest() {
  const { data, isLoading, error } = useQuery({
    queryFn: fetchProducersWithLongestAndShortestIntervals,
    queryKey: ['maxMinWinIntervalForProducers'],
    onError,
  });

  if (isLoading) {
    return <Spin data-testid='loading-spinner' />;
  }

  if (error) {
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
          rowKey='producer'
        />

        <Table
          title={() => <Title level={5}>Minimum</Title>}
          style={{ width: 500 }}
          dataSource={data?.min}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
          rowKey='producer'
        />
      </Flex>
    </Card>
  );
}
