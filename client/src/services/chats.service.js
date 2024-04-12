import { callExternalApi } from "./external-api.service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getUserChats = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/chats/get_user_chats`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export const createUserChat = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/chats/create_chat`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export const deleteUserChat = async (accessToken, chatId) => {
  const config = {
    url: `${apiServerUrl}/api/chats/delete_chat?chat_id=${chatId}`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};

export const updateUserChat = async (
  accessToken,
  chat_id,
  system_prompt,
  user_name,
  bot_name,
  preset_name
) => {
  const config = {
    url: `${apiServerUrl}/api/chats/edit_chat`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      chat_id: chat_id,
      system_prompt: system_prompt,
      user_name: user_name,
      bot_name: bot_name,
      preset_name: preset_name,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};
