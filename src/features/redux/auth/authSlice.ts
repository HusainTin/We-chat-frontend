import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  access_token: null,
  refresh_token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    unSetAuth: (state) => {
        state.access_token = null;
        state.refresh_token = null;
    },
  },
});

export const { setAuth, unSetAuth } = authSlice.actions;

export default authSlice.reducer;