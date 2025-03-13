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

      await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customer: { name: 'John Doe', phone: '1234567890', address: '123 Street' },
          area,
          items: [{ name: 'Pizza', quantity: 1, price: 10 }],
          status: 'pending',
          totalAmount: 10,
        }),
      });

      fetchOrders(); // Refresh order list
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
        placeholder="Order Number"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        className="border p-2 w-full"
      />
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
