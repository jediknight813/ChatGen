import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import {
  getUserChats,
  createUserChat,
  deleteUserChat,
} from "../services/chats.service";
import {
  getUserChatThreads,
  deleteChatThread,
  createUserChatThread,
} from "../services/threads.service";
import ChatSidebar from "../components/ChatSidebar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ChatInput from "../components/chatInput";
import { useCookies } from "react-cookie";

const ChatPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["PromptFormat"]);
  const [chats, setChats] = useState([]);
  const [threads, setThreads] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { chatId, threadId } = useParams();
  const { user } = useAuth0();

  const getChatThreads = async () => {
    if (chatId !== undefined && user !== undefined) {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getUserChatThreads(
        accessToken,
        user._id,
        chatId
      );
      if (data) {
        setThreads(data["message"]);
      }
      if (error) {
        console.log(error);
      }
    }
  };

  const deleteUserChatThread = async (threadIdToDelete) => {
    const accessToken = await getAccessTokenSilently();
    const response = await deleteChatThread(
      accessToken,
      threadIdToDelete,
      threadIdToDelete
    );
    if (response && response.data) {
      const isDeleted = response.data.message;
      if (isDeleted) {
        const updatedThreads = threads.filter(
          (thread) => thread["_id"] !== threadIdToDelete
        );
        setThreads(updatedThreads);
        if (threadIdToDelete === threadId) {
          navigate("/" + chatId);
        }
      }
    }
  };

  const createChatThread = async () => {
    if (chatId !== undefined && user !== undefined) {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await createUserChatThread(
        accessToken,
        user._id,
        chatId
      );
      if (data) {
        const newThread = data.message;
        threads.push(newThread);
        setThreads([...threads]);
      }
      if (error) {
        console.log(error);
      }
    }
  };

  // get chat threads
  useEffect(() => {
    getChatThreads();
  }, [threadId, chatId, getAccessTokenSilently, user]);

  // gets all the user chats
  useEffect(() => {
    let isMounted = true;
    const getChatPresets = async () => {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getUserChats(accessToken);
      if (!isMounted) {
        return;
      }
      if (data) {
        setChats(data["message"]);
      }
      if (error) {
        console.log(error);
      }
    };

    getChatPresets();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  const createChat = async () => {
    const accessToken = await getAccessTokenSilently();
    const response = await createUserChat(accessToken);
    if (response && response.data) {
      const newMessage = response.data.message;
      chats.push(newMessage);
      setChats([...chats]);
      navigate("/" + newMessage["_id"]);
    }
  };

  const deleteChat = async (chatIdToDelete) => {
    const accessToken = await getAccessTokenSilently();
    const response = await deleteUserChat(accessToken, chatIdToDelete);
    if (response && response.data) {
      const isDeleted = response.data.message;
      if (isDeleted) {
        const updatedMessages = chats.filter(
          (message) => message["_id"] !== chatIdToDelete
        );
        setChats(updatedMessages);
        if (chatIdToDelete === chatId) {
          navigate("/");
        }
      }
    }
  };

  const sendMessage = (messageValue, messageType) => {
    console.log(cookies.PromptFormat, messageValue, messageType);
  };

  return (
    <>
      <div className=" flex h-[95vh]">
        <ChatSidebar
          deleteChat={deleteChat}
          createChat={createChat}
          chats={chats}
          createThread={createChatThread}
          threads={threads}
          deleteChatThread={deleteUserChatThread}
        />

        <div className=" flex flex-col w-full justify-between">
          {/* chat messages and send message container */}
          {/* tell user to select chat preset */}
          {chatId === undefined && (
            <div className=" flex justify-center items-center w-full h-full">
              <h1 className=" text-white font-bold text-2xl">
                Select or create a chat preset
              </h1>
            </div>
          )}
          {/* tell user to select a thread */}
          {threadId === undefined && chatId !== undefined && (
            <div className="self-center h-full flex items-center justify-center">
              <h1 className=" text-white font-bold text-2xl">
                Select or create a thread
              </h1>
            </div>
          )}

          {chatId !== undefined && (
            <div className=" flex flex-col w-full">
              <ChatInput sendMessage={sendMessage} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
