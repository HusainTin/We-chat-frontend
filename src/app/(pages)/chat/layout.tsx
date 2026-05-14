"use client";
import { Inter } from "next/font/google";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, Divider, IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChatSidebar from "@/components/chat/ChatSidebar";
import AppSidebar from "@/components/chat/AppSidebar";
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
        <div className="chat-app-container">
          {/* Left icon sidebar — hidden on mobile */}
          <div className="chat-app-sidebar-wrapper">
            <AppSidebar user={user} onProfileClick={handleClick} />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              sx={{ width: "100%" }}
              PaperProps={{
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.2))",
                  mt: -1,
                  ml: 2,
                  minWidth: 200,
                  "& .MuiPaper-root": {
                    backgroundColor: theme === "dark" ? "#1e293b" : "white",
                    color: theme === "dark" ? "#f1f5f9" : "black",
                    borderRadius: "1rem",
                    width: 180,
                  },
                  "& .MuiMenuItem-root": {
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#334155" : "rgba(0, 0, 0, 0.04)",
                    },
                  },
                  backgroundColor: theme === "dark" ? "#1e293b" : "white",
                  color: theme === "dark" ? "#f1f5f9" : "black",
                  borderRadius: "12px",
                },
              }}
              transformOrigin={{ horizontal: "left", vertical: "bottom" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold truncate dark:text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{user?.username}
                </p>
              </div>
              <Divider sx={{ borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
              <MenuItem onClick={navigateToProfile} sx={{ mt: 1 }}>
                <ListItemIcon>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '1rem', backgroundColor: getColorForUsername(user?.username) }} src={user?.profile_picture}>
                    {capitalizeFirstLetter(user?.username?.charAt(0))}
                  </Avatar>
                </ListItemIcon>
                My account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SettingsOutlinedIcon fontSize="small" sx={{ color: theme === "dark" ? "#cbd5e1" : "inherit" }} />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
              <MenuItem onClick={handleLogout} sx={{ color: theme === "dark" ? "#ef4444" : "red", mb: 0.5 }}>
                <ListItemIcon sx={{ color: theme === "dark" ? "#ef4444" : "red" }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>

          {/* Chat sidebar (contacts list) */}
          <div className="chat-contacts-wrapper">
            <ChatSidebar />
          </div>

          {/* Main chat area */}
          <div
            className={`chat-main-wrapper ${
              id ? "chat-main-visible" : "chat-main-hidden-mobile"
            }`}
          >
            {children}
          </div>
        </div>
      </UserProtected>
    </>
  );
};

export default Layout;
