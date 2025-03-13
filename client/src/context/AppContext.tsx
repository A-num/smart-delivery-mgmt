import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { DeliveryPartner, Order, Assignment, AssignmentMetrics } from '../types';
import { LoadingContext } from './LoadingContext';

type AppContextType = {
  partners: DeliveryPartner[];
  orders: Order[];
  assignments: Assignment[];
  assignmentMetrics: AssignmentMetrics | null; // ✅ Allow null initially
  fetchPartners: () => void;
  fetchOrders: () => void;
  fetchAssignments: () => void; // ✅ Added this
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentMetrics, setAssignmentMetrics] = useState<AssignmentMetrics | null>(null);

  const loadingContext = useContext(LoadingContext);

  const fetchPartners = async () => {
    try {
      loadingContext?.showLoading();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/partners`);
      if (!res.ok) throw new Error('Failed to fetch partners');
      const data = await res.json();
      setPartners(data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  const fetchOrders = async () => {
    try {
      loadingContext?.showLoading();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  const fetchAssignments = async () => {
    try {
      loadingContext?.showLoading();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/assignments/metrics`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();

      // ✅ Type Guard to handle incomplete data
      if (data && data.assignments && data.metrics) {
        setAssignments(data.assignments);
        setAssignmentMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchOrders();
    fetchAssignments();
  }, []);

  return (
    <AppContext.Provider value={{ 
      partners, 
      orders, 
      assignments, 
      assignmentMetrics,
      fetchPartners, 
      fetchOrders,
      fetchAssignments
    }}>
      {children}
    </AppContext.Provider>
  );
};
