"use client";
import { Avatar, makeStyles } from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import GroupsIcon from "@mui/icons-material/Groups";
import { useSelector } from "react-redux";
import { setChats } from "@/features/redux/chat/chatSlice";
import { useDispatch } from "react-redux";
import ChatListItem from "./ChatListItem";
import { avatarColors } from "@/utils/constants";
type ChatProps = {};

const ChatList: FC<ChatProps> = ({}) => {
  const { chats } = useSelector((state: any) => state.chats);

  const { id } = useParams() as any;

  return (
    <>
      {chats.map((chat: any, index:any) => {
        
        return (
          <ChatListItem key={index} chat={chat} id={id}/>
        );
      })}
    </>
  );
};

export default ChatList;
