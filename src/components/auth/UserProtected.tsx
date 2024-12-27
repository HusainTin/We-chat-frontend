'use client'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import store, { fetchUserAsync } from '@/features/redux/store'

type ProtectedProps = {
  children: React.ReactNode,
}

const UserProtected: FC<ProtectedProps> = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const refresh_access_token = async() =>{
   await store.dispatch(fetchUserAsync())
  }
  useEffect(() => {
    const access_token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    const user = JSON.parse(localStorage.getItem("user_details") || "{}");
    if (!access_token && !refresh_token) {
      router.push("/auth")
    } else {
      refresh_access_token()
      if (user && user.is_password_set === false){
        router.replace("/auth/user-details")
      }
      setLoading(false)
    }
  },[router])

  if (loading) {
    return (
      <div className='h-[100vh] w-full flex items-center justify-center'>
        <CircularProgress/>
      </div>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default UserProtected
