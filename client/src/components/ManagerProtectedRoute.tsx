import { JSX, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const ManagerProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { manager } = useContext(AppContext) || {};

  if (!manager) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ManagerProtectedRoute;
