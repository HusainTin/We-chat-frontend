"use client";
import UserProtected from "@/components/auth/UserProtected";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { IconButton } from "@mui/material";
import { NextPage } from "next";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Heading from "@/utils/Heading";
import { useSelector } from "react-redux";
import { getUserProfile } from "@/features/services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/redux/user/userSlice";
interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = ({ children }) => {
  const [active, setActive] = useState(1);
  const pathName = usePathname();
  const router = useRouter();
  const { paths } = useSelector((state: any) => state.routePaths);
  const dispatch = useDispatch();
  const handleReturnToChat = () => {
    const chatPath = "/chat";
    function getLastChatPath() {
      for (let i = paths.length - 1; i >= 0; i--) {
        if (paths[i].startsWith(chatPath)) {
          return paths[i];
        }
      }
      return "/chat";
    }
    router.push(getLastChatPath());
  };

  useEffect(() => {
    getUserProfile()
      .then((res) => {
        localStorage.setItem("user_details", JSON.stringify(res.data));
        dispatch(setUser(JSON.stringify(res.data)));
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [dispatch]);
  return (
    <>
      <UserProtected>
        <Heading title="Profile" description="This is your profile data" />
        <div className="relative flex flex-col h-[100vh] w-full bg-gradient-to-r  from-blue-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 ">
          <div className="absolute md:top-10 top-5 md:left-10 left-5">
            <button
              className="text-white text-[18px] border border-white rounded-lg  flex px-2 py-1 items-center hover:text-slate-700 hover:bg-white"
              onClick={() => {
                handleReturnToChat();
              }}
            >
              <ArrowBackIcon />
              <p className="px-1">Back</p>
            </button>
          </div>
          <div className="flex flex-row">
            <div
              className={` w-full h-[70vh] px-[60px] justify-center md:w-[400px] ${
                pathName == "/profile"
                  ? "flex flex-col"
                  : "hidden md:flex md:flex-col"
              }`}
            >
              <ProfileSidebar active={active} setActive={setActive} />
            </div>
            <div
              className={`w-full h-[100vh] bg-transparent flex-col md:p-5 px-10 items-center justify-center ${
                pathName == "/profile" ? "hidden" : "flex"
              }`}
            >
              <div className=" h-[80vh] w-full md:mx-10 mx-5 rounded-3xl overflow-auto bg-white dark:bg-slate-800 ">
                <div className="md:hidden flex text-black justify-start w-full">
                  <IconButton
                    aria-label=""
                    onClick={() => router.push("/profile")}
                    className="m-2 text-black dark:text-white"
                    // sx={{ color: "black", m: 2 }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </UserProtected>
    </>
  );
};

export default Layout;
