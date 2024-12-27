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
      className={`flex-col w-full md:w-[380px] dark:bg-slate-800 bg-white  ${
        id ? "md:flex hidden" : "flex "
      } md:border-r-[0.5px] border-0 rounded-l-xl md:rounded-r-none rounded-r-lg overflow-hidden`}
    >
      <div className="flex  bg-inherit z-10 p-0 m-0 rounded-l-xl md:rounded-r-none rounded-r-lg">
        <div className=" flex w-full items-center h-[50px] shadow-none p-2 mt-[10px] ml-[4px] py-0.5 px-3 rounded-l-xl md:rounded-r-none rounded-r-lg">
          <button
            type="button"
            className="p-1 rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
            aria-label="search"
            onClick={handleSearchIconClick}
          >
            <SearchIcon />
          </button>
          <input
            type="text"
            className="px-2 py-2 rounded-lg  focus:outline-none  w-full dark:text-slate-200 text-black bg-white dark:bg-slate-800"
            placeholder="Search"
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <div className="flex">
            <Tooltip title="Add New Chat">
              <IconButton onClick={() => setOpen(true)}>
                <PersonAddIcon className="dark:text-slate-200 text-blue-700" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex">
        <div className="w-full h-[81vh] overflow-y-auto">
          <ChatList />
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center"
      >
        <div className="bg-white w-[400px] dark:bg-slate-800">
          <div className="flex justify-end">
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
          {/* <div className="float-end">
            <button
              type="button"
              className="text-red-600 hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div> */}
        </div>
      </Modal>
    </div>
  );
};

export default ChatSidebar;
