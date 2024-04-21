import { callExternalApi } from "./external-api.service";
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getReponseToUser = async (
  accessToken,
  chat_id,
  thread_id,
  prompt_format,
  message_type,
  message,
  user_id
) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/handle_user_message`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      chat_id: chat_id,
      thread_id: thread_id,
      prompt_format: prompt_format,
      message_type: message_type,
      message: message,
      user_id: user_id,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export const getModels = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/get_models`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data ? data.message : null,
    error,
  };
};

export const loadModel = async (
  accessToken,
  modelName,
  gpuThreads,
  ctxSize
) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/load_model`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      modal_name: modelName,
      gpu_threads: gpuThreads,
      ctx_size: ctxSize,
    },
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data ? data.message : null,
    error,
  };
};

export const downloadModel = async (
  accessToken,
  authorName,
  authorRepo,
  authorModel
) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/download_model`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      authorName: authorName,
      authorRepo: authorRepo,
      authorModel: authorModel,
    },
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data ? data.message : null,
    error,
  };
};

export const unloadModel = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/unload_model`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data ? data.message : null,
    error,
  };
};
