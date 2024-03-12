'use client';
import React, { useRef, useState } from 'react';
import { Button, Space, Input, Typography, Table, Card, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_API_URL } from '@/utils/constants';
import Layout from '@/components/Layout';
import Highlighter from 'react-highlight-words';
import { constructQueryString } from '@/utils/helpers';
const { Text } = Typography;

export default function Movies() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [year, setYear] = useState(null);
  const [winner, setWinner] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
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
          searchWords={[searchText]}
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
