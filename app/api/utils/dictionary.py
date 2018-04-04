class Dictionary:
    """Dictionary helper utility"""

    @staticmethod
    def delete_none_values(dictionary: dict) -> dict:
        """Removes None values from the dictionary"""
        return { k: v for k, v in dictionary.items() if v is not None }