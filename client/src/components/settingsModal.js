import { useEffect, useState } from "react";
import { useCookies, Cookies } from "react-cookie";

const SettingsModal = ({ isOpen, setIsOpen }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["PromptFormat"]);
  const [promptFormat, setPromptFormat] = useState("");
  const PromptFormats = ["Command-R", "Alpaca", "Mixtral"];

  useEffect(() => {
    if (cookies.PromptFormat !== undefined) {
      setPromptFormat(cookies.PromptFormat);
    } else {
      setPromptFormat(PromptFormats[1]);
      setCookie("PromptFormat", PromptFormats[1]);
    }
  }, [cookies.PromptFormat]);

  const updatePromptFormat = (updatedPromptFormat) => {
    setPromptFormat(updatedPromptFormat);
    setCookie("PromptFormat", updatedPromptFormat);
  };

  return (
    <div
      className={`w-full h-full fixed top-0 flex justify-center items-center bg-slate-950 bg-opacity-70 text-white ${
        isOpen ? " " : " hidden"
      }`}
    >
      <div className=" p-8 rounded-lg w-[95%] md:w-[600px] bg-black flex flex-col gap-4 items-center">
        <h3 className="font-bold text-2xl">Settings</h3>

        {/* pick prompt format section. */}
        <div className=" flex flex-col items-start w-full gap-3">
          <h1 className=" self-start font-bold">Prompt Format</h1>
          <div className=" flex gap-4">
            {PromptFormats.map((value, index) => (
              <button
                onClick={() => updatePromptFormat(value)}
                className={`btn text-white ${
                  promptFormat !== value ? " bg-slate-800 " : " bg-primary "
                }`}
                key={index}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* System Prompt */}

        {/* close menu */}
        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-primary mt-5 text-white w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
