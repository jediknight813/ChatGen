from flask import Blueprint, g, request, jsonify
import requests
import asyncio
from api.pymongo_database.thread.thread_functions import check_if_user_has_thread
from api.ai_generation.text_gen import generate_response
from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions,
)
from common.utils import safe_get_env_var
bp_name = "api-text_generation"
bp_url_prefix = "/api/text_generation"
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)
import os
import asyncio
from dotenv import load_dotenv
load_dotenv()
TEXT_GEN_URL = os.getenv("MONGO_URL", "")


@bp.route("/handle_user_message", methods=["POST"])
async def handle_user_message():
    data = request.get_json()
    # user_id = g.user_data
    # ugly fix, should be changed in the future.
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    thread_id = data.get("thread_id")
    prompt_format = data.get("prompt_format")
    message_type = data.get("message_type")
    message = data.get("message")

    # check if the user owns the thread.
    if check_if_user_has_thread(thread_id, user_id) == False:
        return {"message": "You do not own this thread, or it does not exist."}

    message = await generate_response(
        chat_id, user_id, thread_id, prompt_format, message_type, message
    )
    return {"message": message}


@bp.route("/get_models", methods=["POST"])
@authorization_guard
def get_models():
    url = "http://" + TEXT_GEN_URL + ":4000/get_models"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        return {"message": json_data["message"]}
    except requests.exceptions.RequestException as e:
        return {"message": e}


@bp.route("/load_model", methods=["POST"])
@authorization_guard
def load_model():
    data = request.get_json()
    modal_name = data.get("modal_name")
    gpu_threads = data.get("gpu_threads")
    ctx_size = data.get("ctx_size")
    url = (
        "http://"
        + TEXT_GEN_URL
        + ":4000/load_model/"
        + str(modal_name)
        + "/"
        + str(gpu_threads)
        + "/"
        + str(ctx_size)
    )
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        return {"message": json_data}
    except requests.exceptions.RequestException as e:
        return {"message": e}



@bp.route("/download_model", methods=["POST"])
@authorization_guard
def download_model():
    data = request.get_json()
    author_name = data.get("authorName")
    author_repo = data.get("authorRepo")
    author_model = data.get("authorModel")
    url = (
        "http://"
        + TEXT_GEN_URL
        + ":4000/download_model/"
        + author_name
        + "/"
        + author_repo
        + "/"
        + author_model
    )
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        return {"message": json_data}
    except requests.exceptions.RequestException as e:
        return {"message": e}


@bp.route("/unload_model", methods=["POST"])
@authorization_guard
def unload_model():
    url = "http://" + TEXT_GEN_URL + ":4000/unload_model"
    try:
        response = requests.get(url)
        response.raise_for_status()
        json_data = response.json()
        return {"message": json_data}
    except requests.exceptions.RequestException as e:
        return {"message": e}
