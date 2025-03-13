import { useEffect, useState } from 'react';
import { Card, Row, Col, Switch, List, message, Tabs } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import './partner.css'

const { TabPane } = Tabs;

interface Metric {
  totalOrders: number;
  completedOrders: number;
  rating: number;
}

interface Order {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
}

interface Assignment {
  _id: string;
  orderNumber: string;
  status: string;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  areas: string[];
  shift: {
    start: string;
    end: string;
  };
}

const PartnerDashboard = () => {
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/partner/123/dashboard`);
      const data = await res.json();
      setMetrics(data.metrics);
      setActiveOrders(data.activeOrders);
      setRecentAssignments(data.recentAssignments);
      setAvailabilityStatus(data.availabilityStatus === 'active');
    } catch (error) {
      message.error('Failed to fetch dashboard data');
    }
  };

  const handleStatusChange = async (status: boolean) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/partner/123/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status ? 'active' : 'inactive' }),
      });
      setAvailabilityStatus(status);
      message.success('Availability updated');
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
        <h1>Dashboard</h1>
      <Tabs defaultActiveKey="1" tabPosition="left" tabBarGutter={30} type="card">
        {/* ✅ Key Metrics */}
        <TabPane tab="Key Metrics" key="1">
          <Row gutter={16}>
            {metrics && (
              <>
                <Col span={8}>
                  <Card className="border rounded-lg shadow-md" title="Total Orders">
                    {metrics.totalOrders}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className="border rounded-lg shadow-md" title="Completed Orders">
                    {metrics.completedOrders}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card className="border rounded-lg shadow-md" title="Rating">
                    {metrics.rating.toFixed(1)}
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </TabPane>

        {/* ✅ Active Orders Map */}
        <TabPane tab="Active Orders" key="2">
          <Card className="border rounded-lg shadow-md" title="Active Orders">
            {/* Uncomment and update center when adding map */}
            {/* <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '300px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {activeOrders.map((order) => (
                <Marker key={order._id} position={[order.location.lat, order.location.lng]}>
                  <Popup>
                    Order Status: {order.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer> */}
            <p className="text-gray-500 italic">Map display will be here</p>
          </Card>
        </TabPane>

        {/* ✅ Availability Status */}
        <TabPane tab="Availability Status" key="3">
          <Card className="border rounded-lg shadow-md" title="Availability Status">
            <Switch
              checked={availabilityStatus}
              onChange={handleStatusChange}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Card>
        </TabPane>

        {/* ✅ Recent Assignments */}
        <TabPane tab="Recent Assignments" key="4">
          <Card className="border rounded-lg shadow-md" title="Recent Assignments">
            <List
              dataSource={recentAssignments}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined />}
                    title={`Order ${item.orderNumber}`}
                    description={`Status: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PartnerDashboard;
