'use client';
import React, { useState } from 'react';
import { Typography, Table, Card, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}?page=${page}&size=10`)
      .then((res) => res.data),
    queryKey: ['listMovies', page],
    onError: (error) => console.error(error),
  });

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return <Text>Failed to  load movies</Text>;
  }

  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: 'Title', dataIndex: "title", key: "title" },
    { title: 'Winner?', dataIndex: "winner", key: "winner", render: (winner) => winner ? 'Yes' : 'No'},
  ];

  return (
    <Layout>
      <Card style={{ marginTop: 16 }} title='List movies'>
        <Table
          dataSource={data?.content}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
        />
      </Card >
    </Layout>
  );
}
