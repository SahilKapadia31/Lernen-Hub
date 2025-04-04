import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setEncryptedData, getDecryptedData, removeData } from '../utils/helperFunctions';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(getDecryptedData("user"));
  if (user) {
    dispatch(loginSuccess({user}))
  }
  const isAuthenticated = user?.user_id ? true : false;
  return isAuthenticated ? <Outlet /> : <Navigate to="/loginpage" />;
};

export default ProtectedLayout;