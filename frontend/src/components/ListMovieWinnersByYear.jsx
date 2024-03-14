'use client';
import React, { useState } from 'react';
import { Button, Typography, Table, Card, InputNumber, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { onError } from '@/utils/helpers';
import { fetchMovieWinnersByYear } from '@/utils/apiCalls';
const { Text } = Typography;

export default function ListMovieWinnersByYear() {
  const [searchYear, setSearchYear] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const isSearchYearValid = !!searchYear && !isNaN(searchYear) && parseInt(searchYear, 10) > 0;
  const { data, isError } = useQuery({
    queryFn: () => fetchMovieWinnersByYear(searchYear),
    queryKey: ['listMovieWinnersByYear', searchYear],
    onError,
    enabled: isSearchYearValid && searchActive,
    onSettled: () => setSearchActive(false),
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
        <InputNumber data-testid='search-text' style={{ width: '100%' }} min={1} max={new Date().getFullYear()} onChange={setSearchYear} value={searchYear} placeholder='Search by year' onPressEnter={() => setSearchActive(true)} />
        <Button data-testid='search-button' type='primary' onClick={() => setSearchActive(true)} disabled={!isSearchYearValid}>Search</Button>
      </Space.Compact>
      <Table
        style={{ width: 500 }}
        dataSource={data}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
        rowKey='id'
      />
    </Card >
  );
}
