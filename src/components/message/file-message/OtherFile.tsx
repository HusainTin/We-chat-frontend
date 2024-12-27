import React from "react";
import { NextPage } from "next";
import { getFileSize, truncateFileName } from "@/utils/helper";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface Props {
  isCurrentUser: boolean;
  message: any;
}

const OtherFile: NextPage<Props> = ({ isCurrentUser, message }) => {
  const file = message.file;
  return (
    <>
      <div
        className={`flex w-[250px] h-[60px] items-center relative group ${
          isCurrentUser
            ? "bg-indigo-500 text-white"
            : "bg-white text-gray-700 dark:text-slate-100 dark:bg-slate-700"
        } rounded-xl gap-1 overflow-visible shadow-sm max-w-full`}
      >
        <div className={`m-2`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25px"
            height="25px"
            viewBox="0 0 16 16"
            fill="#fff"
          >
            <path d="M7 0H2V16H14V7H7V0Z" fill="#fff" />
            <path d="M9 0V5H14L9 0Z" fill="#fff" />
          </svg>
        </div>

        <div className="flex flex-col ">
          <Tooltip title={file.file_name} placement="top">
            <p className="text-[14px]">{truncateFileName(file.file_name)}</p>
          </Tooltip>
          <p className="text-[12px] text-slate-200">
            {getFileSize(file.file_size)}
          </p>
        </div>

        {/* Icon button that appears on hover */}
        <div className="hidden group-hover:flex absolute right-0">
          <IconButton
            aria-label="download-file"
            onClick={() => {}}
            href={file.file}
          >
            <FileDownloadIcon className="border border-white text-[25px] text-white rounded-full backdrop-blur-lg p-[1px]" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default OtherFile;
