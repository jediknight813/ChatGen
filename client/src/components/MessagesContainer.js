import { useRef, useEffect, useState } from "react";
import { getStreamingMessage } from "../services/threads.service";
import { useAuth0 } from "@auth0/auth0-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessagesContainer = ({
  messages,
  isGenerating,
  threadId,
  setIsGenerating,
}) => {
  const messagesEndRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const [streamingMessage, setStreamingMessage] = useState(undefined);
  const [onLoad, setOnLoad] = useState(true);
  // get the current messages for the thread.
  const getCurrentStreamingMessage = async () => {
    if (threadId !== undefined) {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await getStreamingMessage(accessToken, threadId);
      if (data) {
        setStreamingMessage(data.message);
        return data;
      }
      if (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (threadId !== undefined) {
        try {
          const ifStreaming = await getCurrentStreamingMessage();
          if (ifStreaming["message"] !== null) {
            setIsGenerating(true);
          }
        } catch (error) {
          console.error("Error fetching streaming message:", error);
        }
      }
    };
    fetchData();
  }, [threadId]);

  useEffect(() => {
    if (isGenerating || onLoad) {
      setOnLoad(false);
      const intervalId = setInterval(() => {
        getCurrentStreamingMessage();
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setStreamingMessage(undefined);
    }
  }, [isGenerating, onLoad, threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className=" w-full h-full flex items-start justify-start overflow-y-scroll">
      <div className=" pl-9 p-4 md:p-4 flex flex-col gap-4 w-full whitespace-pre-wrap reactMarkdownClass">
        {messages.map((message, index) => (
          <>
            {message["message"] !== "" && message["message"] !== " " && (
              <div
                key={index}
                className="w-[99%] flex flex-col items-start text-white reactMarkdownClass"
              >
                <h1 className="pl-1 mb-2 font-bold">{message["name"]}</h1>
                <div className="bg-slate-700 p-3 rounded-xl w-full max-w-[90vw]">
                  <ReactMarkdown>{message["message"]}</ReactMarkdown>
                </div>
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
                    {streamingMessage["name"]}
                  </h1>
                  <div className="bg-slate-700 p-3 rounded-xl w-full max-w-[90vw]">
                    <ReactMarkdown>{streamingMessage["message"]}</ReactMarkdown>
                  </div>
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
