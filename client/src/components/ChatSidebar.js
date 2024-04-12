import { useState } from "react";
import ComfirmModal from "../components/comfirmModal";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import SettingsModal from "./settingsModal";

const ChatSidebar = ({
  createChat,
  chats,
  deleteChat,
  createThread,
  threads,
  deleteChatThread,
  setChatPresetToEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState("");
  const [threadToDeleteId, setThreadToDeleteId] = useState("");
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { chatId, threadId } = useParams();

  const DeleteUserChat = () => {
    deleteChat(chatToDeleteId);
    setIsChatModalOpen(false);
    // setChatToDeleteId("");
  };

  const DeleteUserThread = () => {
    deleteChatThread(threadToDeleteId);
    setIsThreadModalOpen(false);
    // setThreadToDeleteId("");
  };

  const Chat = ({ chat }) => {
    const CheckIfDeleteUserChat = (chatId) => {
      setIsChatModalOpen(true);
      setChatToDeleteId(chatId);
    };

    const editChatPrest = () => {
      var value = chat["preset"];
      value["name"] = chat["name"];
      value["chat_id"] = chat["_id"];
      setChatPresetToEdit(value);
      document.getElementById("editChatPreset").showModal();
    };

    return (
      <div
        className={`w-full items-start flex justify-between rounded-lg hover:bg-slate-800 p-3 ${
          chatId === chat._id ? " bg-slate-700 " : ""
        }`}
      >
        <h1
          onClick={() => navigate("/" + chat._id)}
          className=" self-center text-centers cursor-pointer line-clamp-1"
        >
          {chat.name}
        </h1>
        <div className=" flex gap-2">
          <button
            onClick={() => editChatPrest()}
            className=" btn relative btn-sm btn-primary text-white"
          >
            <i className="fa fa-edit"></i>
          </button>
          <button
            onClick={() => CheckIfDeleteUserChat(chat._id)}
            className=" btn relative btn-sm btn-error text-white"
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      </div>
    );
  };

  const Thread = ({ thread }) => {
    const CheckIfDeleteUserThread = (threadId) => {
      setIsThreadModalOpen(true);
      setThreadToDeleteId(threadId);
    };

    return (
      <div
        className={`w-full items-start flex justify-between rounded-lg hover:bg-slate-800 p-3 ${
          threadId === thread._id ? " bg-slate-700 " : ""
        }`}
      >
        <h1
          onClick={() => navigate("/" + thread.chat_id + "/" + thread._id)}
          className=" self-center text-centers cursor-pointer line-clamp-1"
        >
          {thread.name}
        </h1>
        <button
          onClick={() => CheckIfDeleteUserThread(thread._id)}
          className=" btn relative btn-sm btn-error text-white"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={`flex ease-in-out duration-300  z-5 ${
          isOpen ? " -translate-x-[88%] hidden" : " absolute md:relative"
        }`}
      >
        <div className="w-[300px] h-full bg-black bg-opacity-90 min-h-screen flex items-start justify-start text-white">
          <div className=" pl-6 pt-4 pr-6 flex flex-col items-start h-full gap-4 w-full">
            <div className=" flex w-full items-center justify-between">
              <h1 className="font-bold text-xl">Presets</h1>
              <button
                onClick={() => createChat()}
                className=" btn btn-primary btn-sm text-white hover:btn-primary hover:bg-opacity-80 hover:text-white"
              >
                Create
              </button>
            </div>
            {/* map and show all user chats. */}
            {chats.map((chat, index) => (
              <Chat key={index} chat={chat} index={index} />
            ))}

            {chatId && (
              <>
                {/* threads section */}
                <div className=" flex  w-full items-start justify-between">
                  <h1 className="font-bold text-xl">Threads</h1>
                  <button
                    onClick={() => createThread()}
                    className=" btn btn-primary btn-sm text-white hover:btn-primary hover:bg-opacity-80 hover:text-white"
                  >
                    Create
                  </button>
                </div>
                {/* map and show all user threads. */}
                {threads.map((thread, index) => (
                  <Thread key={index} thread={thread} index={index} />
                ))}
              </>
            )}

            {/* settings modal */}
            {chatId !== undefined && (
              <div
                onClick={() => setIsSettingsMenuOpen(true)}
                className=" flex gap-2 mt-auto pb-3 w-full cursor-pointer"
              >
                <i className="material-icons">settings</i>
                <h1>Advanced Settings</h1>
              </div>
            )}
          </div>
        </div>

        <button
          className="bg-black h-12 mt-12 pl-3 rounded-r-3xl pr-3 text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          >
        </button>
      </div>

      {isOpen && (
        <button
          className="bg-black h-12 mt-12 pl-3 z-0 rounded-r-3xl pr-3 fixed text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          >
        </button>
      )}

      <SettingsModal
        isOpen={isSettingsMenuOpen}
        setIsOpen={setIsSettingsMenuOpen}
      />

      <ComfirmModal
        onConfirm={DeleteUserChat}
        modalId={"deleteChatModal"}
        message={"Are you sure you want to delete this chat?"}
        isOpen={isChatModalOpen}
        setIsOpen={setIsChatModalOpen}
      />

      <ComfirmModal
        onConfirm={DeleteUserThread}
        modalId={"deleteChatModal"}
        message={"Are you sure you want to delete this thread?"}
        isOpen={isThreadModalOpen}
        setIsOpen={setIsThreadModalOpen}
      />
    </>
  );
};

export default ChatSidebar;
