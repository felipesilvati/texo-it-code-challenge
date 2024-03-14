import React, { useState } from 'react';
import { Button, Space, Input, message } from 'antd';
import { SearchOutlined, RedoOutlined, CloseOutlined } from '@ant-design/icons';

const YearFilterDropdown = ({
  dataIndex,
  handleSearch,
  handleReset,
  close,
}) => {
  const [inputValue, setInputValue] = useState('');

  const validateAndSearch = () => {
    const year = parseInt(inputValue, 10);
    if (isNaN(year) || year < 0) {
      message.error('Please enter a valid year');
      return;
    }

    handleSearch(inputValue, dataIndex);
    close();
  };

  return (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onPressEnter={validateAndSearch}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <Space>
        <Button
          type="primary"
          onClick={validateAndSearch}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setInputValue('');
            handleReset();
          }}
          icon={<RedoOutlined />}
        >
          Reset
        </Button>
        <Button
          onClick={close}
          icon={<CloseOutlined />}
        >
          Close
        </Button>
      </Space>
    </div>
  );
};

export default YearFilterDropdown;
