from abc import ABC

class Validator(ABC):
    """Abstract parent of the validators"""

class BoundaryValidator(Validator):
    """Boundary validator"""

    @staticmethod
    def validate(item_name: str, value: int, min_value: int = None, max_value: int = None):
        """
        Throws BoundaryValidatorException if value is smaller than min_value or 
        value is greater than max_value
        """
        if min_value is not None and value < min_value:
            raise BoundaryValidationException(item_name + " minimal value is " + str(min_value))
        if max_value is not None and value > max_value:
            raise BoundaryValidationException(item_name + " maximal value is " + str(max_value))

class BaseEntityValidator(Validator):
    """Base entity validator"""

    DEFAULT_PARAM_NAME = "Item"

    def _validate_string_size(self, string: str, param_name: str = None, min_size: int = None, max_size: int = None,
                              can_be_none: bool = False):
        """
        Validates string size based on the min_size, max_size and can_be_none parameters. 
        It throws BoundaryValidationException if validation fails.
        """
        if string is None and can_be_none:
            return
        string_length = len(string) if string is not None else 0
        if param_name is None:
            param_name = self.DEFAULT_PARAM_NAME
        if min_size is not None and string_length < min_size:
            if min_size == 1:
                raise BoundaryValidationException(param_name + " cannot be empty.")
            else:
                raise BoundaryValidationException(param_name + " size must be at least " + str(min_size)
                                                  + " characters.")
        if max_size is not None and string_length > max_size:
            raise BoundaryValidationException(param_name + " cannot be bigger than " + str(max_size) + " characters")

    def _validate_integer_range(self, value: int, param_name: str = None, min_size: int = None, max_size: int = None,
                                can_be_none: bool = False):
        """
        Checks if the given integer value is in range defined by min_size and max_size parameters.
        It throws BoundaryValidationException if validation fails.
        """
        if value is None and can_be_none:
            return
        if param_name is None:
            param_name = self.DEFAULT_PARAM_NAME
        if min_size is not None and value < min_size:
            raise BoundaryValidationException(param_name + " value must be at least " + str(min_size))
        if max_size is not None and value > max_size:
            raise BoundaryValidationException(param_name + " value cannot be greater than " + str(max_size))

    def _validate_value_in_list(self, value, values_list: list, param_name: str = None, can_be_none: bool = False):
        """
        Checks if the given value is in values_list.
        It throws ValueNotInListException if validation fails.
        """
        if value is None and can_be_none:
            return
        if param_name is None:
            param_name = self.DEFAULT_PARAM_NAME
        is_in_list = False
        for list_value in values_list:
            if value == list_value and type(value) == type(list_value):
                is_in_list = True
                break
        if not is_in_list:
            raise ValueNotInListException(
                param_name + " acceptable values are: " + ", ".join(list(map(str, values_list)))
            )

    def _validate_int_boolean(self, value: int, param_name: str = None, can_be_none: bool = False):
        """
        Checks if the given integer value corresponds to boolean value [0,1].
        It throws ValueNotInListException if validation fails
        """
        if param_name is None:
            param_name = self.DEFAULT_PARAM_NAME
        self._validate_value_in_list(value, [0, 1], param_name, can_be_none)

    def _validate_data_type(self, item, item_class, param_name: str = None, can_be_none: bool = False):
        """
        Checks if the given item is instance of the item_class.
        It throws InvalidDataTypeException if validation fails.
        """
        if item is None and can_be_none:
            return
        if param_name is None:
            param_name = self.DEFAULT_PARAM_NAME
        if not isinstance(item, item_class):
            raise InvalidDataTypeException(param_name + " has invalid data type.")


class ValidatorException(Exception):
    """Validator exception"""
    pass

class BoundaryValidationException(ValidatorException):
    """Boundary validator exception"""
    pass

class ValueNotInListException(ValidatorException):
    """Value not in list exception"""
    pass

class InvalidDataTypeException(ValidatorException):
    """Invalid data type exception"""
    pass
