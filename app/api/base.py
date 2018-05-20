from flask import request
from flask_restful import Resource
from flask_jwt_simple import get_jwt_identity
from functools import wraps
from typing import List
from api.utils.common_validators import BoundaryValidator, ValidatorException


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
    def _get_request_data():
        return request.get_json(force=True)

    @staticmethod
    def _resource_not_allowed_result() -> tuple:
        return {"message": "Resource not allowed"}, 403

    def _check_data_forbidden_items(self, data: dict, forbidden_items: List[str] = None):
        """
        Throws ValidatorException if data contains forbidden items
        """
        if forbidden_items is None:
            forbidden_items = self.forbidden_data_items
        for forbidden_item in forbidden_items:
            if forbidden_item in data:
                raise ValidatorException('Data item "' + forbidden_item + '" is not allowed.')

    def _check_data_mandatory_items(self, data: dict, mandatory_items: List[str] = None):
        """
        Throws ValidatorException if data doesn't contain mandatory items
        """
        if mandatory_items is None:
            mandatory_items = self.mandatory_data_items
        for mandatory_item in mandatory_items:
            if mandatory_item not in data:
                raise ValidatorException('Mandatory data item "' + mandatory_item + '" is missing.')

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
        """
        Returns dictionary object containing GET method URL params
        offset and limit
        """
        limit = request.args.get("limit", type=int)
        offset = request.args.get("offset", type=int)
        self._check_selection_boundaries(limit, offset)
        if limit is None:
            limit = self.DEFAULT_LIMIT
        if offset is None:
            offset = self.DEFAULT_OFFSET
        return { "limit": limit, "offset": offset }
