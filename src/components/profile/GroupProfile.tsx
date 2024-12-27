import { Avatar, Divider, IconButton, ListItemIcon } from "@mui/material";
import { NextPage } from "next";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  chat: any;
}

const GroupProfile: NextPage<Props> = ({ setOpen, open, chat }) => {
  const current_user = JSON.parse(localStorage.getItem("user_details") || "{}");

  return (
    
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col md:max-h-[500px] h-full md:w-[400px] w-full bg-white dark:bg-slate-800">
          <div className="flex justify-end">
            <IconButton color="error" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex items-center px-5 mt-[-20px] py-3 relative">
            <Avatar sx={{ width: 80, height: 80 }}>
              <GroupsIcon sx={{ width: 60, height: 60 }} />
            </Avatar>
            <div className="w-full flex flex-col">
              <p className="ml-5 text-[25px] text-slate-900 dark:text-slate-100">
                {chat?.group_chat_name}
              </p>
              <div className="flex  bottom-1 right-2  text-[14px] absolute">
                Total Members :&nbsp;
                <span className="text-red-500 dark:text-red-400">
                  {chat?.users?.length}
                </span>
              </div>
            </div>
          </div>
          <div className="mx-10 my-4 flex justify-between text-blue-950 dark:text-blue-400 text-[14px]">
            <p>Members</p>
          </div>
          <div className="flex flex-col h-full overflow-auto w-full px-4 gap-2">
            {chat?.users.map((user: any, index: number) => {
              return (
                  <div
                    className={`flex items-center py-2 px-5 rounded-lg  bg-white dark:bg-slate-700  justify-between `}
                    key={user?.id}
                  >
                    <div className="flex">
                      <Avatar
                        src={user?.profile_picture}
                        sx={{
                          backgroundColor: getColorForUsername(user?.username),
                          width: 26,
                          height: 26,
                          mr: 1,
                        }}
                      >
                        <p className="text-[14px]">
                          {capitalizeFirstLetter(user?.username?.charAt(0))}
                        </p>
                      </Avatar>

                      <div
                        className={`text-[16px] font-Poppins text-slate-900 dark:text-slate-200`}
                      >
                        {current_user?.id == user?.id ? (
                          <p>You</p>
                        ) : (
                          <p>{user?.username}</p>
                        )}
                      </div>
                    </div>
                    <div>
                    {current_user?.id == user?.id ? (
                          <div></div>
                        ) : (
                        <div className={`h-5 w-5 ${user?.online_status?"bg-green-500":"bg-red-500"} rounded-full`}>

                        </div>                        
                        )}
                      </div>
                    </div>
              );
            })}
          </div>
        </div>
      </div>
    
  );
};

export default GroupProfile;
