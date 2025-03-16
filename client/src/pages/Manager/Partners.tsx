import { useContext, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { AppContext } from '../../context/AppContext';

const Partners = () => {

  const context = useContext(AppContext);
  const partners = context?.partners;
  const fetchPartners = context?.fetchPartners;

  useEffect(() => {
    if(fetchPartners)
      fetchPartners();
  }, [])

  const columns = [
    {
      title: 'Partner Id',
      dataIndex: '_id',
      key: 'id',
    },
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
      title: 'Current Load',
      dataIndex: 'currentLoad',
      key: 'currentLoad'
    },
    {
      title: 'Ratings',
      dataIndex: ['metrics', 'rating'],
      key: 'metrics_rating'
    },
    {
      title: 'Completed Orders',
      dataIndex: ['metrics', 'completedOrders'],
      key: 'metrics_completedOrders'
    },
    {
      title: 'Cancelled Orders',
      dataIndex: ['metrics','cancelledOrders'],
      key: 'metrics_cancelledOrders'
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
      <Table 
        dataSource={partners}
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

export default Partners;
