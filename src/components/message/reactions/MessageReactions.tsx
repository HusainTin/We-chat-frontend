import React from "react";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import ReactionModel from "./ReactionModel";

interface Props {
  message: any;
  isCurrentUser: any;
  handleReactionRemove: (message_id: boolean) => void;
}

const MessageReactions: NextPage<Props> = ({
  message,
  isCurrentUser,
  handleReactionRemove,
}) => {
  const [open, setOpen] = useState(false);
  const visibleReactions = message?.reactions.slice(0, 1);
  const remainingImageCount = message?.reactions.length - 1;
  return (
    <>
      <div
        className={`flex absolute ${
          isCurrentUser
            ? "bottom-[-3px] left-[-8px] justify-end"
            : "bottom-[-3px] right-[-8px]"
        } bg-white rounded-md p-[2px] cursor-pointer`}
        onClick={() => setOpen(true)}
      >
        {visibleReactions.map((reaction: any, index: number) => {
          return (
              <Image
                key={index}
                src={reaction}
                alt="reaction"
                width={10}
                height={10}
              />
          );
        })}
        {remainingImageCount > 0 && (
          <p className="flex text-[10px] text-black items-center justify-center h-[10px] w-[12px] gap-1">
            +{remainingImageCount}
          </p>
        )}
      </div>
      {message?.reactions.length > 0 && (
        <ReactionModel
          open={open}
          setOpen={setOpen}
          message={message}
          handleReactionRemove={handleReactionRemove}
        />
      )}
    </>
  );
};

export default MessageReactions;
