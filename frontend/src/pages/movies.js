'use client';
import React, { useState } from 'react';
import { Typography, Table, Card, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, FilterFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
import { constructQueryString } from '@/utils/helpers';
import FilterDropdown from '@/components/FilterDropdown';
import WinnerFilterDropdown from '@/components/WinnerFilterDropdown';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({ year: null, winner: null });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listMovies', page, size, filters],
    queryFn: () => axios.get(`${BASE_API_URL}${constructQueryString({ page, size, ...filters })}`).then(res => res.data),
    onError: (error) => console.error(error),
  });

  const handleTableChange = (pagination, antdFilters, sorter) => {
    setPage(pagination.current - 1);
    setSize(pagination.pageSize);

    setFilters(() => ({
      year: antdFilters.year ? antdFilters.year[0] : null,
      winner: antdFilters.winner ? (antdFilters.winner[0] === 'true') : null,
    }));
  };


  if (isLoading) {
    return <Spin />;
  }

  if (isError) {
    return <Text>Failed to  load movies</Text>;
  }

  const { totalElements } = data || {};

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ close }) => (
      <FilterDropdown
        dataIndex="year"
        handleSearch={(value) => {
          setFilters(prev => ({ ...prev, year: value }));
          close();
        }}
        handleReset={() => {
          setFilters(prev => ({ ...prev, year: null }));
          close();
        }}
        close={close}
      />
    ),
    filterIcon: () => {
      const isActiveFilter = filters.year !== null;
      return (
        <SearchOutlined
          style={{
            color: isActiveFilter ? '#1677ff' : undefined,
          }}
        />
      )
    },
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    { title: 'Id', dataIndex: 'id', key: 'id' },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps('year'),
    },
    { title: 'Title', dataIndex: "title", key: "title" },
    {
      title: 'Winner?',
      dataIndex: "winner",
      key: "winner",
      render: (winner) => winner ? 'Yes' : 'No',
      filterIcon: () => {
        const isActiveFilter = filters.winner !== null;
        if (isActiveFilter) {
          return <FilterFilled style={{ color: '#1677ff' }} />
        } else {
          return <FilterOutlined style={{ color: '#bfbfbf' }} />
        }
      },
      filterDropdown: ({ close }) => (
        <WinnerFilterDropdown
          close={close}
          setFilters={setFilters}
          dataIndex="winner"
        />
      ),
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
