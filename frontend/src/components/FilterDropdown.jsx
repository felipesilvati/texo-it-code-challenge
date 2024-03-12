// FilterDropdown.jsx adjustment
import React from 'react';
import { Button, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const FilterDropdown = React.forwardRef(({
  dataIndex,
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  handleSearch,
  handleReset,
  close
}, ref) => {
  return (
    <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Input
        ref={ref}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => { handleSearch(selectedKeys, confirm, dataIndex); }}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => { handleSearch(selectedKeys, confirm, dataIndex); }}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters();
            handleReset();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => { close(); }}
        >
          Close
        </Button>
      </Space>
    </div>
  );
});

export default FilterDropdown;
