import { useContext, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { AppContext } from '../../context/AppContext';

const History = () => {

  const context = useContext(AppContext);
  const assignments = context?.assignments;
  const fetchAssignments = context?.fetchAssignments;

  useEffect(() => {
    if(fetchAssignments)
        fetchAssignments();
  }, [])

  const columns = [
    {
      title: 'Order Id',
      dataIndex: 'orderId',
      key: 'order_id',
    },
    {
      title: 'Partner Id',
      dataIndex: 'partnerId',
      key: 'partner_id',
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'yellow' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Table 
        dataSource={assignments}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          pageSize: 4,
          showSizeChanger: false, 
          showLessItems: true,
        }}
      />
    </div>
  );
};

export default History;