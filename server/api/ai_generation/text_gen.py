import guidance
from guidance import models, gen, Tool, select
import time
import os
from dotenv import load_dotenv
load_dotenv()
from api.ai_generation.database_functions import add_message_to_thread, update_message_in_thread, get_thread_messages, get_user_chat_preset
TEXT_GENERATION_URL = os.getenv("TEXT_GENERATION_URL")


os.environ["OPENAI_API_KEY"] = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
text_gen = models.OpenAI("gpt-3.5-turbo-instruct", base_url="http://"+TEXT_GENERATION_URL+"/v1/")


@guidance
def mixtral_format(lm, system_prompt):
    lm += system_prompt + gen(max_tokens=2000, stop="</s>", name='response')
    return lm

@guidance
def command_r_format(lm, system_prompt):
    lm += system_prompt + gen(max_tokens=2000, stop="<|END_OF_TURN_TOKEN|>", name='response')
    return lm

def create_chat_history_string(messages, user_prefix="", bot_prefix="", user_end_token="", bot_end_token="", split="\n", system_prefix="", world_prefix=""):
    chat_history_string = ""
    if len(messages) >= 1:
        for message in messages:
            if message["type"] == "bot" and message["streaming"] == False:
                chat_history_string += (
                    split
                    + bot_prefix
                    + message["message"]
                    + bot_end_token
                )
            if message["type"] == "user":
                chat_history_string += (
                    split
                    + user_prefix
                    + message["message"]
                    + user_end_token
                )
            if message["type"] == "system":
                chat_history_string += (
                    split
                    + system_prefix
                    + message["message"]
                    + bot_end_token
                )
            if message["type"] == "world":
                chat_history_string += (
                    split
                    + world_prefix
                    + message["message"]
                    + bot_end_token
                )
    # add the start of the bot response.
    chat_history_string += (
        split
        + bot_prefix
        + ""
    )
    return chat_history_string


def format_mixtral_prompt(system_prompt, messages, user_name, bot_name):
    full_prompt = ""
    # add system prompt
    full_prompt += "[INST] " + system_prompt
    # system_prompt = f"[INST] You are a chatbot called ChatGen. [/INST]ChatGen:Model answer</s> [INST] tell me a joke [/INST] ChatGen:"
    # add the message history to the prompt.
    full_prompt += create_chat_history_string(messages, " [INST] "+user_name+": ", " [/INST] "+bot_name+": ", "", "</s>", "", " [INST] System: ", " [INST] World: ")
    print(full_prompt)
    return full_prompt

def format_command_r_prompt(system_prompt, messages, user_name, bot_name):
    # <BOS_TOKEN><|START_OF_TURN_TOKEN|><|USER_TOKEN|>Hello, how are you?<|END_OF_TURN_TOKEN|><|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>
    full_prompt = ""
    full_prompt += "<BOS_TOKEN> " + system_prompt
    full_prompt += create_chat_history_string(messages, " <|START_OF_TURN_TOKEN|><|USER_TOKEN|> "+user_name+": ", " <|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|> "+bot_name+": ", "<|END_OF_TURN_TOKEN|>", "<|END_OF_TURN_TOKEN|>", "", " <|START_OF_TURN_TOKEN|><|USER_TOKEN|> System: ", " <|START_OF_TURN_TOKEN|><|USER_TOKEN|> World: ")
    print(full_prompt)
    return full_prompt


def stream_response(prompt_format, thread_prompt, thread_id, user_id, message_to_update):
    response = ""
    for part in text_gen.stream() + prompt_format(thread_prompt):
        if thread_prompt in str(part):
            # print(str(part).replace(thread_prompt, ""))
            response = str(part).replace(thread_prompt, "")
            update_message_in_thread(thread_id, user_id, True, response, message_to_update["_id"])

    return response

import asyncio
async def generate_response(chat_id, user_id, thread_id, prompt_format, message_type, message):
    # add a message if the user wants to act like the system or bot.
    message_type = message_type.lower()
    prompt_format = prompt_format.lower()

    if message_type == "bot" or message_type == "system":
        new_message = {
            "type": message_type,
            "message": message,
            "streaming": False
        }
        final_message = add_message_to_thread(thread_id, new_message, user_id)
        return final_message

    # set up the bots response for streaming.
    response = ""
    streaming_message =  {
        "type": "bot",
        "message": message,
        "streaming": True
    }
    message_to_update = add_message_to_thread(thread_id, streaming_message, user_id)
    thread_messages = get_thread_messages(thread_id, user_id)

    # temp chat preset data
    preset_data = get_user_chat_preset(user_id, chat_id)

    if prompt_format == "mixtral":
        thread_prompt = format_mixtral_prompt(preset_data["system_prompt"], thread_messages, preset_data["user_name"], preset_data["bot_name"])
        response = stream_response(mixtral_format, thread_prompt, thread_id, user_id, message_to_update)
        print(response)
    if prompt_format == "command-r":
        thread_prompt = format_command_r_prompt(preset_data["system_prompt"], thread_messages, preset_data["user_name"], preset_data["bot_name"])
        response = stream_response(mixtral_format, thread_prompt, thread_id, user_id, message_to_update)

    final_message = update_message_in_thread(thread_id, user_id, False, response, message_to_update["_id"])
    return final_message


# generate_response("6615c56a9b9c79c739377f72", "google-oauth2|113315294171159017171", "6615c56a9b9c79c739377f73", "mixtral", "user", "bob the builder.")
