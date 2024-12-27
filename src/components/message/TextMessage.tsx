import { NextPage } from "next";

interface Props {
  isCurrentUser: boolean;
  message: any;
}

const TextMessage: NextPage<Props> = ({ isCurrentUser, message }) => {
  return (
    <div
      className={`flex flex-wrap ${
        isCurrentUser
          ? "bg-indigo-500 text-white"
          : "bg-white text-gray-700 dark:text-slate-100 dark:bg-slate-700"
      } rounded-xl p-2 gap-3 overflow-visible shadow-sm max-w-full break-words h-full relative`}
    >
      <p className="whitespace-pre-wrap break-words w-full md:max-w-[40rem] max-w-[10rem] md:text-[16px] text-[14px]">
        <span>{message?.message}</span>
      </p>
    </div>
  );
};

export default TextMessage;
