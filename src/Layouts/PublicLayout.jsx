import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setEncryptedData,getDecryptedData,removeData } from '../utils/helperFunctions';
const PublicLayouts = () => {
  const user = JSON.parse(getDecryptedData("user"));
  const isAuthenticated = user?.user_id ? true : false;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard/page" />;
};

export default PublicLayouts;
