'use client';
import React, { useRef, useState } from 'react';
import { Button, Radio, Typography, Table, Card, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, FilterFilled } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
import Highlighter from 'react-highlight-words';
import { constructQueryString } from '@/utils/helpers';
import FilterDropdown from '@/components/FilterDropdown';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState({ year: null, winner: null });
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listMovies', page, size, filters, searchedColumn],
    queryFn: () => axios.get(`${BASE_API_URL}?${queryString}`).then(res => res.data),
    onError: (error) => console.error(error),
  });

  const queryString = constructQueryString({
    page,
    size,
    year: filters.year,
    winner: filters.winner,
  });

  const handleSearch = (value, dataIndex) => {
    setFilters({ ...filters, [dataIndex]: value });
    setSearchedColumn(dataIndex);
  };

  const handleReset = () => {
    setFilters({ year: null, winner: null });
    setSearchedColumn(null);
  };

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
    filterDropdown: ({ confirm, clearFilters, close }) => (
      <FilterDropdown
        dataIndex="year"
        handleSearch={(value) => {
          setFilters(prev => ({ ...prev, year: value }));
          confirm();
        }}
        handleReset={() => {
          setFilters(prev => ({ ...prev, year: null }));
          clearFilters();
          confirm();
        }}
        close={close}
      />
    ),
    filterIcon: () => {
      const isActiveFilter = dataIndex === 'year' ? filters.year !== null : dataIndex === 'winner' ? filters.winner !== null : false;
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[filters.year]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
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
          return <FilterFilled />
        } else {
          return <FilterOutlined style={{ color: '#bfbfbf' }} />
        }
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Radio.Group
            onChange={e => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              confirm();
            }}
            value={selectedKeys[0]}
          >
            <Radio value="true">Yes</Radio>
            <Radio value="false">No</Radio>
          </Radio.Group>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleReset();
            }}
            size="small"
            style={{ width: 90, marginTop: 8 }}
          >
            Reset
          </Button>
        </div>
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
          pagination={{ hideOnSinglePage: true, total: totalElements, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} movies` }}
          onChange={handleTableChange}
        />
      </Card >
    </Layout>
  );
}
