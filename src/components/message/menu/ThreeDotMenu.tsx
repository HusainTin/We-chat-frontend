"use client";
import { Divider, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { NextPage } from "next";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import toast from "react-hot-toast";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteMessageForUser } from "@/features/services/chatService";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMessages } from "@/features/redux/message/messagesSlice";
import { useTheme } from "next-themes";

interface Props {
  isCurrentUser: boolean;
  message: any;
  handleMessageUnsend: (message: any) => void;
  handleMessageEdit: (message: any) => void;
}

const checkMessageIsInLastHour = (createdAt: string): boolean => {
  const dateObject = new Date(createdAt);
  const today = new Date();
  const timeDifference = Math.abs(today.getTime() - dateObject.getTime()) / (1000 * 60);
  return timeDifference <= 60;
};

const ThreeDotMenu: NextPage<Props> = ({
  isCurrentUser,
  message,
  handleMessageUnsend,
  handleMessageEdit
}) => {
  const dispatch = useDispatch();
  const {theme,setTheme} = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { messages } = useSelector((state: any) => state.messages);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.message)
      .then(() => toast.success("Copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err));
    handleClose();
  };

  const handleDeleteForMe = async () => {
    try {
      await deleteMessageForUser(message.id);
      toast.success("Message deleted");
      dispatch(setMessages(messages.filter((m:any) => m.id !== message.id)));
    } catch (error: any) {
      toast.error("Failed to delete message");
    }
  };

  const menuItems = [
    isCurrentUser && !message.edited && checkMessageIsInLastHour(message.created_at) && (
      <MenuItem key="edit" onClick={() => { handleMessageEdit(message); handleClose(); }} className="text-[14px]">
        <div className="flex w-full items-center justify-between">
          Edit Message
          <EditIcon className="text-[16px] mx-2" />
        </div>
      </MenuItem>
    ),
    <MenuItem key="copy" onClick={handleCopy} className="text-[14px]">
      <div className="flex w-full items-center justify-between">
        Copy
        <ContentCopyIcon className="text-[16px] mx-2" />
      </div>
    </MenuItem>,
    <Divider key="divider" sx={{ borderColor: "white" }} variant="middle" />,
    <MenuItem key="delete" onClick={handleDeleteForMe} className="text-[14px] text-red-400">
      <div className="flex w-full items-center justify-between">
        Delete For Me
        <DeleteIcon className="text-[16px] mx-2" />
      </div>
    </MenuItem>,
    isCurrentUser && checkMessageIsInLastHour(message.created_at) && (
      <MenuItem key="unsend" onClick={() => { handleMessageUnsend(message); handleClose(); }} className="text-[14px] text-red-400">
        <div className="flex w-full items-center justify-between">
          Unsend
          <DeleteForeverIcon className="text-[16px] mx-2" />
        </div>
      </MenuItem>
    )
  ].filter(Boolean);

  return (
    <>
      <div className="flex">
        <Tooltip title="Menu">
          <IconButton
            id="long-button"
            aria-controls={open ? 'menu' : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon className="md:text-[20px] text-[18px] text-black dark:text-slate-400" />
          </IconButton>
        </Tooltip>
      </div>

      <Menu
        id="long-menu"
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: isCurrentUser ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isCurrentUser ? "right" : "left",
        }}
        className="rounded-2xl"
        sx={{
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
        }}
      >
        {menuItems}
      </Menu>
    </>
  );
};

export default ThreeDotMenu;
