import { NextPage } from "next";
import {
  Avatar,
  IconButton,
  InputBase,
  ListItemIcon,
  Paper,
  CircularProgress,
  Chip,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useCallback } from "react";
import { getAllUsers } from "@/features/services/userService";
import toast from "react-hot-toast";
import CheckIcon from "@mui/icons-material/Check";
import { createGroupChat } from "@/features/services/chatService";
import InfiniteScroll from "react-infinite-scroll-component";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import { useDispatch } from "react-redux";
import { setChats } from "@/features/redux/chat/chatSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
interface Props {
  setOpen: (open: boolean) => void;
}

const AddGroupChat: NextPage<Props> = ({ setOpen }) => {
  const [search, setSearch] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [users, setUsers] = useState([]) as any;
  const [limit, setLimit] = useState(50);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]) as any;
  const dispatch = useDispatch()
  const router = useRouter()
  const { chats } = useSelector((state: any) => state.chats);
  useEffect(() => {
    getAllUsers({ limit:limit, offset:0, search:search })
      .then((res:any) => {
          setUsers([...res.data.results]);
          setTotalResults(res.data.count)
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }, [limit, search]);

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
  };
  
  const toggleSeletedUser =(user:any)=>{
    const userIndex = selectedUsers.findIndex((existingUser:any) => existingUser.id === user.id);

    if (userIndex !== -1) {
      // User exists in the array, so remove it
      setSelectedUsers(selectedUsers.filter((existingUser:any) => existingUser.id !== user.id));
    } else {
      // User doesn't exist, so add it
      setSelectedUsers([...selectedUsers, user]);
    }
  }

  const handleSubmit = async()=>{
    if(selectedUsers.length < 2){
      toast.error("Please select at least 2 users to create a group chat");
      return;
    }
    try {
      const response = await createGroupChat({
        group_chat_name: groupChatName,
        users: selectedUsers.map((user: any) => user.id),
      });
      dispatch(setChats([response.data?.data, ...chats]));
      router.push(`/chat/${response.data?.data?.id}`);
      toast.success("Group chat created successfully");

      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const loadUser = ()=>{
    getAllUsers({ limit:limit, offset:users.length, search:search })
      .then((res:any) => {
          setUsers((prev:any)=>[...prev, ...res.data.results]);
          setTotalResults(res.data.count)
      })
      .catch((err) => {
        toast.error("Something went wrong")
      });
  }

  const disableCreate = selectedUsers.length <=1 || groupChatName.length<=0
  return (
    <div>
      <div className="flex h-70 px-5 items-center pt-3">
        <label
          htmlFor="group_chat_name"
          className="text-sm font-medium text-gray-700 mr-4 dark:text-gray-300"
        >
          Name Your Group
        </label>
        <input
          id="group_chat_name"
          name="group_chat_name"
          type="text"
          onChange={(e) => setGroupChatName(e.target.value)}
          value={groupChatName}
          autoComplete="group_chat_name"
          placeholder="Your group name"
          className=" px-3 py-2 rounded-lg border bg-slate-100 dark:bg-slate-700 text-black dark:text-slate-200"
        />
      </div>
      <div className="mx-5 my-3">
        <p className="text-[12px] text-blue-700 dark:text-blue-300">Select users to include in your group <span className=" text-red-700 dark:text-red-400">(minimum 2)</span></p>
      </div>
      <div className="rounded-lg shadow-none border-none p-2 my-2 h-10 flex items-center w-full">
        <input type="text" placeholder="Search Users" className="w-full px-3 py-2 rounded-lg border-b-2 bg-slate-50 dark:bg-slate-700 outline-none text-[14px] text-black dark:text-slate-100"  onChange={(e: any) => handleSearchChange(e)} />
      </div>

      <div className="px-10 my-1">
        <p className="text-[14px] text-slate-800 dark:text-slate-200">
        Selected <span className="text-blue-600 dark:text-blue-300 ">{selectedUsers.length}</span>
        </p>
      </div>
      <div className="h-[35vh] overflow-auto">
        <InfiniteScroll
        dataLength={users.length}
          next={loadUser}
          hasMore={totalResults>users.length}
          scrollableTarget="scrollableDiv"
          className="flex flex-col"
          loader={
            <div className="loader" key={0}>
              <CircularProgress />
            </div>
          }
        >
          {users.map((user: any, index: number) => {
            const isSelected = selectedUsers.some((selectedUser:any) => selectedUser.id === user.id);
            return (
              <div key={user?.id}>
                <div
                  className={`flex items-center justify-between pl-10 py-2 cursor-pointer rounded-lg mx-2 my-1 border-b-[1px] h-[40px] ${isSelected?"bg-blue-100 dark:bg-slate-600":"bg-white dark:bg-slate-800"}`}
                  onClick={()=>toggleSeletedUser(user)}
                >
                  <div className="flex ">
                  <ListItemIcon>
                  <Avatar src={user?.profile_picture} sx={{ width: 24, height: 24, backgroundColor: getColorForUsername(user?.username),}} >
                  <p className='text-[14px]'>{capitalizeFirstLetter(user?.username?.charAt(0))}</p>
                  </Avatar>
                  </ListItemIcon>
                  <div
                    className={`text-[14px] font-Poppins m-1 text-slate-900 dark:text-slate-200 `}
                    >
                    {user?.username}
                  </div>
                  </div>
                  {isSelected && ( // Conditionally render the check icon
                  <div className=""> {/* Use float-right */}
                  <IconButton color="primary">
                    <CheckIcon />
                  </IconButton>
                </div>
                )}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
        <div className="flex items-center justify-center mb-3 ">
        <button
          className={`border ${disableCreate ?"border-slate-800 text-slate-800 dark:border-slate-400 dark:text-slate-400":"text-blue-600 dark:text-white hover:text-white dark:hover:text-slate-800  border-blue-600 dark:border-white hover:bg-blue-600 dark:hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-blue-300"} font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3`}
          onClick={handleSubmit}
          disabled={disableCreate}
        >
          Create
        </button>
        </div>
    </div>
  );
};

export default AddGroupChat;
