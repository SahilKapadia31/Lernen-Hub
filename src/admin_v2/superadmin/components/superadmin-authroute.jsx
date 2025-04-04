import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setEncryptedData, getDecryptedData, removeData } from '../../../utils/helperFunctions';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../features/authSlice';

const SuperAdminAuthRoute = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(getDecryptedData("superUser"));
  const role = JSON.parse(getDecryptedData("superRole")) || null;
  if (user) {
    dispatch(loginSuccess({user,role:role}))
  }
  const isAuthenticated = user?.user_id ? true : false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/superadmin/login" />;
};

export default SuperAdminAuthRoute;