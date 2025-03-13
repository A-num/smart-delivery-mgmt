import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LoadingContext } from '../context/LoadingContext';

const CreateOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [area, setArea] = useState('');
  const { fetchOrders } = useContext(AppContext)!;
  const loadingContext = useContext(LoadingContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      loadingContext?.showLoading();

      await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Order
      </button>
    </form>
  );
};

export default CreateOrder;
