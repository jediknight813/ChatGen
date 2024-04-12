import { callExternalApi } from "./external-api.service";
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const createUserChatThread = async (accessToken, chat_id) => {
  const config = {
    url: `${apiServerUrl}/api/threads/create_thread`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      chat_id: chat_id,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export const deleteChatThread = async (accessToken, thread_id) => {
  const config = {
    url: `${apiServerUrl}/api/threads/delete_thread`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      thread_id: thread_id,
    },
  };
  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

export const getAllThreadMessages = async (accessToken, thread_id) => {
  const config = {
    url: `${apiServerUrl}/api/threads/get_all_thread_messages`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      thread_id: thread_id,
    },
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

export const addUserMessageToThread = async (
  accessToken,
  thread_id,
  message,
  messageType
) => {
  const config = {
    url: `${apiServerUrl}/api/threads/add_user_message_to_thread`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      thread_id: thread_id,
      message: message,
      messageType: messageType,
    },
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

export const getStreamingMessage = async (accessToken, thread_id) => {
  const config = {
    url: `${apiServerUrl}/api/threads/get_streaming_message`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      thread_id: thread_id,
    },
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};

export const getUserChatThreads = async (accessToken, chat_id) => {
  const config = {
    url: `${apiServerUrl}/api/threads/get_chat_threads`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      chat_id: chat_id,
    },
  };

  const { data, error } = await callExternalApi({ config });
  return {
    data: data || null,
    error,
  };
};
