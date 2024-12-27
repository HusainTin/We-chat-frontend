import { setChats } from "@/features/redux/chat/chatSlice";
import { Avatar, ListItemIcon } from "@mui/material";
import { NextPage } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import GroupsIcon from "@mui/icons-material/Groups";
import { avatarColors } from "@/utils/constants";
import { getColorForUsername, capitalizeFirstLetter } from "@/utils/helper";
import React from "react";
interface Props {
  chat: any;
  id: any;
}

const ChatListItem: NextPage<Props> = ({ chat, id }) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const selected = usePathname().split("/")[2];
  const dispatch = useDispatch();
  const router = useRouter();
  const { chats } = useSelector((state: any) => state.chats);

  const handleChatChange = (chat: any) => {
    if (id != chat.id) {
      router.push(`/chat/${chat.id}`);
    }
    const updatedChats = chats.map((c: any) =>
      c.id === chat.id ? { ...c, unread_message: 0 } : c
    );
    dispatch(setChats(updatedChats));
  };

  const oppositeUser = chat.users.filter(
    (chatUser: any) => user?.id !== chatUser?.id
  )[0];

  function truncateMessage(message: string) {
    if (message && message.length > 16) {
      return message.substring(0, 16) + "...";
    }
   return message
  }

  return (
    <>
      <div
        key={chat?.id}
        className={`flex items-center px-6 py-1  cursor-pointer h-[70px] transform ease-in-out translate-y-0.5 ${
          selected === chat?.id
            ? "bg-blue-200 dark:bg-slate-600"
            : "bg-white dark:hover:bg-slate-700 dark:bg-slate-800 "
        } border-b-[0.5px] `}
        onClick={() => {
          handleChatChange(chat);
        }}
      >
        <ListItemIcon>
          {chat?.is_group_chat ? (
            <Avatar>
              <GroupsIcon />
            </Avatar>
          ) : (
            <Avatar
              src={oppositeUser.profile_picture}
              sx={{
                backgroundColor: getColorForUsername(oppositeUser?.username),
              }}
            >
              {capitalizeFirstLetter(oppositeUser?.username?.charAt(0))}
            </Avatar>
          )}
        </ListItemIcon>
        <div
            className={`text-[16px] font-Poppins m-2 text-slate-900 dark:text-white flex flex-col`}
          >
             {chat?.is_group_chat ?
             (<>
                {chat?.group_chat_name}
             </>
             ):(
                <>
                {oppositeUser?.username}
                </>
             )}
             {chat?.unread_message > 0 ? (
              <span className="text-[12px] text-blue-500 dark:text-yellow-200">
                {" "}
                {chat?.unread_message} unread messages
              </span>
            ) : (
              <>
                <span className="text-[12px] text-slate-600 dark:text-slate-300">
                  {chat?.last_message ? (
                    <>
                      {user?.id == chat?.last_message?.sender?.id ? (
                        <>
                          you :{" "}
                          <span className="">
                            {truncateMessage(chat?.last_message?.message)}
                          </span>
                        </>
                      ) : (
                        <>
                          {chat?.last_message?.sender?.username} :{" "}
                          <span className="">
                            {truncateMessage(chat?.last_message?.message)}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              </>
            )}
          </div>
      </div>
    </>
  );
};

export default ChatListItem;
