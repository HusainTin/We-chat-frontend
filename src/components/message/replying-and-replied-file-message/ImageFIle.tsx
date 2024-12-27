import { NextPage } from 'next'

interface Props {
    file:any;
}

const ImageFile: NextPage<Props> = ({file}) => {
  return (
    <>
<div className='flex cursor-pointer' >
      {/* <Image src={message.file.file} width={100} alt={""}/> */}
      <img src={file.file} alt={file.file_name} className='w-[5vw] rounded-lg'/>
    </div>
    </>
  )
}

export default ImageFile