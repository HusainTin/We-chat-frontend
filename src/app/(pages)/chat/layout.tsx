"use client";
import { Inter } from "next/font/google";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, Divider, IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import ChatSidebar from "@/components/chat/ChatSidebar";
import UserProtected from "@/components/auth/UserProtected";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setChats } from "@/features/redux/chat/chatSlice";
import Heading from "@/utils/Heading";
import { LogoutUser } from "@/utils/Logout";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import ThemeSwitcher from "@/utils/Themeswitcher";
import { useTheme } from "next-themes";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const { id } = useParams() as { id: string };
  const { chats } = useSelector((state: any) => state.chats);
  const socketRef = useRef<WebSocket | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [title, setTitle] = useState("Chat Page");
  const open = Boolean(anchorEl);
  const updateNewMessageRef = useRef(null) as any;
  const [user, setUser] = useState() as any;
  const {theme, setTheme} = useTheme()
  const dispatch = useDispatch() as any;
  useEffect(() => {
    const user = JSON.parse(
      window.localStorage.getItem("user_details") || "{}"
    );
    setUser(user);
  }, []);

  // Created useCallback for updating unread messages
  updateNewMessageRef.current = useCallback(
    (message: any) => {
      const chat_id = String(JSON.parse(message?.data).chat_id);
      const updatedChats = chats.map((chat: any) =>
        chat.id === chat_id
          ? {
            ...JSON.parse(message?.data).chat_object
            }
          : chat
      );
      const matchingChatIndex = updatedChats.findIndex(
        (chat: any) => chat.id === chat_id
      );
      if (matchingChatIndex !== -1) {
        const [chatToMove] = updatedChats.splice(matchingChatIndex, 1);
        updatedChats.unshift(chatToMove);
        dispatch(setChats(updatedChats));
      }
    },
    [chats, dispatch]
  );

  // Connnecting to main socket
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket(
        "ws://127.0.0.1:8000/ws/main" +
          "/?token=" +
          localStorage.getItem("access_token")
      );

      socketRef.current = socket;

      socket.onopen = (e) => {
        console.log("Main socket connection established");
      };
      // handle websocket error
      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
        setTimeout(() => {
          console.log("Reconnecting main socket...");
          connectWebSocket();
        }, 5000); 
      };

      socket.onclose = (e) => {
        console.log("Main socket connection closed", e.reason);
      };
    };

    connectWebSocket();

    // Cleanup function to close the socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id]);

  // Onmessage handler of socket
  useEffect(() => {
    const socket = socketRef.current as any;
    socket.onmessage = (message: any) => {
      if (String(JSON.parse(message?.data).type) === "notify_new_message") {
        console.log(JSON.parse(message?.data))
        updateNewMessageRef.current(message);
      }
    };
  });

  // Search icon click handler
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const navigateToProfile = () => {
    const isLessThenMediumScreen = window.matchMedia(
      "(min-width: 0px) and (max-width: 768px)"
    );
    if (isLessThenMediumScreen.matches) {
      router.push("/profile");
    } else {
      router.push("/profile/my-account");
    }
  };
  useEffect(() => {
    const selectedChat = chats.find((chat: any) => chat.id == id);
    if (selectedChat) {
      if (selectedChat.is_group_chat) {
        setTitle("Chat " + selectedChat.group_chat_name);
      } else {
        const oppositeUser = selectedChat?.users?.filter(
          (chatUser: any) => user?.id !== chatUser?.id
        )[0];
        setTitle("Chat " + oppositeUser.username);
      }
    }
  }, [chats, id, user?.id]);

  const handleLogout = async () => {
    await LogoutUser(dispatch);
    router.push("/auth");
  };
  return (
    <>
      <UserProtected>
        <Heading
          title={title}
          description="Chat page for chatting with the loved ones"
        />
        <div className=" bg-gradient-to-r from-blue-950 to-black dark:from-slate-950 dark:to-slate-900 min-h-screen h-full">
          <div className="h-[60px] flex bg-inherit items-center bg-gradient-to-r from-blue-950 to-black dark:from-slate-950 dark:to-slate-900 justify-between">
            <div className="flex items-center mx-10 my-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={50}
                height={50}
                className=""
              />
              <p className="text-[1.5rem] text-white">WeChat</p>
            </div>
            <div className="mx-10 flex">
              <ThemeSwitcher/>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    src={user?.profile_picture}
                    sx={{
                      backgroundColor: getColorForUsername(user?.username),
                      width: 40,
                      height: 40,
                    }}
                  >
                    {capitalizeFirstLetter(user?.username?.charAt(0))}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                sx={{ width: "100%" }}
                PaperProps={{
                  // elevation: 5,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    mr: 100,
                    minWidth: 200,
                    "& .MuiPaper-root": {
                      backgroundColor: theme=="dark"?"#333":"white",
                      color:theme=="dark"? "#fff":"black",
                      borderRadius: "1rem",
                      width: 180
                    },
                    "& .MuiMenuItem-root": {
                      "&:hover": {
                        backgroundColor:theme=="dark"?"#444":"default",
                      },
                    },
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,  
                    },
                    "&::before": {
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                    backgroundColor: theme=="dark"?"#444":"default",
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div className="px-3 py-1 w-full">
                  <p className="font-serif text-[25px] text-blue-900 capitalize dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                <Divider />
                <MenuItem onClick={navigateToProfile} sx={{
                  color:theme=="dark"? "#fff":"black",
                }}>
                  {user?.profile_picture ? (
                    <Avatar src={user.profile_picture} />
                  ) : (
                    <Avatar
                      sx={{
                        backgroundColor: getColorForUsername(user?.username),
                      }}
                    >
                      {capitalizeFirstLetter(user?.username?.charAt(0))}
                    </Avatar>
                  )}{" "}
                  My account
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: theme=="dark"?"#ff6767":"red" }}>
                  <ListItemIcon sx={{ color: theme=="dark"?"#ff6767":"red" }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </div>
          <div className={`bg-slate-100 rounded-xl flex h-[90vh]  mx-5`}>
            <ChatSidebar />
            <div
              className={` w-full flex-col h-[90vh] rounded-l-lg rounded-r-lg md:rounded-l-none overflow-hidden ${
                id ? "flex" : "md:flex hidden"
              }`}
            >
              {children}
            </div>
          </div>
        </div>
      </UserProtected>
    </>
  );
};

export default Layout;
