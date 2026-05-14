"use client";
import React, { FC } from "react";
import { Avatar, Tooltip } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "next-themes";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import Image from "next/image";

type AppSidebarProps = {
  user: any;
  onProfileClick: (event: React.MouseEvent<HTMLElement>) => void;
};

const AppSidebar: FC<AppSidebarProps> = ({ user, onProfileClick }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="app-sidebar">
      {/* Logo */}
      <div className="app-sidebar-logo">
        <Image src="/logo.png" alt="WeChat" width={36} height={36} />
      </div>

      {/* Navigation icons */}
      <nav className="app-sidebar-nav">
        <Tooltip title="Home" placement="right" arrow>
          <button className="app-sidebar-btn" aria-label="Home">
            <HomeOutlinedIcon sx={{ fontSize: 24 }} />
          </button>
        </Tooltip>

        <Tooltip title="Chats" placement="right" arrow>
          <button className="app-sidebar-btn app-sidebar-btn-active" aria-label="Chats">
            <ChatBubbleOutlineIcon sx={{ fontSize: 24 }} />
          </button>
        </Tooltip>
      </nav>

      {/* Bottom actions */}
      <div className="app-sidebar-bottom">
        <Tooltip title={theme === "dark" ? "Light mode" : "Dark mode"} placement="right" arrow>
          <button className="app-sidebar-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? (
              <DarkModeIcon sx={{ fontSize: 22 }} />
            ) : (
              <LightModeIcon sx={{ fontSize: 22 }} />
            )}
          </button>
        </Tooltip>

        <Tooltip title="Profile" placement="right" arrow>
          <button className="app-sidebar-avatar-btn" onClick={onProfileClick} aria-label="Profile">
            <Avatar
              src={user?.profile_picture}
              sx={{
                backgroundColor: getColorForUsername(user?.username),
                width: 36,
                height: 36,
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {capitalizeFirstLetter(user?.username?.charAt(0))}
            </Avatar>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default AppSidebar;
