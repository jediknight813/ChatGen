from flask import Blueprint, g, request, jsonify
import asyncio

from api.pymongo_database.thread.thread_functions import (
    get_chat_threads_from_database,
    create_chat_thread,
    delete_user_thread,
    get_thread_messages,
    get_thread_streaming_message,
    add_message_to_thread
)
from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions,
)

bp_name = "api-threads"
bp_url_prefix = "/api/threads"
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)


@bp.route("/create_thread", methods=["POST"])
@authorization_guard
def create_thread():
    data = request.get_json()
    user_id = g.user_data
    chat_id = data.get("chat_id")
    thread = create_chat_thread(user_id, chat_id)
    return {"message": thread}


@bp.route("/get_streaming_message", methods=["POST"])
@authorization_guard
def get_streaming_message():
    data = request.get_json()
    user_id = g.user_data
    thread_id = data.get("thread_id")
    message = get_thread_streaming_message(thread_id, user_id)
    return {"message": message}


@bp.route("/add_user_message_to_thread", methods=["POST"])
@authorization_guard
def add_user_message_to_thread():
    data = request.get_json()
    user_id = g.user_data
    thread_id = data.get("thread_id")
    message = data.get("message")
    messageType = data.get("messageType")
    messageType = messageType.lower()
    new_message = {
        "type": messageType,
        "message": message,
        "streaming": False
    }
    final_message = add_message_to_thread(thread_id, new_message, user_id)
    return {"message": final_message}


@bp.route("/get_all_thread_messages", methods=["POST"])
@authorization_guard
def get_all_thread_messages():
    data = request.get_json()
    user_id = g.user_data
    thread_id = data.get("thread_id")
    thread = get_thread_messages(thread_id, user_id)
    return {"message": thread}


@bp.route("/get_chat_threads", methods=["POST"])
@authorization_guard
def get_chat_threads():
    data = request.get_json()
    user_id = g.user_data
    chat_id = data.get("chat_id")
    chat_id = str(chat_id)
    thread = get_chat_threads_from_database(user_id, chat_id)
    return {"message": thread}


@bp.route("/delete_thread", methods=["POST"])
@authorization_guard
def delete_thread():
    data = request.get_json()
    user_id = g.user_data
    thread_id = data.get("thread_id")
    is_deleted = delete_user_thread(user_id, thread_id)
    return {"message": is_deleted}
