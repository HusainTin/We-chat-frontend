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
    <div className='chat-empty-state'>
      <div className='chat-empty-state-inner'>
        <div className='chat-empty-logo-wrapper'>
          <Image
            src="/logo.png"
            alt="logo"
            width={140}
            height={140}
            className="chat-empty-logo"
          />
        </div>
        <h2 className='chat-empty-title'>WeChat</h2>
        <p className='chat-empty-subtitle'>
          Select a conversation or start a new chat
        </p>
        <div className='chat-empty-decoration'>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Page
