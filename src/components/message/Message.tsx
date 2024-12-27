"use client";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { NextPage } from "next";
import React, { useState } from "react";
import ThreeDotMenu from "./menu/ThreeDotMenu";
import ReplyMessage from "./ReplyMessage";
import MessageMenu from "./menu/Menu";
import MessageReactions from "./reactions/MessageReactions";
import { useSelector } from "react-redux";
import FileMessage from "./file-message/FileMessage";
import dynamic from "next/dynamic";
import TextMessage from "./TextMessage";
import Replied from "./replied/Replied";

interface Props {
  message: any;
  index: number;
  handleMessageUnsend: (message: any) => void;
  handleMessageEdit: (message: any) => void;
  handleMessageReply: (message: any) => void;
  handleReactionRemove: (message_id: any) => void;
}

const Message: NextPage<Props> = ({
  message,
  index,
  handleMessageUnsend,
  handleMessageEdit,
  handleMessageReply,
  handleReactionRemove,
}) => {
  const MessageMenu = dynamic(() => import("./menu/Menu"), {
    loading: () => <></>, // Optional: Loading fallback
    ssr: false, // Optional: Disable server-side rendering
  });
  const [isHovered, setIsHovered] = useState(false);
  const { messages }: any = useSelector((state: any) => state.messages);
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const options: any = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const getNextMessageDate = (index: any) => {
    return new Date(messages[index + 1]?.created_at);
  };
  const getIsLastMessage = (index: any) => {
    return messages[index - 1]?.sender?.id !== message?.sender?.id;
  };
  const dateObject = new Date(message?.created_at);
  const formattedDate = dateObject.toLocaleTimeString("en-US", options);
  const nextMessageDate = getNextMessageDate(index);
  const timeDifference =
    Math.abs(nextMessageDate.getTime() - dateObject.getTime()) / (1000 * 60); // in minutes
  const showMessageDate =
    dateObject.toDateString() != nextMessageDate.toDateString();
  const isCurrentUser = message?.sender?.id === user?.id;
  const showAvatar = messages[index + 1]?.sender?.id !== message?.sender?.id;
  const isLastMessage = getIsLastMessage(index);
  const messagesDate = dateObject.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const today = new Date();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

  const date =
    dateObject.toLocaleDateString() == today.toLocaleDateString()
      ? "today"
      : dateObject.toLocaleDateString() == yesterday.toLocaleDateString()
      ? "yesterday"
      : messagesDate;

  return (
    <>
      <div className="overflow-visible">
        <div className="flex w-full justify-center items-center">
          {showMessageDate && (
            <div className="text-[10px] text-gray-600 dark:text-slate-300">
              {date}
            </div>
          )}
        </div>

        <div
          className={`flex ${
            isCurrentUser ? "justify-end items-end" : ""
          } mb-4`}
          onMouseEnter={() => setIsHovered(true)} // Show menu on hover
          onMouseLeave={() => setIsHovered(false)} // Hide menu when not hovered
        >
          <div className={`w-[32px] h-[32px] ${showAvatar ? "m-2" : "mx-2"}`}>
          {!isCurrentUser && showAvatar && (
              message?.sender?.profile_picture ? (
                <Avatar
                  src={message?.sender?.profile_picture}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar
                  sx={{
                    backgroundColor: getColorForUsername(
                      message?.sender?.username
                    ),
                    width: 32,
                    height: 32,
                  }}
                >
                  {capitalizeFirstLetter(message?.sender?.username?.charAt(0))}
                </Avatar>
              )
            )}
            </div>

          <div>
            {message?.replied_to && (
              <Replied message={message} isCurrentUser={isCurrentUser}/>
            )}

            <div
              className={`flex overflow-visible ${
                isCurrentUser ? "justify-end" : ""
              }`}
            >
              {isCurrentUser && isHovered && (
                <MessageMenu
                  isCurrentUser={isCurrentUser}
                  handleMessageReply={handleMessageReply}
                  message={message}
                  handleMessageEdit={handleMessageEdit}
                  handleMessageUnsend={handleMessageUnsend}
                />
              )}
              <div className="relative">
              {message.type === "text" ? (
                <TextMessage isCurrentUser={isCurrentUser} message={message} />
              ) : (
                <FileMessage message={message} isCurrentUser={isCurrentUser} />
              )}

              {message?.reactions.length > 0 && (
                <MessageReactions
                message={message}
                isCurrentUser={isCurrentUser}
                handleReactionRemove={handleReactionRemove}
                />
              )}
              </div>

              {!isCurrentUser && isHovered && (
                <MessageMenu
                  isCurrentUser={isCurrentUser}
                  handleMessageReply={handleMessageReply}
                  message={message}
                  handleMessageEdit={handleMessageEdit}
                  handleMessageUnsend={handleMessageUnsend}
                />
              )}
            </div>

            {message?.edited && (
              <div
                className={`text-[10px] text-gray-600 dark:text-slate-300 ${
                  isCurrentUser ? "float-end pl-2" : "float-start pr-2"
                }`}
              >
                Edited
              </div>
            )}

            {(isLastMessage || timeDifference > 30) && (
              <div
                className={`text-[10px] text-gray-600 dark:text-slate-300 ${
                  isCurrentUser ? "float-end" : "float-start"
                }`}
              >
                {formattedDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
