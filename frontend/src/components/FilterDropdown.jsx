import React from 'react';
import { Button, Space, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const FilterDropdown = React.forwardRef(({
  dataIndex,
  setSelectedKeys,
  selectedKeys,
  handleSearch,
  handleReset,
  close
}, ref) => {

  const validateAndSearch = (selectedKeys) => {
    const year = selectedKeys[0];
    if (!year || isNaN(year) || parseInt(year, 10) < 0) {
      message.error('Please enter a valid year');
      return;
    }

    handleSearch(year, dataIndex);
  };

  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={ref}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => validateAndSearch(selectedKeys)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => validateAndSearch(selectedKeys)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            handleReset();
            setSelectedKeys([]);
            ref.current.focus();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={close}
          style={{ width: 90 }}
        >
          Close
        </Button>
      </Space>
    </div>
  );
});

export default FilterDropdown;
