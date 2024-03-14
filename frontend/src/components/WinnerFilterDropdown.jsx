
import React from 'react';
import { Button, Radio, Space } from 'antd';
import { RedoOutlined, CloseOutlined } from '@ant-design/icons';

const WinnerFilterDropdown = ({ setFilters, setPage, close }) => {
  const [checked, setChecked] = React.useState(null);
  return (
    <div style={{ padding: 8 }}>
      <Radio.Group
        onChange={e => {
          setPage(0);
          const winner = e.target.value;
          setFilters(currentFilters => ({
            ...currentFilters,
            winner
          }));
          setChecked(winner);
          close();

        }}
        value={checked}
      >
        <Radio value="true">Yes</Radio>
        <Radio value="false">No</Radio>
      </Radio.Group>
      <Space style={{ marginTop: 8 }}>
        <Button
          icon={<RedoOutlined />}
          onClick={() => {
            setPage(0);
            setFilters(currentFilters => ({ ...currentFilters, winner: null }));
            setChecked(null);
            close();
          }}
          size="small"
        >
          Reset
        </Button>
        <Button
          icon={<CloseOutlined />}
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