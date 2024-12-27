"use client"
import { refreshToken, verifyToken } from './../services/authService';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from './user/userSlice';
import authReducer, { setAuth } from './auth/authSlice';
import routePathReducer from './routePath/routePath';
import chatReducer from "./chat/chatSlice"
import messagesReducer from "./message/messagesSlice"
import { setupListeners } from '@reduxjs/toolkit/query';
import { getUserProfile } from '../services/userService';

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    chats:chatReducer,
    messages:messagesReducer,
    routePaths:routePathReducer,
  },
});

setupListeners(store.dispatch);

export const fetchUserAsync = () =>
  async (dispatch:any) => {
    try {
      if (typeof window !== 'undefined') {
        const refresh_token = localStorage.getItem("refresh_token");
        const access_token = localStorage.getItem("access_token");
        if (access_token){
          try {
            const res =await verifyToken()
            if (res?.data?.active==false){
              await fetchNewTokens(dispatch)
              const res = await getUserProfile()
              localStorage.setItem("user_details", JSON.stringify(res.data))
              dispatch(setUser(JSON.stringify(res.data)));
              window.location.reload();
            }
          } catch (error) {
            localStorage.clear()
          }
        }else{
          if (refresh_token){
            await fetchNewTokens(dispatch)
            const res = await getUserProfile()
            localStorage.setItem("user_details", JSON.stringify(res.data))
            dispatch(setUser(JSON.stringify(res.data)));
            window.location.reload();
          }else{
            localStorage.clear()
          }
        }
      }
    } catch (error: any) {
      localStorage.clear()
    }
  };

  const fetchNewTokens =async(dispatch:any)=>{
    const response:any = await refreshToken(); // Assuming the response structure
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    dispatch(setAuth({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    }));
    dispatch(setUser(localStorage.getItem("user_details")))
  }

store.dispatch(fetchUserAsync());


export default store;