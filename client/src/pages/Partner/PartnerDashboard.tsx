import { useContext, useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Switch,
  List,
  message,
  Tabs,
  Form,
  Button,
  Input,
  TimePicker,
  Tag,
  Table,
} from "antd";
import dayjs from "dayjs";
import { EnvironmentOutlined } from "@ant-design/icons";
import "./partner.css";
import { AppContext } from "../../context/AppContext";
import DraggableSelect from "../../components/DraggableSelect";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

interface Metric {
  totalOrders: number;
  completedOrders: number;
  rating: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  totalAmount: number;
  scheduledFor: string;
}

interface Assignment {
  _id: string;
  orderNumber: string;
  status: string;
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
  const navigate = useNavigate();

  const [shift, setShift] = useState<{
    start: String | null;
    end: String | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (partner == null) {
        const storedPartner = localStorage.getItem("partner");
        if (setPartner)
          setPartner(storedPartner ? JSON.parse(storedPartner) : null);
      }
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/dashboard`
      );
      const data = await res.json();
      if (setPartner && data.partner) {
        setPartner(data.partner);
        setAreas(data.partner.areas);
        setShift({
          start: data.partner.shift.start ?? "",
          end: data.partner.shift.end ?? "",
        });
        localStorage.setItem("partner", data.partner);
      }
      setMetrics(data.metrics);
      console.log(data.activeOrders)
      setActiveOrders(data.activeOrders);
      setRecentAssignments(data.recentAssignments);
      setAvailabilityStatus(data.availabilityStatus === "active");
    } catch (error) {
      message.error("Failed to fetch dashboard data");
    }
  };

  const handleAreasUpdate = async (values: any) => {
    try {
      values["areas"] = areas;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/areas`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (setPartner) setPartner(data.partner);
      alert("Partner updated successfully");
      message.success("Partner updated successfully");
      context?.fetchPartners;
    } catch (error) {
      message.error("Failed to update partner");
    }
  };

  const handleUpdatePartner = async (values: any) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (setPartner) setPartner(data.partner);
      alert("Partner updated successfully");
      message.success("Partner updated successfully");
      context?.fetchPartners;
    } catch (error) {
      message.error("Failed to update partner");
    }
  };

  const handleShiftTimeChange = async (values: any) => {
    if (values) {
      const shiftStart = values[0].format("HH:mm");
      const shiftEnd = values[1].format("HH:mm");
      const updatedShift = {
        start: shiftStart,
        end: shiftEnd,
      };
      setShift(updatedShift);
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/shift`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              start: updatedShift.start,
              end: updatedShift.end
            }),
          }
        );
        message.success("Shift updated successfully");
      } catch (error) {
        message.error("Failed to update shift");
      }
    }
  };

  const handleViewDetails = (orderId: string) => {
    navigate(`/partnerDashboard/orders/${orderId}`);
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: '_id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer: any) => (
        <p>
          {customer['name']} | {customer['address']} | {customer['phone']}
        </p>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'id',
    },
    {
      title: 'Scheduled For',
      dataIndex: 'scheduledFor',
      key: 'scheduled_for',
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
    {
      title: 'Action',
      key: 'action',
      dataIndex: '_id',
      render: (id: any) => (
        <button onClick={() => handleViewDetails(id)}>
        View Order
      </button>
      ),
    },
  ];

  const handleStatusChange = async (status: boolean) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/partners/${partner?._id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status ? "active" : "inactive" }),
        }
      );
      setAvailabilityStatus(status);
      message.success("Availability updated");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        tabBarGutter={30}
        type="card"
      >
        <TabPane tab="Key Metrics" key="1">
          <Row gutter={16}>
            {metrics && (
              <>
                <Col span={8}>
                  <Card
                    className="border rounded-lg shadow-md"
                    title="Total Orders"
                  >
                    {metrics.totalOrders}
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    className="border rounded-lg shadow-md"
                    title="Completed Orders"
                  >
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
            { activeOrders.length === 0  ? (
          <p className="text-gray-500 italic">Your orders will appear here once assigned</p>
             ) : (
                 <div style={{ padding: '20px' }}>
                 <Table 
                   dataSource={activeOrders}
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
             )
          }
            
          </Card>
        </TabPane>

        <TabPane tab="Availability Status" key="3">
          <Card
            className="border rounded-lg shadow-md"
            title="Availability Status"
          >
            <Switch
              checked={availabilityStatus}
              onChange={handleStatusChange}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Card>
        </TabPane>

        <TabPane tab="Schedule Shift" key="4">
          <Card className="border rounded-lg shadow-md" title="Schedule Shift">
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Shift Timing:</p>
              <TimePicker.RangePicker
                format="HH:mm"
                onChange={handleShiftTimeChange}
                value={
                  shift.start && shift.end
                    ? [
                        dayjs(
                          `${dayjs().format("YYYY-MM-DD")}T${shift.start}:00`,
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                        dayjs(
                          `${dayjs().format("YYYY-MM-DD")}T${shift.end}:00`,
                          "YYYY-MM-DDTHH:mm:ss"
                        ),
                      ]
                    : undefined
                }
              />
            </div>
          </Card>
        </TabPane>

        <TabPane tab="Recent Assignments" key="5">
          <Card className="border rounded-lg shadow-md" title="Recent Assignments">
            { recentAssignments.length === 0  ? (
          <p className="text-gray-500 italic">Your recent assignments will appear here once assigned</p>
             ) : (
                 <div style={{ padding: '20px' }}>
                 <Table 
                   dataSource={recentAssignments}
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
             )
          }
            
          </Card>
        </TabPane>

        <TabPane tab="Area Selection" key="6">
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
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "16px" }}
                >
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </TabPane>

        <TabPane tab="Edit Partner" key="7">
          <Form
            layout="vertical"
            onFinish={handleUpdatePartner}
            initialValues={{
              email: partner?.email,
              phone: partner?.phone,
              area: partner?.areas,
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
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
