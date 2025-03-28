import { useContext, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {

  const context = useContext(AppContext);
  const orders = context?.orders;
  const fetchOrders = context?.fetchOrders;

  useEffect(() => {
    if(fetchOrders)
      fetchOrders();
  }, [])

  const columns = [
    {
      title: 'Order Number',
      dataIndex: '_id',
      key: 'id',
    },
    {
      title: 'Scheduled For',
      dataIndex: 'scheduledFor',
      key: 'scheduled_for',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assigned_to'
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'assigned' || status === 'picked' ? 'yellow' : status === 'completed' ? 'green': 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Table 
        dataSource={orders}
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

export default Dashboard;