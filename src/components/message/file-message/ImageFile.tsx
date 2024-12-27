import React, { useState } from 'react'
import { NextPage } from 'next'
import { Modal, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

interface Props {
  message:any
}

const ShowImageModal  = ({message, handleClose} :any)=>{
  const downloadImage = async () => {
    try {
      const response = await fetch(message.file.file)
      const blob = await response.blob() // Convert the image to a Blob
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob) // Create a URL for the Blob
      link.href = url
      link.download = message.file.file_name || 'downloaded_image' // Set the file name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up the URL after the download
    } catch (error) {
      console.error('Error downloading the image:', error)
    }
  }


  return (
    <div className=' h-full w-full flex items-center justify-center flex-col'>
      <div className='p-2  flex w-[70vw] justify-end gap-4'>
        <IconButton onClick={downloadImage}>
        <CloudDownloadIcon className='text-[2rem] text-white'/>
        </IconButton>
      <IconButton aria-label="" onClick={handleClose}>
        <CloseIcon className='text-[2rem] text-white'/>
      </IconButton>
      </div>
      <img src={message.file.file} alt={message.file.file_name} className='w-[70vw] max-h-[80vh] object-cover'/>
    </div>
  )
}
const ImageFile: NextPage<Props> = ({message}) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>

    <div className='flex cursor-pointer' onClick={handleOpen}>
      {/* <Image src={message.file.file} width={100} alt={""}/> */}
      <img src={message.file.file} alt={message.file.file_name} className='w-[20vw] rounded-lg'/>
    </div>
    <Modal open={open} onClose={handleClose} >
    <ShowImageModal message={message} handleClose={handleClose} />
    </Modal>
    </>

  )
}

export default ImageFile