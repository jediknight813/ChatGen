import { useRef, useEffect, useState } from "react";
import { getStreamingMessage } from "../services/threads.service";
import { useAuth0 } from "@auth0/auth0-react";

const MessagesContainer = ({ messages, isGenerating, threadId }) => {
  const messagesEndRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const [streamingMessage, setStreamingMessage] = useState(undefined);

  // get the current messages for the thread.
  const getCurrentStreamingMessage = async () => {
    if (threadId !== undefined) {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getStreamingMessage(accessToken, threadId);
      if (data) {
        setStreamingMessage(data.message);
      }
      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (isGenerating) {
      const intervalId = setInterval(() => {
        getCurrentStreamingMessage();
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setStreamingMessage(undefined);
    }
  }, [isGenerating]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className=" w-full h-full flex items-start justify-start overflow-y-scroll">
      <div className=" p-4 flex flex-col gap-4 w-full">
        {messages.map((message, index) => (
          <>
            {message["message"] !== "" && message["message"] !== " " && (
              <div
                key={index}
                className="w-[99%] flex flex-col items-start text-white"
              >
                <h1 className="pl-1 mb-2 font-bold">{message["type"]}</h1>
                <h2 className=" bg-slate-700 p-3 rounded-xl w-full">
                  {message["message"]}
                </h2>
              </div>
            )}
          </>
        ))}
        {/* streaming message */}
        {streamingMessage !== undefined && streamingMessage !== null && (
          <>
            {streamingMessage["message"] !== "" &&
              streamingMessage["message"] !== " " && (
                <div className="w-[99%] flex flex-col items-start text-white">
                  <h1 className="pl-1 mb-2 font-bold">
                    {streamingMessage["type"]}
                  </h1>
                  <h2 className=" bg-slate-700 p-3 rounded-xl w-full">
                    {streamingMessage["message"]}
                  </h2>
                </div>
              )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesContainer;
