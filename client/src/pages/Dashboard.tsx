import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { partners, orders } = context;

  const activeOrders = orders.filter((o) => o.status !== 'delivered').length;
  const totalPartners = partners.length;
  const activePartners = partners.filter((p) => p.status === 'active').length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg">
          <p>Total Orders</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <p>Active Orders</p>
          <p className="text-2xl font-bold">{activeOrders}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <p>Active Partners</p>
          <p className="text-2xl font-bold">{activePartners} / {totalPartners}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
