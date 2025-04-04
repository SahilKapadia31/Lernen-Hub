import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setEncryptedData,getDecryptedData,removeData } from '../../../utils/helperFunctions';

const OrganizationNonAuthRoute = () => {
  const user = JSON.parse(getDecryptedData("orgUser"));
  const isAuthenticated = user?.user_id ? true : false;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/organization/dashboard" />;
};

export default OrganizationNonAuthRoute;
