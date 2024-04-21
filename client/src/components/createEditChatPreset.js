import { useState, useEffect } from "react";
import { updateUserChat } from "../services/chats.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const CreateEditChatPreset = ({
  form_type,
  preset_data,
  modal_name,
  currentPresetData,
  setCurrentPresetData,
  isOpen,
  setIsOpen,
}) => {
  const updateChatPreset = () => {
    getChatThreads();
  };
  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();
  const getChatThreads = async () => {
    if (currentPresetData !== undefined) {
      const accessToken = await getAccessTokenSilently();
      const { data, error } = await updateUserChat(
        accessToken,
        currentPresetData["chat_id"],
        currentPresetData["system_prompt"],
        currentPresetData["user_name"],
        currentPresetData["bot_name"],
        currentPresetData["name"]
      );
      navigate("/");
    }
  };

  return (
    <div
      className={`w-full h-full fixed top-0 flex justify-center items-center bg-slate-950 bg-opacity-70 text-white ${
        isOpen ? " " : " hidden"
      }`}
    >
      <div className="p-8 rounded-lg w-[95%] md:w-[600px] scrollbar-track-transparent scrollbar md:scrollbar-none bg-black flex max-h-[95%] overflow-y-scroll flex-col gap-4 items-center">
        <h3 className="font-bold text-xl w-full text-center">Edit Preset</h3>

        {/* preset name */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className=" ml-1 font-bold">Chat Preset Name</h1>
          <input
            value={currentPresetData["name"]}
            onChange={(e) =>
              setCurrentPresetData((prevData) => ({
                ...prevData,
                name: e.target.value,
              }))
            }
            placeholder="Programmer"
            className=" input bg-slate-700 w-full text-white"
          />
        </div>

        {/* player name */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className=" ml-1 font-bold">Player Name</h1>
          <input
            value={currentPresetData["user_name"]}
            onChange={(e) =>
              setCurrentPresetData((prevData) => ({
                ...prevData,
                user_name: e.target.value,
              }))
            }
            placeholder="Player name"
            className=" input bg-slate-700 w-full text-white"
          />
        </div>

        {/* bot name */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className=" ml-1 font-bold">Bot Name</h1>
          <input
            value={currentPresetData["bot_name"]}
            onChange={(e) =>
              setCurrentPresetData((prevData) => ({
                ...prevData,
                bot_name: e.target.value,
              }))
            }
            placeholder="Player name"
            className=" input bg-slate-700 w-full text-white"
          />
        </div>

        {/* system prompt */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className=" ml-1 font-bold">System Prompt</h1>
          <textarea
            value={currentPresetData["system_prompt"]}
            onChange={(e) =>
              setCurrentPresetData((prevData) => ({
                ...prevData,
                system_prompt: e.target.value,
              }))
            }
            placeholder="A helpful coding bot."
            className=" textarea bg-slate-700 w-full text-white"
          />
        </div>

        <div className="w-full gap-3 flex flex-col">
          <button
            onClick={() => updateChatPreset()}
            className="btn btn-primary mb-5 mt-2 text-white w-full"
          >
            Update
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-secondary font-bold text-white w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditChatPreset;
