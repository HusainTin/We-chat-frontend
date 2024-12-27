import { IconButton } from "@mui/material";
import { NextPage } from "next";
import CloseIcon from "@mui/icons-material/Close";
import FileMessage from "./replying-and-replied-file-message/FileMessage";

interface Props {
  replyingOn: any;
  handleMessageReplyCancel: (e: any) => void;
}

const Replying: NextPage<Props> = ({
  replyingOn,
  handleMessageReplyCancel,
}) => {
  const user = JSON.parse(window.localStorage.getItem("user_details") || "{}");

  const truncateMessage = (message: string) => {
    const isLessThenMediumScreen = window.matchMedia(
      "(min-width: 0px) and (max-width: 768px)"
    );
    const maxLength = isLessThenMediumScreen.matches ? 50 : 200;
    if (message.length <= maxLength) {
      return message;
    }
    return message.slice(0, maxLength) + "...";
  }
  return (
    <>
      <div className="flex justify-between items-center md:ml-[3rem] md:mr-[9rem] mx-1 mb-1 bg-slate-200 dark:bg-slate-700 p-2 rounded-lg">
        <div className="flex flex-col gap-1 sm:max-w-screen-sm md:max-w-screen-md max-w-[15rem]">
          <p className="text-[12px] text-slate-800 dark:text-slate-100">
            Replying to{" "}
            {replyingOn?.sender?.id === user?.id
              ? "yourself"
              : replyingOn?.sender?.username}
          </p>
        {
            replyingOn.type == "text"?
            <>
            <p className=" whitespace-pre-wrap break-words px-2 md:max-w-[50rem] max-w-[30rem] text-[14px] text-slate-800 dark:text-slate-100">
            {replyingOn && truncateMessage(replyingOn?.message)}
          </p>
            </>:<>
            <FileMessage message={replyingOn} type="replying" />
            </>        
        }
          
        </div>
        <div>
          <IconButton
            onClick={handleMessageReplyCancel}
            className="ml-10"
            size="small"
          >
            <CloseIcon className="text-[16px] text-black dark:text-white" />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default Replying;
