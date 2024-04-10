from flask import Blueprint, g, request

from api.pymongo_database.chat.chat_functions import (
    get_user_chats_from_database,
    create_user_chat,
    delete_user_chat,
)

from api.security.guards import (
    authorization_guard,
    permissions_guard,
    admin_messages_permissions,
)

bp_name = "api-chats"
bp_url_prefix = "/api/chats"
bp = Blueprint(bp_name, __name__, url_prefix=bp_url_prefix)


# @bp.route("/public")
# def public():
#     pass


# @bp.route("/protected")
# @authorization_guard
# @permissions_guard([admin_messages_permissions.read])
# def protected():
#     pass


@bp.route("/get_user_chats", methods=["GET"])
@authorization_guard
def get_user_chats():
    user_data = g.user_data
    chats = get_user_chats_from_database(user_data)
    return {"message": chats}


@bp.route("/create_chat")
@authorization_guard
def create_chat():
    user_data = g.user_data
    new_chat = create_user_chat(user_data)
    return {"message": new_chat}


@bp.route("/delete_chat")
@authorization_guard
def delete_chat():
    user_data = g.user_data
    chat_id = request.args.get("chat_id")
    is_deleted = delete_user_chat(user_data, chat_id)
    return {"message": is_deleted}
