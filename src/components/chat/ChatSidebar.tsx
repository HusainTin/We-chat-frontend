"use client";
import { getAllChat } from "@/features/services/chatService";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import AddSingleChat from "./AddSingleChat";
import AddGroupChat from "./AddGroupChat";
import ChatList from "./ChatList";
import { useParams } from "next/navigation";
import { setChats } from "@/features/redux/chat/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTheme } from "next-themes";
import CloseIcon from "@mui/icons-material/Close";

type ChatSidebarProps = {};
const ChatSidebar: FC<ChatSidebarProps> = ({}) => {
  const { id } = useParams() as { id: string };
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState(0);
  const [search, setSearch] = useState("");
  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };
  const dispatch = useDispatch() as any;
  const tabContent = [
    { label: "New chat", content: <AddSingleChat setOpen={setOpen} /> },
    { label: "new Group chat", content: <AddGroupChat setOpen={setOpen} /> },
  ];
  const { theme } = useTheme();

  // const tabBackgroundColor = theme === "dark" ? "grey" : "white";
  const tabTextColor = theme === "dark" ? "white" : "#1976d2";

  useEffect(() => {
    try {
      getAllChat({ search: search })
        .then((chat) => {
          dispatch(setChats(chat?.data?.results));
        })
        .catch((err: any) => {});
    } catch (err: any) {}
  }, [search, dispatch]);

  const inputRef = useRef() as any;

  const handleSearchIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div
      className={`chat-sidebar-panel ${
        id ? "md:flex hidden" : "flex"
      }`}
    >
      {/* Header */}
      <div className="chat-sidebar-header">
        <h2 className="chat-sidebar-title">Chats</h2>
        <Tooltip title="Add New Chat">
          <IconButton
            onClick={() => setOpen(true)}
            className="chat-sidebar-add-btn"
          >
            <PersonAddIcon className="dark:text-slate-300 text-blue-600" sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="chat-sidebar-search-wrapper">
        <div className="chat-sidebar-search">
          <button
            type="button"
            className="chat-sidebar-search-icon"
            aria-label="search"
            onClick={handleSearchIconClick}
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </button>
          <input
            type="text"
            className="chat-sidebar-search-input"
            placeholder="Search conversations..."
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="chat-sidebar-list">
        <ChatList />
      </div>

      {/* Add chat modal */}
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center"
      >
        <div className="bg-white w-[400px] dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex justify-end p-1">
            <IconButton className="text-[red] dark:text-red-400" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="add-chat-tabs"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: tabTextColor,
                  },
                }}
              >
                {tabContent.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    sx={{
                      width: "50%",
                      color: theme == "dark" ? "#cbd5e1" : "black",
                      "&.Mui-selected": {
                        color: theme === "dark" ? "white" : "#1976d2", // Change to your desired color
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
            {tabContent.map((tab, index) => (
              <Box key={index} hidden={value !== index}>
                {value === index && tab.content}
              </Box>
            ))}
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default ChatSidebar;
