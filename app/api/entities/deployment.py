import os
import datetime
import api.constants as const
from api.entities.base import BaseEntity, BaseEntityFactory, BaseEntityFactoryException
from api.utils.dictionary import Dictionary
from api.database import db
from json.decoder import JSONDecodeError

class DeploymentEntity(BaseEntity):
    """Deployment entity"""
    __tablename__ = "deployments"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(30), nullable=False)
    modified = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    days_duration = db.Column(db.Integer, nullable=False)
    data_url = db.Column(db.String(1000), nullable=False)
    olinip = db.Column(db.String(50), nullable=True)
    vnc_password = db.Column(db.String(255), nullable=True)
    template_id = db.Column(db.Integer, db.ForeignKey('templates.id'), nullable=False)
    template = db.relationship('TemplateEntity', backref=db.backref('deployments', lazy=True))

    def set_id(self, deployment_id: int) -> "DeploymentEntity":
        self.id = deployment_id
        return self

    def get_id(self) -> int:
        return self.id

    def set_user_id(self, user_id: str) -> "DeploymentEntity":
        self.user_id = user_id
        return self

    def get_user_id(self) -> str:
        return self.user_id

    def set_name(self, deployment_name: str) -> "DeploymentEntity":
        self.name = deployment_name
        return self

    def get_name(self) -> str:
        return self.name

    def set_status(self, deployment_status: str) -> "DeploymentEntity":
        self.status = deployment_status
        return self

    def get_status(self) -> str:
        return self.status

    def set_modified(self, modified_datetime: str) -> "DeploymentEntity":
        self.modified = modified_datetime
        return self

    def get_modified(self) -> str:
        return self.modified

    def set_days_duration(self, deployment_days_duration: int) -> "DeploymentEntity":
        self.days_duration = deployment_days_duration
        return self

    def get_days_duration(self) -> int:
        return self.days_duration

    def set_data_url(self, deployment_data_url: str) -> "DeploymentEntity":
        self.data_url = deployment_data_url
        return self

    def get_data_url(self) -> str:
        return self.data_url

    def set_olinip(self, deployment_olinip: str) -> "DeploymentEntity":
        self.olinip = deployment_olinip
        return self

    def get_olinip(self) -> str:
        return self.olinip

    def set_vnc_password(self, deployment_vnc_password: str) -> "DeploymentEntity":
        self.vnc_password = deployment_vnc_password
        return self

    def get_vnc_password(self) -> str:
        return self.vnc_password

    def set_template_id(self, deployment_template_id: int) -> "DeploymentEntity":
        self.template_id = deployment_template_id
        return self

    def get_template_id(self) -> int:
        return self.template_id

    def is_running(self) -> bool:
        return self.status in const.STATUSES_RUNNING

    def is_past(self) -> bool:
        return not self.is_running()

    def to_dict(self) -> dict:
        return {
            "id": self.get_id(),
            "user_id": self.get_user_id(),
            "name": self.get_name(),
            "status": self.get_status(),
            "modified": self.get_modified(),
            "days_duration": self.get_days_duration(),
            "data_url": self.get_data_url(),
            "olinip": self.get_olinip(),
            "vnc_password": self.get_vnc_password(),
            "template_id": self.get_template_id()
        }


class DeploymentEntityFactory(BaseEntityFactory):
    """Deployment entity factory"""
    mandatory_items = ["user_id", "name", "data_url", "template_id", "days_duration"]
    optional_items = []

    def create_from_post_data(self, data: dict, check_mandatory_items: bool = True) -> DeploymentEntity:
        try:
            # remove None data items
            data = Dictionary.delete_none_values(data)
            # check data items
            self._check_data_items(data, check_mandatory_items)
            deployment = DeploymentEntity(
                user_id=data['user_id'], 
                name=data['name'],
                status=const.STATUS_TO_DEPLOY,
                modified=datetime.datetime.utcnow(),
                days_duration=data['days_duration'],
                data_url=data['data_url'],
                template_id=data['template_id']
            )
            return deployment
        except JSONDecodeError:
            raise DeploymentEntityFactoryException("Invalid JSON in request")

class DeploymentEntityFactoryException(BaseEntityFactoryException):
    pass
