from abc import ABC
from api.database import db

class BaseEntity(db.Model):
    __abstract__ = True

class BaseEntityFactory(ABC):
    """Abstract descendant of the Base entity factory"""

    mandatory_items = []
    optional_items = []

    def _check_data_items(self, data: dict, check_mandatory_items: bool = True):
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
    pass


class InvalidDataItemsException(BaseEntityFactoryException):
    pass
