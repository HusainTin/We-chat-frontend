"use client";
import { useRouter, useParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import { getAllMessages, getChatById } from "@/features/services/chatService";
import Message from "@/components/message/Message";
import GroupsIcon from "@mui/icons-material/Groups";
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiPicker from "emoji-picker-react";
import { setChats } from "@/features/redux/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import ProfileContent from "@/components/profile/ProfileContent";
import NotFound from "./not-found";
import { getColorForUsername, capitalizeFirstLetter } from "@/utils/helper";
import CloseIcon from "@mui/icons-material/Close";
import { setMessages } from "@/features/redux/message/messagesSlice";
import { useTheme } from "next-themes";
import React from "react";
import UploadFileMenu from "@/components/chat/UploadFileMenu";
import ReplyMessage from "@/components/message/ReplyMessage";
import Replying from "@/components/message/Replying";

interface Props {}

const Page: FC<Props> = ({}) => {
  const user = JSON.parse(window.localStorage.getItem("user_details") || "{}");
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [chat, setChat] = useState() as any;
  // const [messages, setMessages] = useState([]) as any;
  const { messages }: any = useSelector((state: any) => state.messages);
  const [textMessage, setTextMessage] = useState("") as any;
  const [oppositeUser, setOppositeUser] = useState() as any;
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const limit = 50;
  const [totalResults, setTotalResults] = useState(0) as any;
  const [offset, setOffset] = useState(0) as any;
  const [oppositeUserStatus, setOppositeUserStatus] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState() as any;
  const [showSeen, setShowSeen] = useState() as any;
  const dispatch = useDispatch() as any;
  const { chats } = useSelector((state: any) => state.chats);
  const [showProfile, setShowProfile] = useState(false) as any;
  const [notFound, setNotFound] = useState(false) as any;
  const [editing, setEditing] = useState(false) as any;
  const [editingMessage, setEditingMessage] = useState(false) as any;
  const [replying, setReplying] = useState(false) as any;
  const [replyingOn, setReplyingOn] = useState() as any;
  const { theme, setTheme }: any = useTheme();
  const inputRef = useRef() as any;
  const [showUplaodFileMenu, setShowUplaodFileMenu] = useState(false);

  // For connecting with chat socket
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket(
        "ws://127.0.0.1:8000/ws/chat/" +
          id +
          "/?token=" +
          localStorage.getItem("access_token")
      );

      socketRef.current = socket;

      socket.onopen = (e) => {
        console.log("Chat socket connection established");
        setConnected(true);
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
        setTimeout(() => {
          console.log("Reconnecting chat socket...");
          connectWebSocket();
        }, 5000);
        // Handle WebSocket error
      };

      socket.onclose = (e) => {
        console.log("Chat socket connection closed", e.reason);
        setConnected(false);
      };
    };

    connectWebSocket();

    // Cleanup function to close the socket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [id]);

  // On message socket handler
  useEffect(() => {
    const socket = socketRef.current as any;

    const handleMessage = (message: any) => {
      const data = JSON.parse(message?.data);
      if (String(data.type) === "chat_message") {
        dispatch(setMessages([data?.message, ...messages]));
        const last_message = data?.message;
        dispatch(
          setChats(
            chats.map((chat: any) =>
              chat.id === last_message.chat_id
                ? { ...chat, last_message }
                : chat
            )
          )
        );
      } else if (String(data.type) === "status") {
        const online_status = data?.online_status;
        setOppositeUserStatus(online_status);
        setOppositeUser((prevOppositeUser: any) => ({
          ...prevOppositeUser,
          online_status: online_status,
        }));
      } else if (String(data.type) === "typing") {
        if (user?.id !== String(data.user_id)) {
          setTyping(true);
          setTimeout(() => setTyping(false), 3000);
        }
      } else if (String(data.type) === "chat_visit") {
        setChat((chat: any) => {
          chat?.users.forEach((user: any) => {
            if (user.id === data.user_id) {
              user.visit.on_chat = data.on_chat;
              user.visit.last_visited = data.last_visited;
            }
          });
          return chat;
        });
      } else if (String(data.type) === "unsend_message") {
        const id = data?.id;
        dispatch(
          setMessages(messages.filter((message: any) => message.id !== id))
        );
      } else if (String(data.type) === "chat_message_updated") {
        const newMessage = data?.message;
        dispatch(
          setMessages(
            messages.map((message: any) =>
              message.id === newMessage.id ? newMessage : message
            )
          )
        );
      } else if (String(data.type) === "notify_reaction") {
        dispatch(
          setMessages(
            messages.map((message: any) =>
              message.id === data.message_id
                ? { ...message, reactions: data.reactions }
                : message
            )
          )
        );
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null;
    };
  });

  // For getting chat Info
  useEffect(() => {
    getChatById(id)
      .then((res: any) => {
        setChat(res.data);
      })
      .catch((err: any) => {
        setNotFound(true);
      });
  }, [id, router]);

  // For setting opposite user info
  useEffect(() => {
    const oppositeUser = chat?.users?.filter(
      (chatUser: any) => user?.id !== chatUser?.id
    )[0];
    setOppositeUserStatus(oppositeUser?.online_status);
    setOppositeUser(oppositeUser);
  }, [chat, user]);

  // For getting chat messages initially
  useEffect(() => {
    getAllMessages({ id: id, limit: 50, offset: 0 })
      .then((res: any) => {
        setTotalResults(res?.data?.count);
        dispatch(setMessages(res?.data?.results));
        setOffset(50);
      })
      .catch((err: any) => {
        if (err.response.status == 404) {
          setNotFound(true);
        }
      });
  }, [id, dispatch]);

  // For submitting message
  const handleMessageSubmit = (e: any) => {
    e.preventDefault();
    if (textMessage && connected && !editing && !replying) {
      const messageObject = {
        type: "message",
        message: textMessage,
      };
      socketRef.current?.send(JSON.stringify(messageObject));
      setTextMessage("");
    } else if (textMessage && connected && editing) {
      const messageObject = {
        type: "message_updated",
        message: textMessage,
        id: editingMessage?.id,
      };
      socketRef.current?.send(JSON.stringify(messageObject));
      setEditing(false);
      setEditingMessage(null);
      setTextMessage("");
    } else if (textMessage && connected && replying) {
      const messageObject = {
        type: "message",
        message: textMessage,
        replied_to: replyingOn?.id,
      };
      socketRef.current?.send(JSON.stringify(messageObject));
      setTextMessage("");
      setReplying(false);
      setReplyingOn(null);
    }
  };

  // Condition for disabling send button
  const disabled = !textMessage || !connected ? true : false;

  // Sending message on enter click
  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      if (!event.shiftKey) {
        event.preventDefault();
        handleMessageSubmit(event);
      }
    }
  }

  // Laoding more message when scrolling
  const loadMessage = () => {
    // setTimeout(()=>{
    getAllMessages({ id: id, limit: limit, offset: offset }).then(
      (res: any) => {
        setOffset(limit + offset);
        dispatch(setMessages([...messages, ...res?.data?.results]));
      }
    );
    // },500)
  };

  const handleMessageChange = (e: any) => {
    setTextMessage(e.target.value);
    const typingObject = {
      type: "typing",
    };
    socketRef.current?.send(JSON.stringify(typingObject));
  };

  const pickEmoji = (emoji: any) => {
    setTextMessage((prevTextMessage: string) => {
      const ref = inputRef.current;
      ref.focus();
      const start = prevTextMessage.substring(0, ref.selectionStart);
      const end = prevTextMessage.substring(ref.selectionStart);
      const text = start + emoji.emoji + end;
      inputRef.current.selectionEnd = start.length + emoji.emoji.length;
      setCursorPosition(start.length + emoji.emoji.length);
      return text;
    });
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const toggleEmojiPicker = (e: any) => {
    e.preventDefault();
    setShowPicker(!showPicker);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[0];
      const lastMessageDate = new Date(lastMessage?.created_at);
      const lastVisitedDate = new Date(oppositeUser?.visit?.last_visited);

      const showSeen =
        lastMessage?.sender?.id == user?.id &&
        (oppositeUser?.visit?.on_chat || lastVisitedDate > lastMessageDate);
      setShowSeen(showSeen);
    }
  }, [messages, oppositeUser, user]);

  if (notFound) {
    return <NotFound />;
  }

  const handleMessageUnsend = (message: any) => {
    if (message && connected) {
      const messageObject = {
        type: "unsend_message",
        id: message?.id,
      };
      socketRef.current?.send(JSON.stringify(messageObject));
    }
  };

  const handleMessageEdit = (message: any) => {
    if (message && connected) {
      setReplying(false);
      setReplyingOn(null);
      setEditing(true);
      setEditingMessage(message);
      setTextMessage(message?.message);
    }
  };

  const handleMessageEditCancel = () => {
    setEditing(false);
    setEditingMessage(null);
    setTextMessage("");
  };

  const handleMessageReply = (message: any) => {
    setEditing(false);
    setEditingMessage(null);
    setReplying(true);
    setReplyingOn(message);
  };

  const handleMessageReplyCancel = (e: any) => {
    setReplying(false);
    setReplyingOn(null);
  };


  const handleReactionRemove = (message_id: string) => {
    if (message_id && connected) {
      const messageObject = {
        type: "remove_reaction",
        message_id: message_id,
      };
      socketRef.current?.send(JSON.stringify(messageObject));
    }
  };
  return (
    <div className="w-full flex h-full  rounded-r-xxl overflow-hidden">
      <div className="flex-1 flex flex-col ">
        <header className="flex md:p-3 p-1 w-full text-blue-900 dark:text-white bg-white dark:bg-slate-800 dark:border-b-[1px] cursor-pointer">
          <div className="md:hidden flex">
            <IconButton aria-label="" onClick={() => router.push("/chat")}>
              <ArrowBackIcon />
            </IconButton>
          </div>
          {chat?.is_group_chat ? (
            <div
              className="flex md:items-start items-center"
              onClick={() => setShowProfile(true)}
            >
              <Avatar sx={{ width: 32, height: 32, mx: 1 }}>
                <GroupsIcon />
              </Avatar>
              <h1 className="md:text-2xl text-xl font-semibold capitalize">
                {chat?.group_chat_name}
              </h1>
            </div>
          ) : (
            <div
              className="flex justify-between w-full items-center"
              onClick={() => setShowProfile(true)}
            >
              <div className="flex">
                <Avatar
                  src={oppositeUser?.profile_picture}
                  sx={{
                    backgroundColor: getColorForUsername(
                      oppositeUser?.username
                    ),
                    width: 30,
                    height: 30,
                    mx: 1.5,
                  }}
                >
                  {capitalizeFirstLetter(oppositeUser?.username?.charAt(0))}
                </Avatar>

                <h1 className="md:text-2xl text-xl font-semibold">
                  {oppositeUser?.username}
                </h1>
              </div>
              {
                <div
                  className={`md:mx-12 mx-5 px-3 h-6 w-4 rounded-full ${
                    oppositeUserStatus ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
              }
            </div>
          )}
        </header>

        {/* Messages section */}
        <div
          className=" overflow-auto px-4 flex flex-col-reverse scroll-smooth  h-[75vh] bg-slate-50 dark:bg-slate-800"
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={messages.length}
            hasMore={totalResults > messages.length}
            next={loadMessage}
            loader={
              <div
                className="flex max-h-[100px] overflow-hidden w-full items-center justify-center"
                key={0}
              >
                <CircularProgress />
              </div>
            }
            className="flex flex-col-reverse overflow-y-visible flex-grow"
            // className="flex-grow overflow-y-auto px-4 flex flex-col-reverse scroll-smooth"
            scrollableTarget="scrollableDiv"
            inverse={true}
          >
            {
              <div className="flex justify-between">
                <div className="text-gray-500 text-[12px] ">
                  {typing && "Typing..."}
                </div>
                <div className="text-gray-500 text-[12px] ">
                  {showSeen && "seen"}
                </div>
              </div>
            }
            {messages.map((message: any, index: number) => {
              return (
                <div key={message?.id}>
                  <Message
                    handleMessageUnsend={handleMessageUnsend}
                    message={message}
                    index={index}
                    handleMessageEdit={handleMessageEdit}
                    handleMessageReply={handleMessageReply}
                    handleReactionRemove={handleReactionRemove}
                  />
                  {/* {chat?.} */}
                </div>
              );
            })}
            {/* {typing&& */}

            {/* } */}
          </InfiniteScroll>
        </div>

        {/* Input section */}
        <footer className="relative bg-white dark:bg-slate-800 p-[13px] w-full  flex-shrink">
          {" "}
          {/* Added flex-shrink */}
          <form onSubmit={handleMessageSubmit}>
            {editing && (
              <div className="flex justify-between items-center md:ml-[5rem] md:mr-[6rem] mx-1 mb-1  ">
                <div className="text-[12px] ">Editing message</div>
                <IconButton
                  onClick={handleMessageEditCancel}
                  className="ml-10"
                  size="small"
                >
                  <CloseIcon className="text-[16px] text-black dark:text-white" />
                </IconButton>
              </div>
            )}
            {replying && (
              <>
                <Replying replyingOn={replyingOn} handleMessageReplyCancel={handleMessageReplyCancel} />
              </>
            )}
            <div className="relative flex items-center">
              <div className=" flex items-center justify-center h-full w-12">
                <button
                  className=" text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={toggleEmojiPicker}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                className={`text-[14px] absolute bottom-[3rem] left-0 z-10 emoji-picker`}
              >
                <EmojiPicker
                  open={showPicker}
                  width={300}
                  height={350}
                  theme={theme}
                  onEmojiClick={pickEmoji}
                  previewConfig={{ showPreview: false }}
                  autoFocusSearch={false}
                  // lazyLoadEmojis={true}
                  searchDisabled={true}
                />
              </div>
              <div className="relative flex-grow flex ">
                {" "}
                {/* Wrap TextField in another flex column */}
                <div className="w-full">
                  <TextField
                    placeholder="Message..."
                    inputRef={inputRef}
                    onChange={handleMessageChange}
                    value={textMessage}
                    id="outlined-multiline-flexible"
                    multiline
                    fullWidth
                    maxRows={3}
                    size="small"
                    onKeyDown={(event) => handleKeyDown(event)}
                    autoFocus
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: theme === "dark" ? "white" : "default", // Default border color
                        },
                        "&:hover fieldset": {
                          borderColor: theme === "dark" ? "white" : "default", // Border color on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: theme === "dark" ? "white" : "default", // Border color when focused
                        },
                      },
                      "& .MuiInputBase-input": {
                        pr: 2,
                        color: theme == "dark" ? "white" : "black",
                      },
                    }}
                  />
                </div>
              </div>

              {!textMessage && (
                <div className="relative">
                  <UploadFileMenu showUplaodFileMenu={showUplaodFileMenu} setShowUplaodFileMenu={setShowUplaodFileMenu} theme={theme} />
                  <button
                    className="flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mx-2"
                    onClick={() => setShowUplaodFileMenu(true)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </button>
                  
                </div>
              )}
              <button
                className={`flex items-center justify-center md:rounded-xl rounded-full  text-white md:px-4 px-0 md:py-1 py-0 flex-shrink-0 ml-2 ${
                  disabled
                    ? "bg-slate-500 hover:bg-slate-500"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
                disabled={disabled}
                onClick={handleMessageSubmit}
              >
                <span className="hidden md:flex">Send</span>
                <div className="md:ml-2 ml-0 flex justify-center items-center p-2 md:p-1">
                  <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </form>
        </footer>
      </div>

      <Modal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        aria-labelledby="profile-content"
        aria-describedby="profile-content-modal"
      >
        <ProfileContent
          chat={chat}
          oppositeUser={oppositeUser}
          setOpen={setShowProfile}
          open={showProfile}
        />
      </Modal>
    </div>
  );
};

export default Page;
