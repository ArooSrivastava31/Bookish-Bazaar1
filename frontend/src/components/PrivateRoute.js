import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // You can show a loading spinner here while checking auth state
    return <div>Loading...</div>;
  }

  // Outlet renders the child route's element if the user is authenticated.
  // Otherwise, it redirects them to the /login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

