import { getFileSize, truncateFileName } from '@/utils/helper';
import { Tooltip } from '@mui/material';
import { NextPage } from 'next'
import { useTheme } from 'next-themes';

interface Props {
  message : any;
  type:string;
}

const OtherFile: NextPage<Props> = ({message, type}) => {
  const {theme} = useTheme()
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const file = message?.file;
  return (
    <>
    <div
        className={`flex w-[200px] h-[45px] items-center relative group rounded-xl gap-1 overflow-visible shadow-sm max-w-full  ${
        type == "replied_to"&&
        message?.sender?.id == user?.id
        ? "bg-indigo-400"
        : "bg-slate-300 dark:bg-slate-500"
        }`}
      >
        <div className={`ml-2 mr-1`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 16 16"
            fill={theme =="dark"?"#fff":"#000"}
          >
            <path d="M7 0H2V16H14V7H7V0Z" fill={theme =="dark"?"#fff":"#000"} />
            <path d="M9 0V5H14L9 0Z" fill={theme =="dark"?"#fff":"#000"} />
          </svg>
        </div>

        <div className="flex flex-col ">
          <Tooltip title={file.file_name} placement="top">
            <p className="text-[12px] text-slate-800 dark:text-slate-100">{truncateFileName(file.file_name)}</p>
          </Tooltip>
          <p className="text-[10px] dark:text-slate-200 text-slate-600">
            {getFileSize(file.file_size)}
          </p>
        </div>
      </div>
    </>
  )
}

export default OtherFile