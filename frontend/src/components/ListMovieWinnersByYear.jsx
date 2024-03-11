'use client';
import React, { useState } from 'react';
import { Button, Typography, Table, Card, InputNumber, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
const { Text } = Typography;

export default function ListMovieWinnersByYear() {
  const [searchYear, setSearchYear] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const isSearchYearValid = !!searchYear && !isNaN(searchYear) && parseInt(searchYear, 10) > 0;
  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios
      .get(`${BASE_API_URL}/?winner=true&year=${searchYear}`)
      .then((res) => res.data),
    queryKey: ['listMovieWinnersByYear', searchYear],
    onError: (error) => console.error(error),
    enabled: isSearchYearValid && searchActive,
    onSettled: () => setSearchActive(false),
    retry: false,
    keepPreviousData: true,
  });

  if (isError) {
    return <Text>Failed to  load movie winners by year</Text>;
  }

  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: 'Title', dataIndex: "title", key: "title" },
  ];

  return (
    <Card style={{ marginTop: 16, width: 550 }} title='List movie winners by year'>
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <InputNumber style={{ width: '100%' }} min={1} max={3000} defaultValue={1990} onChange={setSearchYear} value={searchYear} placeholder='Search by year' />
        <Button type='primary' onClick={() => setSearchActive(true)} disabled={!isSearchYearValid}>Search</Button>
      </Space.Compact>
      <Table
        style={{ width: 500 }}
        dataSource={data}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </Card >
  );
}
