import { NextPage } from "next";
import ReplyMessage from "../ReplyMessage";
import ThreeDotMenu from "./ThreeDotMenu";
import Reaction from "../reactions/Reaction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import React from "react";
interface Props {
  isCurrentUser: boolean;
  message: any;
  handleMessageReply: (message: any) => void;
  handleMessageUnsend: (message: any) => void;
  handleMessageEdit: (message: any) => void;
}

const MessageMenu: NextPage<Props> = ({
  isCurrentUser,
  handleMessageReply,
  message,
  handleMessageEdit,
  handleMessageUnsend,
}) => {
  return (
    <>
      <div
        className={`h-full items-center flex ${
          isCurrentUser ? "mr-1" : "ml-1 flex-row-reverse"
        }`}
      >
            <Reaction isCurrentUser={isCurrentUser} message={message} />
            <ReplyMessage
              message={message}
              handleMessageReply={handleMessageReply}
            />
            <ThreeDotMenu
              isCurrentUser={isCurrentUser}
              message={message}
              handleMessageUnsend={handleMessageUnsend}
              handleMessageEdit={handleMessageEdit}
            />
      </div>
    </>
  );
};

export default MessageMenu;
