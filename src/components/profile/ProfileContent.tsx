"use client"
import { Box } from "@mui/material";
import GroupProfile from "./GroupProfile";
import OppositeUserProfile from "./OppositeUserProfile";

 const ProfileContent = ({ chat, oppositeUser, setOpen, open }:any, ref:any) => {
    return (
      <Box height="100%">
      <>
        {chat?.is_group_chat ? (
          <GroupProfile setOpen={setOpen} open={open} chat={chat} />
        ) : (
          <OppositeUserProfile setOpen={setOpen} open={open} user={oppositeUser} />
        )}
      </>
    </Box>
    );
  };

export default ProfileContent;