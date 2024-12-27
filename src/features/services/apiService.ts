import axios from 'axios';
import { notFound, redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchUserAsync } from '../redux/store';
import store from '../redux/store';

const apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });
  
  apiInstance.interceptors.request.use(
    function (config) { 
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
  );
  
  apiInstance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error:any) {
      // Handle error
      if (error.response.status === 500){
        toast.error("Something went wrong, try reloading page")
      }
      if (error.response.status === 401){
        store.dispatch(fetchUserAsync());
      }
      if (error.response.status === 404){
        notFound();
      }
      return Promise.reject(error);
    },
  );
  

  
  export default apiInstance;