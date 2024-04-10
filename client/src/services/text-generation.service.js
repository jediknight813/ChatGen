import { callExternalApi } from "./external-api.service";
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const createUserChatThread = async (
  accessToken,
  chat_id,
  user_id,
  thread_id,
  prompt_format,
  message_type,
  message
) => {
  const config = {
    url: `${apiServerUrl}/api/text_generation/handle_user_message`,
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      user_id: user_id,
      chat_id: chat_id,
      thread_id: thread_id,
      prompt_format: prompt_format,
      message_type: message_type,
      message: message,
    },
  };

  const { data, error } = await callExternalApi({ config });

  return {
    data: data || null,
    error,
  };
};
