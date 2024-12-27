"use client"
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { loginWithOauth } from '@/features/services/authService';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/redux/user/userSlice';
import { setAuth } from '@/features/redux/auth/authSlice';
import toast from 'react-hot-toast';

// import {quer}

function OauthCallback() {
    const {provider} = useParams()
    const params = useSearchParams()
    const dispatch = useDispatch()
    const router = useRouter()
     
    useEffect(() => {
      const data = {
        code:params.get("code")
      }
      loginWithOauth({data, provider}).then((res:any)=>{
        const expiry_date = new Date(Date.now() +  res.data.details.expires_in * 1000)
        const user_details = res.data.details?.user_details
        localStorage.setItem("access_token", res.data.details.access_token)
        localStorage.setItem("refresh_token", res.data.details.refresh_token)
        localStorage.setItem("user_details", JSON.stringify(user_details))
        localStorage.setItem("expiry_date",JSON.stringify(expiry_date)) 

        dispatch(setUser(JSON.stringify(res.data.details)));
        dispatch(setAuth({
          "access_token": JSON.stringify(res.data.details.access_token),
          "refresh_token": JSON.stringify(res.data.details.refresh_token),
        }));
        if (user_details?.is_password_set == true){
          router.replace("/chat") // Redirect to home page when login is successful  // Change this to the actual page you want to redirect to.  // You might want to replace it with a router.push() or useRouter.replace() depending on your routing setup.  // For example, if you're using Next.js, you could use `router.push('/chat')` instead.  // You can also store the user's details in the Redux store for easier access throughout your app.  // If you're using Next.js with Redux Toolkit, you could use `store.dispatch(actions.setUser(res.data.user))
        }else{
          router.replace("/auth/user-details")
        }
      }).catch((error:any)=>{
        router.replace("/auth")
        toast.error("Something went wrong, try to log in again")
        console.log(error)
      })
    }, [provider,params, dispatch, router]);

    return (
        <div className='h-[100vh] w-full flex items-center justify-center'>
        <CircularProgress/>
      </div>
    );
}

export default OauthCallback;
