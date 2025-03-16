import { JSX, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const PartnerProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { partner } = useContext(AppContext) || {};

  if (!partner) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PartnerProtectedRoute;
