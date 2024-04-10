import pymongo
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv
import json

load_dotenv()
from api.pymongo_database.thread.thread_functions import create_chat_thread

mongodb_url = os.environ.get("MONGO_URL")
database = "ChatGen"
client = pymongo.MongoClient(mongodb_url, 27017)
db = client[database]
collection = db["Chats"]


# chat document model.
# {
# "user_id": "jiofwaofis",
# "name": "chat 1"
# }


def create_user_chat(user_id):
    current_chat_number = collection.count_documents({"user_id": user_id})
    new_chat_document = {
        "user_id": user_id,
        "messages": [],
        "name": "chat " + str(current_chat_number),
    }
    new_chat = collection.insert_one(new_chat_document)
    new_chat_id = str(new_chat.inserted_id)
    # create a new thread with every new chat.
    print(new_chat_id, user_id)
    thread = create_chat_thread(user_id, new_chat_id)
    print(thread, " created.")
    return {
        "_id": new_chat_id,
        "user_id": user_id,
        "name": "chat " + str(current_chat_number),
    }


def get_user_chats_from_database(user_id):
    all_chats = list(collection.find({"user_id": user_id}))
    for chat in all_chats:
        chat["_id"] = str(chat["_id"])
    return all_chats


def delete_user_chat(user_id, chat_id):
    chat_to_delete = collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
    if chat_to_delete:
        collection.delete_one({"_id": ObjectId(chat_id)})
        return True
    else:
        return False
