"use client";
import {
  Avatar,
  IconButton,
  InputBase,
  ListItemIcon,
  Paper,
  CircularProgress,
} from "@mui/material";
import { NextPage } from "next";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/features/services/userService";
import { useRouter } from "next/navigation";
import { createNewChat } from "@/features/services/chatService";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { setChats } from "@/features/redux/chat/chatSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
interface Props {
  setOpen: (open: boolean) => void;
}

const AddSingleChat: NextPage<Props> = ({ setOpen }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]) as any;
  const [totalResults, setTotalResults] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const router = useRouter();
  const { chats } = useSelector((state: any) => state.chats);
  const dispatch = useDispatch();
  useEffect(() => {
    getAllUsers({ limit: limit, offset: 0, search: search })
      .then((res: any) => {
        setUsers([...res.data.results]);
        setTotalResults(res.data.count);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }, [limit, search]);

  const handleChatAdd = async (id: any) => {
    createNewChat({ id })
      .then((res: any) => {
        const chat_exists = chats.some((chat: any) => chat.id === res.data?.id);
        if (!chat_exists) {
          dispatch(setChats([res?.data, ...chats]));
        }
        router.push(`/chat/${res?.data.id}`);
        setOpen(false);
      })
      .catch((err: any) => {});
  };
  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    setOffset(0);
  };

  const loadUser = () => {
    getAllUsers({ limit: limit, offset: users.length, search: search })
      .then((res: any) => {
        setUsers((prev: any) => [...prev, ...res.data.results]);
        setTotalResults(res.data.count);
      })
      .catch((err) => {});
  };
  return (
    <>
      <div>
        <div className="rounded-lg  p-5 my-4 h-10 flex items-center w-full">
          <input
            type="text"
            placeholder="Search Users"
            className="w-full px-3 py-2 rounded-lg border-b-2 bg-slate-50 dark:bg-slate-700 outline-none text-[14px] text-black dark:text-slate-100"
            onChange={(e: any) => handleSearchChange(e)}
          />
        </div>
        <div className="h-[45vh] overflow-auto " id="scrollableDiv">
          <InfiniteScroll
            dataLength={users.length}
            next={loadUser}
            hasMore={totalResults > users.length}
            loader={
              <div className="loader" key={0}>
                <CircularProgress />
              </div>
            }
            scrollableTarget="scrollableDiv"
            className="flex flex-col"
          >
            {users.map((user: any, index: number) => {
              return (
                <div key={user?.id}>
                  <div
                    className={`flex items-center pl-10 py-1 cursor-pointer rounded-lg mx-2 my-1 bg-white dark:bg-slate-800 border-b-[1px]`}
                    onClick={() => handleChatAdd(user?.id)}
                  >
                    <ListItemIcon>
                      <Avatar
                        src={user?.profile_picture}
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: getColorForUsername(user?.username),
                        }}
                      >
                        <p className="text-[14px]">
                          {capitalizeFirstLetter(user?.username?.charAt(0))}
                        </p>
                      </Avatar>
                    </ListItemIcon>
                    <div
                      className={`text-[14px] font-Poppins m-1 text-slate-900 dark:text-slate-100`}
                    >
                      {user?.username}
                    </div>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
        <br />
      </div>
    </>
  );
};

export default AddSingleChat;
