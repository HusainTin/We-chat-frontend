import { CircularProgress } from '@mui/material'
import React, { FC } from 'react'

type LoaderProps = {

}
const Loader:FC<LoaderProps> = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <CircularProgress color="primary" />
    </div>
  )
}

export default Loader
