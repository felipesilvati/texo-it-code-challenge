
import React from 'react';
import { Button, Radio, Space } from 'antd';

const WinnerFilterDropdown = ({ setFilters, close }) => {
  return (
    <div style={{ padding: 8 }}>
      <Radio.Group
        onChange={e => {
          const winner = e.target.value;
          setFilters(currentFilters => ({
            ...currentFilters,
            winner
          }));
          close();
        }}
      >
        <Radio value="true">Yes</Radio>
        <Radio value="false">No</Radio>
      </Radio.Group>
      <Space style={{ marginTop: 8 }}>
        <Button
          onClick={() => {
            setFilters(currentFilters => ({ ...currentFilters, winner: null }));
          }}
          size="small"
        >
          Reset
        </Button>
        <Button
          onClick={close}
          size="small"
        >
          Close
        </Button>
      </Space>
    </div>
  );
};

export default WinnerFilterDropdown;