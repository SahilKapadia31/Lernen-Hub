import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setEncryptedData,getDecryptedData,removeData } from '../../../utils/helperFunctions';

const SuperAdminNonAuthRoute = () => {
  const user = JSON.parse(getDecryptedData("superUser"));
  const isAuthenticated = user?.user_id ? true : false;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/superadmin/dashboard" />;
};

export default SuperAdminNonAuthRoute;
