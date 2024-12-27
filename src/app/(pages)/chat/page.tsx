import { Metadata } from 'next'
import Image from 'next/image'
import React, {FC} from 'react'

type PageProps = {

}
export const generateMetadata = ():Metadata=>{
  return { title:"Chat page"}
}
const Page:FC<PageProps> = ({}) => {
  return (
    <>
   
    <div className='flex flex-row items-center justify-center h-full  rounded-r-lg bg-blue-950  dark:bg-slate-700'>
      <div>
       <Image
            src="/logo.png"
            alt="logo"
            width={500}
            height={500}
            />
        <p className='text-white text-[25px]'>
          Start Chatting with your loved ones
        </p>
          </div>
    </div>
    </>
  )
}

export default Page
