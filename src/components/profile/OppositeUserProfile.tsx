import { FC } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar, IconButton } from "@mui/material";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
interface Props {
  setOpen: (open: boolean) => void;
  open: boolean;
  user: any;
}

const OppositeUserProfile: FC<Props> = ({ setOpen, open, user }) => {
  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col pb-6 min-w-[350px] bg-white dark:bg-slate-800 mt-[-15rem]">
          <div className="flex justify-end">
            <IconButton color="error" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex mx-4 mt-[-15px]">
          <Avatar
              sx={{
                width: "80px",
                height: "80px",
                backgroundColor: getColorForUsername(user?.username),
                fontSize:"50px"
              }}
              src={user?.profile_picture}
            >
                {capitalizeFirstLetter(user?.username?.charAt(0))}
            </Avatar>
            <div className="w-full ml-2">
              <p className="text-[25px] capitalize text-slate-900 dark:text-slate-100">
              {user?.full_name}
              </p>
              <p  className="text-[14px] text-slate-800 dark:text-slate-300">
              <MailOutlineRoundedIcon className="text-[14px] mr-1"/>
              {user?.email}
              </p>
              <p className="text-[14px] text-blue-800">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OppositeUserProfile;
