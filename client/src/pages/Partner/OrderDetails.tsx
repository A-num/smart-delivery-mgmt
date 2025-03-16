import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, List, Tag, message } from "antd";

interface Order {
  _id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "assigned" | "picked" | "delivered";
  scheduledFor: string;
  totalAmount: number;
}

const OrderDetails = () => {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/get-order-by-id/${id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch order");

      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      message.error("Failed to load order details");
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <Card title={`Order #${order._id}`} className="mt-4">
      <p>
        <strong>Customer:</strong> {order.customer.name} (
        {order.customer.phone})
      </p>
      <p>
        <strong>Address:</strong> {order.customer.address}
      </p>
      <p>
        <strong>Area:</strong> {order.area}
      </p>
      <p>
        <strong>Scheduled For:</strong> {order.scheduledFor}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <Tag color={getOrderColor(order.status)}>{order.status.toUpperCase()}</Tag>
      </p>

      <List
        header={<strong>Items</strong>}
        bordered
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item>
            {item.name} (x{item.quantity}) - ₹{item.price}
          </List.Item>
        )}
      />

      <p>
        <strong>Total Amount:</strong> ₹{order.totalAmount}
      </p>
    </Card>
  );
};

const getOrderColor = (status: string) => {
  switch (status) {
    case "pending":
      return "red";
    case "assigned":
    case "picked":
      return "yellow";
    case "delivered":
      return "green";
    default:
      return "red";
  }
};

export default OrderDetails;
