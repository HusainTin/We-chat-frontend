"use client"
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";

export default function Page() {
    const router = useRouter();
    const [route, setRoute]= useState("Login")
    const [loading, setLoading]= useState(true)
    useEffect(()=>{
        const refresh_token = localStorage.getItem("refresh_token") 
       const access_token =  localStorage.getItem("access_token") 
       if (access_token && refresh_token){
        router.push('/chat')
        }
        setLoading(false)
    },[router])
    if (loading){
        return <Loader/>
    }
    if (route == "Login"){
        return (
            <Login setRoute={setRoute}/>
        )
    }

    else if (route == "Register"){
        return (
            <Register setRoute={setRoute}/>
        )
    }
    
    else{
        return {notFound: true}
    }
//   return (
//     <>
//       <h1>Login</h1>
//     </>
//   );
}
