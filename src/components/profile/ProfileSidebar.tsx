import { Avatar } from "@mui/material";
import { NextPage } from "next";
import React, { FC, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import KeyIcon from "@mui/icons-material/Key";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { LogoutUser } from "@/utils/Logout";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import SettingsIcon from '@mui/icons-material/Settings';
// import {} from "next/router"

interface Props {
  active: number;
  setActive: (active: number) => void;
}

const ProfileSidebar: NextPage<Props> = ({ active, setActive }) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const [profilePicture, setProfilePicture] = useState("");
  useEffect(() => {
    setProfilePicture(user?.profile_picture);
  }, [user]);
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await LogoutUser(dispatch);
    router.push("/auth");
  };
  return (
    <>
      <div className="rounded-lg">
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-tr-lg rounded-tl-lg  ${
            pathName == "/profile/my-account"
              ? "bg-slate-800 dark:bg-slate-200"
              : "bg-slate-100 dark:bg-slate-700"
          }`}
          onClick={() => router.push("/profile/my-account")}
        >
          <Avatar
            sx={{
              width: "25px",
              height: "25px",
              backgroundColor: getColorForUsername(user?.username),
            }}
            src={profilePicture}
          >
            <p className="text-[20px]">
              {capitalizeFirstLetter(user?.username?.charAt(0))}
            </p>
          </Avatar>
          <h5
            className={`pl-2 font-Poppins ${
              pathName == "/profile/my-account"
                ? "text-white dark:text-slate-800"
                : "text-black dark:text-slate-100"
            }`}
          >
            My Account
          </h5>
        </div>
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer  ${
            pathName == "/profile/change-password"
              ? "bg-slate-800 dark:bg-slate-200"
              : "bg-slate-100 dark:bg-slate-700"
          }`}
          onClick={() => router.push("/profile/change-password")}
        >
          <KeyIcon
            className={`${
              pathName == "/profile/change-password"
                ? "text-white dark:text-slate-800"
                : "text-black dark:text-slate-100"
            }`}
          />
          <h5
            className={`pl-2 font-Poppins ${
              pathName == "/profile/change-password"
                ? "text-white dark:text-slate-800"
                : "text-black dark:text-slate-100"
            }`}
          >
            Change Password
          </h5>
        </div>
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer  ${
            pathName == "/profile/settings"
              ? "bg-slate-800 dark:bg-slate-200"
              : "bg-slate-100 dark:bg-slate-700"
          }`}
          onClick={() => router.push("/profile/settings")}
        >
          <SettingsIcon
            className={`${
              pathName == "/profile/settings"
                ? "text-white dark:text-slate-800"
                : "text-black dark:text-slate-100"
            }`}
          />
          <h5
            className={`pl-2 font-Poppins ${
              pathName == "/profile/settings"
                ? "text-white dark:text-slate-800"
                : "text-black dark:text-slate-100"
            }`}
          >
            Settings
          </h5>
        </div>
        <div
          className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-br-lg rounded-bl-lg bg-white dark:bg-slate-700`}
        >
          <button
            onClick={handleLogout}
            className=" w-full flex pl-2 font-Poppins text-red-600 dark:text-red-400 font-semibold"
          >
            <LogoutIcon className="text-red-600 dark:text-red-400" />
            <p className="mx-3">Log Out</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
