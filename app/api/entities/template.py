from api.entities.base import BaseEntity, BaseEntityFactory
from api.utils.dictionary import Dictionary
from api.database import db

class TemplateEntity(BaseEntity):
    __tablename__ = "templates"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    memory = db.Column(db.Integer, nullable=False)
    cores = db.Column(db.Integer, nullable=False)
    olin_resource_tpl = db.Column(db.String(255), nullable=False)

    def set_id(self, template_id: int) -> "TemplateEntity":
        self.id = template_id
        return self

    def get_id(self) -> int:
        return self.id

    def set_name(self, template_name: str) -> "TemplateEntity":
        self.name = template_name
        return self

    def get_name(self) -> str:
        return self.name

    def set_memory(self, template_memory: int) -> "TemplateEntity":
        self.memory = template_memory
        return self

    def get_memory(self) -> int:
        return self.memory

    def set_cores(self, template_cores: int) -> "TemplateEntity":
        self.cores = template_cores
        return self

    def get_cores(self) -> int:
        return self.cores

    def set_olin_resource_tpl(self, template_olin_resource_tpl: str) -> "TemplateEntity":
        self.olin_resource_tpl = template_olin_resource_tpl
        return self

    def get_olin_resource_tpl(self) -> str:
        return self.olin_resource_tpl

    def to_dict(self) -> dict:
        return {
            "id": self.get_id(),
            "name": self.get_name(),
            "memory": self.get_memory(),
            "cores": self.get_cores(),
            "olin_resource_tpl": self.get_olin_resource_tpl()
        }
