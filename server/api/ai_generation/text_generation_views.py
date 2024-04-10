from flask import Blueprint, g, request, jsonify

from api.pymongo_database.thread.thread_functions import check_if_user_has_thread
from api.ai_generation.text_gen import generate_response
from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions,
)

bp_name = "api-text_generation"
bp_url_prefix = "/api/text_generation"
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)


@bp.route("/handle_user_message", methods=["POST"])
@authorization_guard
def handle_user_message():
    data = request.get_json()
    user_id = g.user_data

    chat_id = data.get("chat_id")
    thread_id = data.get("thread_id")
    prompt_format = data.get("prompt_format")
    message_type = data.get("message_type")
    message = data.get("message")

    # check if the user owns the thread.
    if check_if_user_has_thread(thread_id, user_id) == False:
        return {"message": "You do not own this thread, or it does not exist."}

    message = generate_response(
        chat_id, user_id, thread_id, prompt_format, message_type, message
    )
    return {"message": message}
