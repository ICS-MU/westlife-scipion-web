from flask import request
from flask_jwt_simple import jwt_required
from api.base import ApiResource, current_user
from api.entities.template import TemplateEntity
from api.repositories.templates import TemplateNotFoundException
from api.di import RepositoriesContainer, FactoriesContainer

class TemplatesResource(ApiResource):
    """Template base resource"""

    def __init__(self):
        self.repository = RepositoriesContainer.templates_repository()
        self.factory = FactoriesContainer.templates_factory()

    @staticmethod
    def _template_not_found_result() -> tuple:
        return { "message": "Template not found" }, 404

class Templates(TemplatesResource):
    """Templates resource"""

    @jwt_required
    def get(self):
        pass

class Template(TemplatesResource):
    """Template resource"""

    @jwt_required
    def get(self):
        pass
