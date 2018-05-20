from abc import ABC
from api.database import db

class BaseEntity(db.Model):
    """Abstract Base Entity"""
    __abstract__ = True

class BaseEntityFactory(ABC):
    """Abstract BaseEntityFactory"""

    mandatory_items = []

    def _check_data_items(self, data: dict, check_mandatory_items: bool = True):
        """
        Throws InvalidDataItemsException if data doesn't contain mandatory
        items or data contains unknown items.
        """
        data_keys = [*data]
        # mandatory and optional items set
        if check_mandatory_items:
            mandatory_items = self.mandatory_items
            optional_items = self.optional_items
        else:
            mandatory_items = []
            optional_items = self.mandatory_items + self.optional_items
        # data items check
        for mandatory_item in mandatory_items:
            valid = False
            if mandatory_item in data_keys:
                valid = True
            if not valid:
                raise InvalidDataItemsException("Mandatory data item '" + mandatory_item + "' is missing.")
        for data_key in data_keys:
            if data_key not in mandatory_items and data_key not in optional_items:
                raise InvalidDataItemsException("Data item '" + data_key + "' is not allowed.")

class BaseEntityFactoryException(Exception):
    """Base Entity Factory exception"""
    pass

class InvalidDataItemsException(BaseEntityFactoryException):
    """Invalid data items exception"""
    pass
