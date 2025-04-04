import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/features/authSlice';
import tourReducer from '../../src/features/tourSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tour: tourReducer
  },
});

export default store;