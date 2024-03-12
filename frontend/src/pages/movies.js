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
  const [year, setYear] = useState(null);
  const [winner, setWinner] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const queryParams = { page, size, year, winner };
  const queryString = constructQueryString(queryParams);

  const handleSearch = (value, dataIndex) => {
    setYear(value);
    setSearchedColumn(dataIndex);
  };

  const handleReset = () => {
    setYear(null);
    setWinner(null);
    setSearchedColumn(null);
  };

  const { data, isLoading, isError } = useQuery({
    queryFn: () => axios.get(`${BASE_API_URL}?${queryString}`).then(res => res.data),
    queryKey: ['listMovies', queryString, searchedColumn],
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
    filterDropdown: ({
      setSelectedKeys, selectedKeys, close
    }) => (
      <FilterDropdown
        ref={searchInput}
        dataIndex={dataIndex}
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        confirm={confirm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        close={close}
      />
    ),
    filterIcon: () => {
      const isActiveFilter = dataIndex === 'year' ? year !== null : dataIndex === 'winner' ? winner !== null : false;
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
          searchWords={[year]}
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
        const isActiveFilter = winner !== null;
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
          pagination={{ total: totalElements, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} movies` }}
          onChange={handleTableChange}
        />
      </Card >
    </Layout>
  );
}
