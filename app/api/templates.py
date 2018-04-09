from flask import request
from flask_jwt_simple import jwt_required
from api.base import ApiResource, current_user
from api.entities.template import TemplateEntity
from api.repositories.templates import TemplateNotFoundException
from api.di import RepositoriesContainer

class TemplatesResource(ApiResource):
    """Template base resource"""

    def __init__(self):
        self.repository = RepositoriesContainer.templates_repository()

    @staticmethod
    def _template_not_found_result() -> tuple:
        return { "message": "Template not found" }, 404

class Templates(TemplatesResource):
    """Templates resource"""

    #@jwt_required
    def get(self):
        templates = self.repository.get_all()
        templates_dict = []
        for template in templates:
            templates_dict.append(template.to_dict())

        return {
            "templates": templates_dict
        }

class Template(TemplatesResource):
    """Template resource"""

    #@jwt_required
    def get(self, template_id: int):
        try:
            template = self.repository.get_by_id(template_id)
            return {
                "template": template.to_dict()
            }
        except (TemplateNotFoundException):
            return self._template_not_found_result()
