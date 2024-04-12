import { useState } from "react";

const ChatInput = ({ sendMessage }) => {
  const [messageValue, setMessageValue] = useState("");
  const [messageType, setMessageType] = useState("User");
  const sendUserMessage = () => {
    sendMessage(messageValue, messageType);
    setMessageValue("");
  };

  return (
    <div className=" w-full">
      <div className=" flex gap-2 p-4 w-full">
        <div className=" flex w-full">
          <select
            value={"user"}
            onChange={(e) => setMessageType(e.target.value)}
            className="select rounded-r-none w-[100px] outline-none border-none max-w-xs bg-slate-700 mr-0 pr-0"
          >
            <option value={"user"} defaultValue={"user"}>
              User
            </option>
            <option value={"system"}>System</option>
            <option value={"bot"}>Bot</option>
            <option value={"world"}>World</option>
          </select>
          <input
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="pl-0 mr-0 input rounded-l-none bg-slate-700 text-white w-full"
            placeholder="Message ChatGen"
          />
        </div>
        <button
          onClick={() => sendUserMessage(messageValue)}
          className=" btn btn-primary text-white font-bold text-xl"
        >
          <i class="fa fa-arrow-up"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
