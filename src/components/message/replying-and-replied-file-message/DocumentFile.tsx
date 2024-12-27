import { NextPage } from "next";
import { GetFileIcon } from "../GetFileIcon";
import { getFileSize, truncateFileName } from "@/utils/helper";
import { IconButton, Tooltip } from "@mui/material";

interface Props {
  message: any;
  type:any;
}

const DocumentFile: NextPage<Props> = ({ message, type }) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const file = message.file
  return (
    <div
      className={`flex w-[200px] h-[45px] items-center relative group rounded-xl gap-1 overflow-visible shadow-sm max-w-full ${
        type == "replied_to"&&
        message?.sender?.id == user?.id
        ? "bg-indigo-400"
        : "bg-slate-300 dark:bg-slate-500"
        }`}
    >
      <div className={`ml-2 mr-1`}>
        <GetFileIcon file={file} width={20} height={20}/>
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
  );
};

export default DocumentFile;
