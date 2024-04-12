import { useState, useEffect } from "react";
import { updateUserChat } from "../services/chats.service";
import { useAuth0 } from "@auth0/auth0-react";

const CreateEditChatPreset = ({
  form_type,
  preset_data,
  modal_name,
  currentPresetData,
  setCurrentPresetData,
}) => {
  const updateChatPreset = () => {
    getChatThreads();
  };

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
      console.log(data, error);
    }
  };

  return (
    <dialog
      id={modal_name}
      className="modal md:w-auto items-center justify-center h-full w-full flex"
    >
      <div className="modal-box text-white flex flex-col gap-3 max-w-[98vw] self-center">
        <h3 className="font-bold text-xl w-full text-center">Edit Preset</h3>

        {/* preset name */}
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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

        <form method="dialog w-full gap-3 flex flex-col">
          <button
            onClick={() => updateChatPreset()}
            className="btn btn-primary mb-5 mt-2 text-white w-full"
          >
            Update
          </button>
          <button className="btn btn-secondary font-bold text-white w-full">
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default CreateEditChatPreset;
