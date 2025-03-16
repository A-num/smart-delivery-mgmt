import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { DeliveryPartner, Order, Assignment, AssignmentMetrics, Manager } from '../types';
import { LoadingContext } from './LoadingContext';

type AppContextType = {
  partner: DeliveryPartner | undefined;
  setPartner: (partner: DeliveryPartner | undefined) => void | undefined;
  manager: Manager | undefined;
  setManager: (manager: Manager | undefined) => void | undefined;
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
    return storedPartner ? JSON.parse(storedPartner) : null;
  });
 
  const [manager, setManager] = useState <Manager | undefined>(() => {
    const storedManager = localStorage.getItem('manager');
    return storedManager ? JSON.parse(storedManager) : null;
  });

  useEffect(() => {
    if (partner) {
      localStorage.setItem('partner', JSON.stringify(partner));
    }
    else if (manager){
      localStorage.setItem('manager', JSON.stringify(manager));
    }
     else {
      localStorage.removeItem('partner');
      localStorage.removeItem('manager');
    }
  }, [partner, manager]);
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
      const data: Order[] = await res.json();
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/assignments`);
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const data = await res.json();
      if (data) {
        setAssignments(data);
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
    fetchPartners();
    fetchOrders();
    fetchAssignments();
  }, []); 

  return (
    <AppContext.Provider value={{ 
      partner,
      partners, 
      orders, 
      manager,
      assignments, 
      assignmentMetrics,
      setPartner,
      setManager,
      fetchPartners, 
      fetchOrders,
      fetchAssignments
    }}>
      {children}
    </AppContext.Provider>
  );
};
