import { useEffect, useState } from "react";
import { useCookies, Cookies } from "react-cookie";
import {
  getModels,
  loadModel,
  downloadModel,
  unloadModel,
} from "../services/text-generation.service";
import { useAuth0 } from "@auth0/auth0-react";

const SettingsModal = ({ isOpen, setIsOpen }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["PromptFormat"]);
  const [promptFormat, setPromptFormat] = useState("");
  const PromptFormats = ["Command-R", "Alpaca", "Mixtral", "Vicuna", "Llama-3"];
  const { getAccessTokenSilently } = useAuth0();
  const [textModels, setTextModels] = useState([]);
  const [modelPicked, updateModelPicked] = useState("");
  const [modelContext, setModelContext] = useState(4096);
  const [modelGpuLayers, setModelGpuLayers] = useState(0);

  const [modelAuthor, setAuthorModel] = useState("");
  const [modelRepo, setModelRepo] = useState("");
  const [modelName, setModelName] = useState("");

  const handleGetModels = async () => {
    const accessToken = await getAccessTokenSilently();
    const { data, error } = await getModels(accessToken);
    if (data) {
      const models = data;
      setTextModels(models);
    }
    if (error) {
      console.log(error);
    }
  };

  const handleDownloadModel = async () => {
    const accessToken = await getAccessTokenSilently();
    if (modelAuthor !== "" && modelAuthor !== "" && modelName !== "") {
      const { data, error } = await downloadModel(
        accessToken,
        modelAuthor,
        modelRepo,
        modelName
      );
      if (error) {
        console.log(error);
      }
    }
  };

  const handleUnloadModel = async () => {
    const accessToken = await getAccessTokenSilently();
    const { data, error } = await unloadModel(accessToken);
    if (error) {
      console.log(error);
    }
  };

  const handleLoadModel = async () => {
    const accessToken = await getAccessTokenSilently();
    const { data, error } = await loadModel(
      accessToken,
      modelPicked,
      modelGpuLayers,
      modelContext
    );
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cookies.PromptFormat !== undefined) {
      setPromptFormat(cookies.PromptFormat);
    } else {
      setPromptFormat(PromptFormats[1]);
      setCookie("PromptFormat", PromptFormats[1]);
    }
    handleGetModels();
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
      <div className=" p-8 rounded-lg w-[95%] md:w-[600px] scrollbar-track-transparent scrollbar md:scrollbar-none bg-black flex max-h-[95%] overflow-y-scroll flex-col gap-4 items-center">
        <h3 className="font-bold text-2xl">Settings</h3>

        {/* pick prompt format section. */}
        <div className=" flex flex-col items-start w-full gap-3">
          <h1 className=" self-start font-bold">Prompt Format</h1>
          <div className=" flex gap-4 flex-wrap">
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

        {/* admin section */}

        {textModels.length !== 0 && (
          <>
            <div className="flex flex-col items-start w-full gap-3">
              <h1 className="self-center text-2xl font-bold mt-4">
                Load Model
              </h1>
              <h1 className="self-start font-bold">Models</h1>
              <select
                className="select w-full"
                onChange={(e) => updateModelPicked(e.target.value)}
                value={modelPicked}
              >
                {textModels.map((value, index) => (
                  <option
                    key={index}
                    value={value}
                    className={`select-option ${
                      modelPicked !== value ? "text-slate-800" : "text-primary"
                    }`}
                  >
                    {value}
                  </option>
                ))}
              </select>
              <h1 className="self-start font-bold">Model Context Window</h1>
              <input
                value={modelContext}
                onChange={(e) => setModelContext(e.target.value)}
                type="number"
                placeholder="4096"
                className="input w-full"
              />
              <h1 className="self-start font-bold">Model Gpu Layers</h1>
              <input
                value={modelGpuLayers}
                onChange={(e) => setModelGpuLayers(e.target.value)}
                type="number"
                placeholder="4096"
                className="input w-full"
              />

              <button
                onClick={() => {
                  handleLoadModel(false);
                  setIsOpen(false);
                }}
                className="btn btn-primary mt-5 text-white w-full"
              >
                Load Model
              </button>
              <button
                className=" btn w-full btn-error text-white"
                onClick={() => handleUnloadModel()}
              >
                Unload Model
              </button>
            </div>

            <div className="flex flex-col items-start w-full gap-3">
              <h1 className="self-center text-2xl font-bold mt-4">
                Download Model
              </h1>
              <h1 className="self-start font-bold">Model Author Name</h1>
              <input
                value={modelAuthor}
                onChange={(e) => setAuthorModel(e.target.value)}
                type="text"
                placeholder=""
                className="input w-full"
              />
              <h1 className="self-start font-bold">Model Repo Name</h1>
              <input
                value={modelRepo}
                onChange={(e) => setModelRepo(e.target.value)}
                type="text"
                placeholder=""
                className="input w-full"
              />
              <h1 className="self-start font-bold">Model Name</h1>
              <input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                type="text"
                placeholder=""
                className="input w-full"
              />

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleDownloadModel();
                }}
                className="btn btn-primary mt-5 text-white w-full"
              >
                Download Model
              </button>
            </div>
          </>
        )}

        {/* System Prompt */}

        {/* close menu */}
        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-secondary mt-5 text-white w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
