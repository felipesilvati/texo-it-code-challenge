'use client';
import React, { useState } from 'react';
import { Typography, Table, Card, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
import { constructQueryString } from '@/utils/helpers';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [year, setYear] = useState(null);
  const [winner, setWinner] = useState(null);
  const queryParams = { page, size, year, winner };
  const queryString = constructQueryString(queryParams);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios.get(`${BASE_API_URL}?${queryString}`).then(res => res.data),
    queryKey: ['listMovies', queryString],
    onError: (error) => console.error(error),
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setPage(pagination.current - 1);
    setSize(pagination.pageSize);

    const newYear = filters.year?.[0] || null;
    const newWinner = filters.winner?.[0] || null;

    if (newYear !== year || newWinner !== winner) {
      setPage(0);
      setYear(newYear);
      setWinner(newWinner);
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
    {
      title: 'Winner?', dataIndex: "winner", key: "winner", render: (winner) => winner ? 'Yes' : 'No',
      filters: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
    },
  ];

  return (
    <Layout>
      <Card style={{ marginTop: 16 }} title='List movies'>
        <Table
          dataSource={data?.content}
          columns={columns}
          pagination={{ total: totalElements, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} movies` }}
          onChange={handleTableChange}
        />
      </Card >
    </Layout>
  );
}
