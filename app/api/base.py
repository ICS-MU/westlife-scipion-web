from flask import request
from flask_restful import Resource
from flask_jwt_simple import get_jwt_identity
from functools import wraps
from api.utils.common_validators import BoundaryValidator


def current_user(f):
    """Current user decorator"""
    @wraps(f)
    def decorated(self, *args, **kwargs):
        current_user = get_jwt_identity()
        return f(self, current_user, *args, **kwargs)
    return decorated

class ApiResource(Resource):
    """API resource base"""

    DEFAULT_OFFSET = 0
    DEFAULT_LIMIT = 20
    MAX_LIMIT = 50

    @staticmethod
    def _resource_not_allowed_result() -> tuple:
        return {"message": "Resource not allowed"}, 403

    def _check_selection_boundaries(self, limit: int = None, offset: int = None):
        """
        Throws BoundaryValidationException if limit or offset are out of bound
        """
        MAX_LIMIT = self.MAX_LIMIT
        if limit is not None:
            BoundaryValidator.validate("limit", limit, 1, MAX_LIMIT)
        if offset is not None:
            BoundaryValidator.validate("offset", offset, 0)

    def _get_selection_params(self) -> dict:
        limit = request.args.get("limit", type=int)
        offset = request.args.get("offset", type=int)
        self._check_selection_boundaries(limit, offset)
        if limit is None:
            limit = self.DEFAULT_LIMIT
        if offset is None:
            offset = self.DEFAULT_OFFSET
        return { "limit": limit, "offset": offset }