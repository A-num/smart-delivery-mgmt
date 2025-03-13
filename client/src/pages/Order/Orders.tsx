import { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LoadingContext } from '../../context/LoadingContext';

const Orders = () => {
  const context = useContext(AppContext);
  const loadingContext = useContext(LoadingContext);

  if (!context) return null;

  const { orders, fetchOrders } = context;

  const [area, setArea] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loadingContext?.showLoading();

      console.log("before fetch");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: "John Doe",
            phone: "1234567890",
            address: "123 Street",
          },
          area: area,
          items: [{ name: "Pizza", quantity: 1, price: 10 }],
          status: "pending",
          scheduledFor: "2025-03-20T10:00:00Z",
          assignedTo: "67d1c9bf9a9c2dff8016da5f",
          totalAmount: 10,
        }),
      });

      console.log("after fetch");
      if (!res.ok) throw new Error('Failed to create order');

      fetchOrders(); 


      setArea('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-lg">
        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Customer Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Customer Address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Create Order
        </button>
      </form>

      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => {
          loadingContext?.showLoading();
          fetchOrders();
        }}
      >
        Refresh Orders
      </button>

      <ul>
        {orders.map((order) => (
          <li key={order._id} className="border-b py-2">
            {order._id} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
