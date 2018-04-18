import os
from flask import make_response
from typing import List
from api.entities.deployment import DeploymentEntity, DeploymentEntityFactory
from api.utils.common_validators import BaseEntityValidator, ValidatorException
import api.constants as const
from api.database import db
from datetime import datetime

class DeploymentsRepository:
    """Deployments repository"""

    def __init__(self, factory: DeploymentEntityFactory):
        self.factory = factory

    def get_by_id(self, deployment_id: int) -> DeploymentEntity:
        deployment = DeploymentEntity.query.get(deployment_id)
        if deployment is None:
            raise DeploymentNotFoundException("Deployment not found")
        return deployment

    def get_by_user_id(self, user_id: str, running: bool, filter_term: str, limit: int, offset: int) -> List[DeploymentEntity]:
        if running is True:
            return DeploymentEntity.query.filter_by(user_id=user_id) \
                .filter(DeploymentEntity.status.in_(const.STATUSES_RUNNING)) \
                .order_by(DeploymentEntity.id.desc()).limit(limit).offset(offset).all()
        elif running is False:
            # filter_term is used in history
            print(filter_term)
            return DeploymentEntity.query.filter_by(user_id=user_id) \
                .filter(DeploymentEntity.status.in_(const.STATUSES_PAST)) \
                .filter(DeploymentEntity.name.contains(filter_term)) \
                .order_by(DeploymentEntity.modified.desc()).limit(limit).offset(offset).all()
        else:
            return DeploymentEntity.query.filter_by(user_id=user_id) \
                .order_by(DeploymentEntity.modified.desc()).limit(limit).offset(offset).all()
        

    def get_log_by_deployment_id(self, deployment_id: int) -> str:
        path_to_log = const.DEPLOYMENTS_DIR + str(deployment_id) + "/log.txt"
        if os.path.isfile(path_to_log):
            log = ""
            with open(path_to_log, "r") as f_log:
                log = f_log.read()
            return make_response(log, 200)
        else:
            raise DeploymentLogNotFoundException

        with open(path_to_log, "r") as f_log:
            log = f_log.read()

    def store(self, deployment_new: DeploymentEntity) -> DeploymentEntity:
        deployment = deployment_new
        db.session.add(deployment)
        db.session.commit()
        return deployment

    def update(self, deployment_to_update: DeploymentEntity, data: dict) -> DeploymentEntity:
        deployment = deployment_to_update
        deployment.name = data['name']
        deployment.days_duration = data['days_duration']
        db.session.commit()
        return deployment

    def undeploy(self, deployment_to_undeploy: DeploymentEntity) -> DeploymentEntity:
        deployment = deployment_to_undeploy
        deployment.status = const.STATUS_TO_UNDEPLOY
        deployment.modified = datetime.utcnow()
        db.session.commit()
        return deployment

    def delete(self, deployment_to_delete: DeploymentEntity):
        deployment = deployment_to_delete
        db.session.delete(deployment)
        db.session.commit()

class DeploymentsValidator(BaseEntityValidator):
    """Deployments validator"""

    NAME_MAX_SIZE = 255
    DATA_URL_MAX_SIZE = 1000
    DAYS_DURATION_MAX_SIZE = 30

    def validate(self, deployment: DeploymentEntity):
        self._validate_string_size(deployment.get_name(), "Deployment's name", 1, self.NAME_MAX_SIZE)
        self._validate_data_type(deployment.get_template_id(), int, "Deployment's template id")
        self._validate_data_type(deployment.get_days_duration(), int, "Deployment's duration")
        self._validate_integer_range(deployment.get_days_duration(), "Deployment's duration", 1, self.DAYS_DURATION_MAX_SIZE)

    def validateUpdate(self, prev_deployment: DeploymentEntity, updated_deployment: DeploymentEntity):
        if prev_deployment.get_data_url() != updated_deployment.get_data_url():
            raise ValidatorException("Deployment's data url cannot be changed")
        if prev_deployment.get_template_id() != updated_deployment.get_template_id():
            raise ValidatorException("Deployment's template cannot be changed")

class DeploymentException(Exception):
    """Deployment exception"""
    pass

class DeploymentNotRunningException(DeploymentException):
    """Deployment is not running exception"""
    pass

class DeploymentNotFoundException(DeploymentException):
    """Deployment is not found exception"""
    pass

class DeploymentLogNotFoundException(DeploymentException):
    """Deployment log is not found exception"""
    pass

class DeploymentNotUndeployedException(DeploymentException):
    """Deployment is not undeployed exception"""
    pass


