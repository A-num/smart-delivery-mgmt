import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LoadingContext } from '../context/LoadingContext';
//import { ToastContext } from '../context/ToastContext';

const Orders = () => {
  const context = useContext(AppContext);
  const loadingContext = useContext(LoadingContext);

  if (!context) return null;

  const { orders, fetchOrders } = context;

  // State for form inputs
  const [orderNumber, setOrderNumber] = useState('');
  const [area, setArea] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loadingContext?.showLoading();

      const newOrder = {
        orderNumber,
        customer: {
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
        },
        area,
        items: [{ name: 'Pizza', quantity: 1, price: 10 }], // Example item
        status: 'pending',
        totalAmount: 10,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) throw new Error('Failed to create order');

      // ✅ Optimistic update — update state before fetching
      fetchOrders(); 


      // Reset form
      setOrderNumber('');
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

      {/* ✅ Create Order Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-lg">
        <input
          type="text"
          placeholder="Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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

      {/* ✅ Refresh Orders Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={() => {
          loadingContext?.showLoading();
          fetchOrders();
        }}
      >
        Refresh Orders
      </button>

      {/* ✅ Display Orders */}
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="border-b py-2">
            {order.orderNumber} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
