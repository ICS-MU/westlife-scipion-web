from typing import List
from api.entities.template import TemplateEntity

class TemplatesRepository:
    """Templates repository"""

    def get_all(self) -> List[TemplateEntity]:
        return TemplateEntity.query.all()

    def get_by_id(self, template_id: int) -> TemplateEntity:
        template = TemplateEntity.query.get(template_id)
        if template is None:
            raise TemplateNotFoundException("Template not found")
        return template


class TemplateException(Exception):
    """Template exception"""
    pass

class TemplateNotFoundException(TemplateException):
    """Template is not found exception"""
    pass
