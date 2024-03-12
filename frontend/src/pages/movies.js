'use client';
import React, { useState } from 'react';
import { Typography, Table, Card, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(0);
  const [year, setYear] = useState(null);
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}?page=${page}&size=10${year ? `&year=${year}` : ''}`)
      .then((res) => res.data),
    queryKey: ['listMovies', page, year],
    onError: (error) => console.error(error),
  });

  const handleTableChange = (pagination, filters, sorter) => {
    console.log({ pagination, filters, sorter });
    setPage(pagination.current - 1);
    if (filters?.year) {
      setYear(filters.year[0])
      setPage(0)
    } else {
      setYear(null)
    }
  };

  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return <Text>Failed to  load movies</Text>;
  }

  const { totalElements } = data || {};

  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      filters: Array.from(new Set(data?.content?.map(movie => movie.year))).map(year => ({ text: year, value: year })),
    },
    { title: 'Title', dataIndex: "title", key: "title" },
    { title: 'Winner?', dataIndex: "winner", key: "winner", render: (winner) => winner ? 'Yes' : 'No' },
  ];

  return (
    <Layout>
      <Card style={{ marginTop: 16 }} title='List movies'>
        <Table
          dataSource={data?.content}
          columns={columns}
          pagination={{ total: totalElements, showSizeChanger: false }}
          onChange={handleTableChange}
        />
      </Card >
    </Layout>
  );
}
