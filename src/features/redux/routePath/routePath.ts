import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paths: [],
};

export const routePathsSlice = createSlice({
  name: 'routePaths',
  initialState,
  reducers: {
    setRoutePaths: (state, action) => {
      state.paths = action.payload;
    }
  },
});

export const { setRoutePaths } = routePathsSlice.actions;

export default routePathsSlice.reducer;