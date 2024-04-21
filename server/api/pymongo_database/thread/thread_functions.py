from posix import system
import pymongo
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv
import json
load_dotenv()
import uuid

mongodb_url = os.environ.get("MONGO_URL")
database = "ChatGen"
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
collection = db["Threads"]


# Thread document model.
# {
# "chat_id": "123123123"
# "user_id": "123123123",
# "messages": [{"type": "user", "message": "hello", id: "123123412"}],
# "name": "chat 1"
# }

def get_user_chat_preset(user_id, chat_id):
    collection = db["Chats"]
    preset = collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if preset:
        return preset["preset"]
    else:
        return {}


def check_if_user_has_thread(thread_id, user_id):
    collection = db['Threads']
    thread = collection.find_one({'_id': ObjectId(thread_id), 'user_id': user_id})
    if thread:
        return True
    else:
        return False

def get_thread_messages(thread_id, user_id):
    collection = db['Threads']
    thread = collection.find_one({'_id': ObjectId(thread_id), 'user_id': user_id})
    if thread:
        preset = get_user_chat_preset(user_id, thread["chat_id"])
        for message in thread["messages"]:
            if message["type"] == "user":
                message["name"] = preset["user_name"]
            if message["type"] == "bot":
                message["name"] = preset["bot_name"]
            if message["type"] == "world" or message["type"] == "system":
                message["name"] = message["type"]

        return thread["messages"]
    else:
        return []

def create_chat_thread(user_id, chat_id):
    current_thread_number = collection.count_documents({"user_id": user_id, "chat_id": ObjectId(chat_id)})
    new_thread_document = {
        "chat_id": ObjectId(chat_id),
        "user_id": user_id,
        "messages": [],
        "name": "Thread #" + str(current_thread_number)
    }
    new_thread = collection.insert_one(new_thread_document)
    new_thread_id = str(new_thread.inserted_id)
    return {"_id": new_thread_id, "user_id": user_id, "messages": [], "name": "Thread #" + str(current_thread_number), "chat_id": str(chat_id)}


def get_chat_threads_from_database(user_id, chat_id):
    all_Threads = list(collection.find({"user_id": user_id, "chat_id": ObjectId(chat_id)}))
    for chat in all_Threads:
        chat["_id"] = str(chat["_id"])
        chat["chat_id"] = str(chat_id)
        del chat["messages"]
    return all_Threads


def delete_user_thread(user_id, thread_id):
    thread_to_delete = collection.find_one({"_id": ObjectId(thread_id), "user_id": user_id})
    print("attemping to delete thread.")
    if thread_to_delete:
        collection.delete_one({"_id": ObjectId(thread_id)})
        return True
    else:
        return False


def get_thread_streaming_message(thread_id, user_id):
    thread = collection.find_one({'_id': ObjectId(thread_id), 'user_id': user_id})
    if thread:
        for msg in thread['messages']:
            if msg['streaming'] == True:
                return msg
    else:
        return "no message is streaming"


def add_message_to_thread(thread_id, message, user_id):
    collection = db["Threads"]
    thread_to_update = collection.find_one({"_id": ObjectId(thread_id), "user_id": user_id})
    if thread_to_update:
        preset = get_user_chat_preset(user_id, thread_to_update["chat_id"])
        messages = thread_to_update.get('messages', [])
        message_id = str(uuid.uuid4())
        message["_id"] = message_id
        if message["type"] == "user":
            message["name"] = preset["user_name"]
        if message["type"] == "bot":
            message["name"] = preset["bot_name"]
        if message["type"] == "world" or message["type"] == "system":
            message["name"] = message["type"]
        messages.append(message)
        collection.update_one(
            {"_id": ObjectId(thread_id), "user_id": user_id},
            {"$set": {"messages": messages}}
        )
        return message
    else:
        return message
