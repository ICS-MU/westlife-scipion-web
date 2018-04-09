from typing import List
from api.entities.template import TemplateEntity, TemplateEntityFactory

class TemplatesRepository:
    """Deployments repository"""

    def __init__(self, factory: TemplateEntityFactory):
        self.factory = factory

    def get(self, limit: int, offset: int) -> List[TemplateEntity]:
        pass

    def get_by_id(self, tempalte_id: int) -> TemplateEntity:
        pass


class TemplateException(Exception):
    """Template exception"""
    pass

class TemplateNotFoundException(TemplateException):
    """Template is not found exception"""
    pass

