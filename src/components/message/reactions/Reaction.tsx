import React from "react";
import { NextPage } from "next";
import IconButton from "@mui/material/IconButton";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import { Tooltip } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { reactOnMessage } from "@/features/services/chatService";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

interface Props {
  isCurrentUser: boolean;
  message:any
}

const Reaction: NextPage<Props> = ({ isCurrentUser, message }) => {
  const [open, setOpen] = useState(false);
  const {theme, setTheme}:any= useTheme()
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleEmojiPicker = useCallback((e: any) => {
    e.preventDefault();
    setOpen((prevOpen) => !prevOpen);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  const handleEmojiClick = (emoji:any) => {
    const data = {
      "emoji": emoji?.imageUrl,
      "message_id": message?.id
    }
    try {
      reactOnMessage(data)
    } catch (error:any) {
      toast.error("Can't send a reaction")
    }
    setOpen(false);
    // Add reaction to the message
    //...
  };
  return (
    <>
      <div className="flex relative">
          <div
            className={`absolute z-[100000] bottom-10 ${isCurrentUser?"right-0":"left-0"}`}
            ref={pickerRef}
          >
            <EmojiPicker
              open={open}
              width={300}
              height={350}
              onEmojiClick={handleEmojiClick}
              reactionsDefaultOpen={true}
              previewConfig={{ showPreview: false }}
              autoFocusSearch={false}
              theme={theme}
              searchDisabled={true}
            />
          </div>
        <div className={``}>
          <Tooltip title="Reactions">
            <IconButton
              aria-label="reaction-button"
              onClick={toggleEmojiPicker}
              ref={buttonRef}
            >
              <SentimentSatisfiedIcon className="md:text-[20px] text-[18px] text-black dark:text-slate-400" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default Reaction;
