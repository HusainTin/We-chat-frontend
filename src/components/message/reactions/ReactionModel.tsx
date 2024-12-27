import React from "react";
import { getAllReactions } from "@/features/services/chatService";
import { capitalizeFirstLetter, getColorForUsername } from "@/utils/helper";
import { Avatar, Button, Divider, IconButton, Modal } from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleReactionRemove: (message_id: boolean) => void;
  message: any;
}

const ReactionModel: NextPage<Props> = ({ open, setOpen, message, handleReactionRemove }) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const [reactions, setReactions] = useState([]) as any;
  useEffect(() => {
    if (message?.reactions.length > 0 && open) {
      getAllReactions(message?.id).then((res: any) => {
        setReactions(res.data);
      });
    }
  }, [message, open]);

  const handleRemoveReaction =(reaction:any)=>{
    if(reaction.user_id?.id== user?.id){
      handleReactionRemove(message?.id)
      setOpen(false)
    } 
  }
  return (
    <>
      <Modal open={open}>
        <div className="flex items-center justify-center h-[100vh] ">
          <div className="flex flex-col md:w-[25vw] w-[40vw] gap-1 bg-white dark:bg-slate-600 rounded-xl p-2">
            <div className="flex items-center w-full justify-between">
              <div className="px-2 font-sans">
                <div>
                  <p className="text-black dark:text-white">
                Reactions
                  </p>
                </div>
              </div>
              <div className="">
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon className="text-black dark:text-slate-100"/>
                </IconButton>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col pr-2">
              {reactions.map((reaction: any, index: number) => {
                return (
                  <div className="flex flex-col" key={index}>
                    <div className="flex items-center justify-between cursor-pointer py-2" onClick={()=>handleRemoveReaction(reaction)}>
                      <div className="flex items-center">
                          <Avatar src={reaction?.user_id.profile_picture} sx={{
                            backgroundColor: getColorForUsername(
                              reaction?.user_id?.username
                            ),
                            width: 30,
                            height: 30,
                            mx: 1,
                          }}>{capitalizeFirstLetter(
                            reaction?.user_id?.username?.charAt(0)
                          )}</Avatar>
                       <div>
                        <p className="dark:text-slate-100 text-black">{reaction?.user_id?.username}</p>
                        {
                        reaction?.user_id?.id === user?.id &&
                        <p className="text-[10px] dark:text-red-300 text-red-600">
                          click to remove reaction
                         </p>
                      }
                       </div>

                      </div>
                      <div className="flex items-center">
                        <Image
                          src={reaction?.emoji}
                          alt="user-reaction"
                          width={20}
                          height={20}
                        />
                      </div>
                      </div>
                      
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReactionModel;
