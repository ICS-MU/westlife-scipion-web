from flask import request
from api.base import ApiResource, current_user
from flask_jwt_simple import jwt_required

class IdentityResource(ApiResource):
    """Current user identity resource"""

    @jwt_required
    @current_user
    def get(self, current_user):
        return { "me": current_user }