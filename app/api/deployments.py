from flask import request
from flask_jwt_simple import jwt_required
from api.base import ApiResource, current_user
from api.entities.deployment import DeploymentEntity, DeploymentEntityFactoryException
from api.repositories.deployments import DeploymentNotRunningException, DeploymentNotFoundException, \
    DeploymentLogNotFoundException, DeploymentNotUndeployedException
from api.repositories.templates import TemplateNotFoundException
from api.di import RepositoriesContainer, FactoriesContainer, ValidatorsContainer
from api.utils.common_validators import BoundaryValidationException, ValidatorException
import api.constants as const

class DeploymentsResource(ApiResource):
    """Deployment base resource"""

    forbidden_data_items = ["id", "user_id", "status", "modified", "olinip", "vnc_password"]

    def __init__(self):
        self.repository = RepositoriesContainer.deployments_repository()
        self.templates_repository = RepositoriesContainer.templates_repository()
        self.factory = FactoriesContainer.deployments_factory()
        self.validator = ValidatorsContainer.deployments_validator()

    @staticmethod
    def _deployment_not_found_result() -> tuple:
        return { "message": "Deployment not found" }, 404

    @staticmethod
    def _check_deployment_running(deployment: DeploymentEntity):
        if deployment.is_past():
            raise DeploymentNotRunningException("It's not possible to show past deployment")

    def _check_deployment_running_by_id(self, deployment_id: int):
        deployment = self.repository.get_by_id(deployment_id)
        self._check_deployment_running(deployment)

    def _check_template_existence(self, template_id: int):
        self.templates_repository.get_by_id(template_id)

    def _get_running_param(self) -> bool:
        running = request.args.get("running")
        if running is None:
            return None
        return True if running == "true" else False


class Deployments(DeploymentsResource):
    """Deployments resource"""

    @jwt_required
    @current_user
    def get(self, current_user):
        try:
            user_deployments = self.repository.get_by_user_id(
                current_user['id'],
                self._get_running_param(),
                **self._get_selection_params()
            )
            user_deployments_dict = []
            for deployment in user_deployments:
                user_deployments_dict.append(deployment.to_dict())

            return { 
                "deployments": user_deployments_dict,
                "selection_params": {
                    **self._get_selection_params(),
                    "running": self._get_running_param()
                }
            }
        except BoundaryValidationException as e:
            return { "message": str(e) }, 400

    @jwt_required
    @current_user
    def post(self, current_user):
        try:
            data = self._get_request_data()
            self._check_data_forbidden_items(data)
            data['user_id'] = current_user['id']
            deployment = self.factory.create_from_post_data(data)
            self._check_template_existence(data['template_id'])
            self.validator.validate(deployment)
            deployment = self.repository.store(deployment)
            return { "deployment": deployment.to_dict() }
        except (TemplateNotFoundException, DeploymentEntityFactoryException, ValidatorException) as e:
            return { "message": str(e) }, 400

class Deployment(DeploymentsResource):
    """Deployment resource"""

    @jwt_required
    @current_user
    def get(self, current_user, deployment_id: int):
        try:
            if self._get_running_param():
                self._check_deployment_running_by_id(deployment_id)
            deployment = self.repository.get_by_id(deployment_id)
            if deployment.get_user_id() != current_user['id']:
                return self._resource_not_allowed_result()
            return { "deployment": deployment.to_dict() }
        except DeploymentNotRunningException as e:
            return { "message": str(e) }, 405
        except DeploymentNotFoundException:
            return self._deployment_not_found_result()

    @jwt_required
    @current_user
    def patch(self, current_user, deployment_id: int):
        try:
            deployment = self.repository.get_by_id(deployment_id)
            if deployment.get_user_id() != current_user['id']:
                return self._resource_not_allowed_result()
            data = self._get_request_data()
            self._check_data_forbidden_items(data)
            data['user_id'] = current_user['id']
            deployment_to_update = self.factory.create_from_post_data(data)
            self.validator.validate(deployment_to_update)
            self.validator.validateUpdate(deployment, deployment_to_update)
            deployment = self.repository.update(deployment, data)
            return { "deployment": deployment.to_dict() }
        except DeploymentNotFoundException:
            return self._deployment_not_found_result()
        except ValidatorException as e:
            return { "message": str(e) }, 400

    @jwt_required
    @current_user
    def delete(self, current_user, deployment_id: int):
        try:
            deployment = self.repository.get_by_id(deployment_id)
            if deployment.get_user_id() != current_user['id']:
                return self._resource_not_allowed_result() 
            if deployment.get_status() != const.STATUS_UNDEPLOYED:
                raise DeploymentNotUndeployedException("Deployment isn't undeployed, delete forbidden")
            self.repository.delete(deployment)
            return { "message": "OK" }, 200
        except DeploymentNotFoundException:
            return self._deployment_not_found_result()
        except DeploymentNotUndeployedException as e:
             return { "message": str(e) }, 400   

class DeploymentLog(DeploymentsResource):
    """Deployment log resource"""

    @jwt_required
    @current_user
    def get(self, current_user, deployment_id: int):
        try:
            deployment = self.repository.get_by_id(deployment_id)
            if deployment.get_user_id() != current_user['id']:
                return self._resource_not_allowed_result()
            return self.repository.get_log_by_deployment_id(deployment_id)
        except DeploymentNotFoundException:
            return self._deployment_not_found_result()
        except DeploymentLogNotFoundException:
            return { "message": "Deployment log not found" }, 404

class DeploymentUndeploy(DeploymentsResource):
    """Deployment undeploy resource"""

    @jwt_required
    @current_user
    def patch(self, current_user, deployment_id: int):
        try:
            deployment = self.repository.get_by_id(deployment_id)
            if deployment.get_user_id() != current_user['id']:
                return self._resource_not_allowed_result() 
            if deployment.get_status() != const.STATUS_DEPLOYED:
                raise DeploymentNotRunningException("Deployment isn't deployed")   
            deployment = self.repository.undeploy(deployment)
            return { "deployment": deployment.to_dict() }
        except DeploymentNotRunningException as e:
            return { "message": str(e) }
        except DeploymentNotFoundException:
            return self._deployment_not_found_result()
