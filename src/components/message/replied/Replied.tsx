import { NextPage } from "next";
import FileMessage from "../replying-and-replied-file-message/FileMessage";

interface Props {
  message: any;
  isCurrentUser: any;
}

const Replied: NextPage<Props> = ({ message, isCurrentUser }) => {
  const user = JSON.parse(localStorage.getItem("user_details") || "{}");
  const repliedTo = message.replied_to;
  return (
    <div className={`flex w-full ${isCurrentUser ? "justify-end" : ""}`}>
      <div className="flex flex-col text-[12px] dark:text-slate-300 text-slate-700">
        <div className={`flex w-full ${isCurrentUser ? "justify-end" : ""}`}>
          <span>
            {message?.sender?.id == user?.id
              ? "You"
              : message?.sender?.username}
          </span>
          <span>&nbsp;replied to&nbsp;</span>
          <span>
            {repliedTo?.sender?.id == user?.id
              ? message?.sender?.id == user?.id
                ? "yourself"
                : "you"
              : message?.sender?.id === repliedTo?.sender?.id
              ? "himself"
              : repliedTo?.sender?.username}
          </span>
        </div>

        <div
          className={`flex w-full ${isCurrentUser ? "justify-end" : ""} my-1`}
        >
          {repliedTo?.type == "text" ? (
            <p
              className={`p-2 rounded-2xl ${
                repliedTo?.sender?.id == user?.id
                  ? "bg-indigo-400"
                  : "bg-slate-300 dark:bg-slate-500"
              }`}
            >
              {repliedTo?.message}
            </p>
          ) : (
            <FileMessage message={repliedTo} type="replied_to" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Replied;
