"use client";
import { MFAToggle } from "@/features/services/authService";
import { FormControlLabel, FormGroup, styled, Switch } from "@mui/material";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {}

const Page: NextPage<Props> = ({}) => {
  const { theme, setTheme } = useTheme();
  const user = JSON.parse(
    window.localStorage.getItem("user_details") || "{}"
  );
  const [isMFAEnabled, setIsMFAEnabled] = useState(true);
  useEffect(() => {
    setIsMFAEnabled(user.is_mfa_enabled);
  }, [user]);
  const [nextTheme, setNextTheme] = useState(theme);
  
  const handleToggle = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const data = {
      is_mfa_enabled: event.target.checked,
    }
    try {
      const res = await MFAToggle(data)
      toast.success("MFA status updated successfully")
      localStorage.setItem("user_details", JSON.stringify({...user, is_mfa_enabled:!isMFAEnabled}))
      setIsMFAEnabled(!isMFAEnabled)
    } catch (error:any) {
      console.log(error)
      toast.error("Something went wrong")
    }
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    color: nextTheme == "dark" ? "black" : "white",
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#aab4be",
          ...theme.applyStyles("dark", {
            backgroundColor: "#8796A5",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
      ...theme.applyStyles("dark", {
        backgroundColor: "#003892",
      }),
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#aab4be",
      borderRadius: 20 / 2,
      ...theme.applyStyles("dark", {
        backgroundColor: "#8796A5",
      }),
    },
  }));
  const CustomSwitch = styled(Switch)(({ theme }) => ({
    width: 58,
    height: 32,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        transform: "translateX(22px)",
      },
    },
    "& .MuiSwitch-thumb": {
      width: 28,
      height: 28,
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
      opacity: 1,
    },
  }));

  return (
    <>
      <div className="bg-white dark:bg-slate-800 h-full">
        <div className="flex flex-col md:px-10 px-5 py-5">
          <h1 className="text-[50px] text-black dark:text-white">Settings</h1>
          <div className="flex justify-between mt-2 items-center">
            <p className="text-slate-800 dark:text-slate-200 text-[20px]">
              Theme
            </p>
            <div className="">
              <MaterialUISwitch
                sx={{ m: 1 }}
                onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                checked={theme == "dark"}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2 items-center">
            <p className="text-slate-800 dark:text-slate-200 text-[20px]">
              Enable MFA
            </p>
            <div className="">
              <CustomSwitch
                onChange={handleToggle}
                checked={isMFAEnabled}
                sx={{ m: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
