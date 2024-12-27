import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
};

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    }
  },
});

export const { setChats } = chatSlice.actions;

export default chatSlice.reducer;