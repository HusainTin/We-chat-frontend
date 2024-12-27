import { ThunkDispatch } from "@reduxjs/toolkit";
  
  interface AuthState {
    accessToken: string;
    refreshToken: string;
  }
  
  // Define a type for your combined state
  export interface RootState {
    user: any;
    auth: AuthState;
  }
  
  // Define a type alias for the dispatch function with thunk middleware
  export type AppDispatch = ThunkDispatch<RootState, undefined, any>;
  