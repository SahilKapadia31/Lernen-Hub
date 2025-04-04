// features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const tourSlice = createSlice({
  name: 'tour',
  initialState: {
    isTourOpen:false,
    tourKey:0
  },
  reducers: {
    closeTour: (state, action) => {
      state.isTourOpen = false;
      console.log("enter");
      
    },
    openTour: (state) => {
      state.isTourOpen = true;
      state.tourKey = state.tourKey + 1;
    },
  },
});

export const { closeTour, openTour } = tourSlice.actions;
export default tourSlice.reducer;
