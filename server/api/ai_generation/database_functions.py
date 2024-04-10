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



def add_message_to_thread(thread_id, message, user_id):
    collection = db["Threads"]
    thread_to_update = collection.find_one({"_id": ObjectId(thread_id), "user_id": user_id})
    if thread_to_update:
        messages = thread_to_update.get('messages', [])
        message_id = str(uuid.uuid4())
        message["_id"] = message_id
        messages.append(message)
        collection.update_one(
            {"_id": ObjectId(thread_id), "user_id": user_id},
            {"$set": {"messages": messages}}
        )
        return message
    else:
        return message


def get_thread_messages(thread_id, user_id):
    collection = db['Threads']
    thread = collection.find_one({'_id': ObjectId(thread_id), 'user_id': user_id})
    if thread:
        return thread["messages"]
    else:
        return []


def update_message_in_thread(thread_id, user_id, is_streaming, message, message_id):
    collection = db['Threads']
    thread = collection.find_one({'_id': ObjectId(thread_id), 'user_id': user_id})
    if thread:
        for msg in thread['messages']:
            if str(msg['_id']) == message_id:
                msg['message'] = message
                msg['streaming'] = is_streaming
                collection.update_one({'_id': ObjectId(thread_id)}, {'$set': {'messages': thread['messages']}})
                return msg
    else:
        print("Failed")
