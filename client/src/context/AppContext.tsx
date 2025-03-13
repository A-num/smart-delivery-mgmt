import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { DeliveryPartner, Order, Assignment, AssignmentMetrics } from '../types';
import { LoadingContext } from './LoadingContext';

type AppContextType = {
  partner: DeliveryPartner | undefined;
  setPartner: (partner: DeliveryPartner | undefined) => void | undefined;
  partners: DeliveryPartner[];
  orders: Order[];
  assignments: Assignment[];
  assignmentMetrics: AssignmentMetrics | null;
  fetchPartners: () => void;
  fetchOrders: () => void;
  fetchAssignments: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [partner, setPartner] = useState<DeliveryPartner | undefined>(() => {
    const storedPartner = localStorage.getItem('partner');
    console.log(`stored partner: ${localStorage.getItem('partner')}`);
    return storedPartner ? JSON.parse(storedPartner) : null;
  });

  useEffect(() => {
    if (partner) {
      localStorage.setItem('partner', JSON.stringify(partner));
    } else {
      localStorage.removeItem('partner');
    }
  }, [partner]);
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentMetrics, setAssignmentMetrics] = useState<AssignmentMetrics | null>(null);

  const loadingContext = useContext(LoadingContext);

  const fetchPartners = async () => {
    try {
      loadingContext?.showLoading();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/partners`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignment-metrics`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();

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
    const token = localStorage.getItem('token');
    if(!token) return;
    fetchPartnerData(token);
    fetchPartners();
    fetchOrders();
    fetchAssignments();
  }, []);

  const fetchPartnerData = async (token: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/fetch-partner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.status == 200) {
        console.log(`Partner fetched in app context: ${data}`);
        setPartner(data);
        localStorage.setItem("partner", data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <AppContext.Provider value={{ 
      partner,
      partners, 
      orders, 
      assignments, 
      assignmentMetrics,
      setPartner,
      fetchPartners, 
      fetchOrders,
      fetchAssignments
    }}>
      {children}
    </AppContext.Provider>
  );
};
