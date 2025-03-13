import { useContext } from 'react';
import { Table, Tag } from 'antd';
import { AppContext } from '../context/AppContext';

const Partners = () => {

  const context = useContext(AppContext);
  const partners = context?.partners;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Partners</h1>
      <Table 
        dataSource={partners}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Partners;
