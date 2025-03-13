import { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Switch, List, message, Tabs, Form, Button, Input, Select } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import './partner.css'
import { AppContext } from '../../context/AppContext';
import DraggableSelect from '../../components/DraggableSelect';

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
  const [areas, setAreas] = useState<String[]>();
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<boolean>(true);
  const context = useContext(AppContext);
  const partner = context?.partner;
  const setPartner = context?.setPartner;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (partner == null) {
        const storedPartner = localStorage.getItem("partner");
        console.log(`parter in local storage: ${storedPartner}`);
        if (setPartner)
          setPartner(storedPartner ? JSON.parse(storedPartner) : null);
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/dashboard`
      );
      const data = await res.json();
      setMetrics(data.metrics);
      setActiveOrders(data.activeOrders);
      setRecentAssignments(data.recentAssignments);
      setAvailabilityStatus(data.availabilityStatus === "active");
      setAreas(partner?.areas);
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    }
  };

    const handleAreasUpdate = async (values: any) => {
    try {
      values['areas'] = areas;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/areas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (setPartner) setPartner(data.partner);
      alert("Partner updated successfully");
      message.success('Partner updated successfully');
      context?.fetchPartners
    } catch (error) {
      message.error('Failed to update partner');
    }
  };

    const handleUpdatePartner = async (values: any) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (setPartner) setPartner(data.partner);
      alert("Partner updated successfully");
      message.success('Partner updated successfully');
      context?.fetchPartners
    } catch (error) {
      message.error('Failed to update partner');
    }
  };

  const handleStatusChange = async (status: boolean) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/status`, {
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

        <TabPane tab="Active Orders" key="2">
          <Card className="border rounded-lg shadow-md" title="Active Orders">
            {//TODO: active orders here
            }
            <p className="text-gray-500 italic">Map display will be here</p>
          </Card>
        </TabPane>

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

        <TabPane tab="Area Selection" key="5">
          <Row gutter={16}>
            <Form
              layout="vertical"
              onFinish={handleAreasUpdate}
              initialValues={{
                email: partner?.email,
                phone: partner?.phone,
                area: partner?.areas,
              }}
            >
              <DraggableSelect setAreas={setAreas}></DraggableSelect>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{marginLeft: "16px"}}>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </TabPane>
         <TabPane tab="Edit Partner" key="6">
            <Form
              layout="vertical"
              onFinish={handleUpdatePartner}
              initialValues={{
                email: partner?.email,
                phone: partner?.phone,
                area: partner?.areas,
              }}
            >
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter email' }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Password" name="password">
                <Input.Password />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PartnerDashboard;
