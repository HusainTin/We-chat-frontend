"use client"
import { CircularProgress, Skeleton } from "@mui/material";
import { NextPage } from "next";
import { useTheme } from "next-themes";

interface Props {}

const Loading: NextPage<Props> = ({}) => {
  const {theme} = useTheme()
  return (
    <>
      <div className="w-full flex h-full bg-slate-50 dark:bg-slate-800 rounded-r-xl sx:rounded-xl overflow-hidden items-center justify-center dark:text-white ">
      <CircularProgress color={theme =="dark"?"inherit":"primary"} />
      </div>
    </>
  );
};

export default Loading;
