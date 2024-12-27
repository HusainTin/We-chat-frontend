import React from "react";
import { NextPage } from "next";
import ReplyIcon from "@mui/icons-material/Reply";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  message: any;
  handleMessageReply: (message: any) => void;
}

const ReplyMessage: NextPage<Props> = ({ message, handleMessageReply }) => {
  return (
    <>
      <div className="flex">
        <Tooltip title="Reply">
          <IconButton
            aria-label="reply_message"
            onClick={(e: any) => {
              e.preventDefault();
              handleMessageReply(message);
            }}
          >
            <ReplyIcon className="md:text-[20px] text-[18px] text-black dark:text-slate-400" />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
};

export default ReplyMessage;
