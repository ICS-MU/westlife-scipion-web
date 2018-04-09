import os
import json
#import api.constants as const
from flask import make_response
from typing import List
from api.entities.deployment import DeploymentEntity, DeploymentEntityFactory
from api.utils.common_validators import CommonEntityValidator

class DeploymentsRepository:
    """Deployments repository"""

    def __init__(self, factory: DeploymentEntityFactory):
        self.factory = factory

    def get_by_id(self, deployment_id: int) -> DeploymentEntity:
        pass
        #if not os.path.isfile(const.DEPLOYMENTS_DB_FILE):
        #    raise DeploymentNotFoundException
        #with open(const.DEPLOYMENTS_DB_FILE, "r") as f_obj:
        #    json_data = json.load(f_obj)
        #deployment = [deployment for deployment in json_data if deployment['id'] == deployment_id]
        #if len(deployment) == 0:
        #    raise DeploymentNotFoundException
        #return self.factory.create_from_data(deployment[0])

    def get_by_user_id(self, user_id: str, running: bool, limit: int, offset: int) -> List[DeploymentEntity]:
        pass
        #deployments = []
        #if os.path.isfile(const.DEPLOYMENTS_DB_FILE):
        #    with open(const.DEPLOYMENTS_DB_FILE, "r") as f_obj:
        #        json_data = json.load(f_obj)

        #    actual_offset = 0
        #    for deployment in reversed(json_data):
        #        if (deployment['status'] not in const.STATUSES_RUNNING and running) or \
        #        (deployment['status'] in const.STATUSES_RUNNING and not running):
        #            continue

        #        if deployment['user_id'] == user_id:
        #            actual_offset += 1
        #            if actual_offset <= offset:
        #                continue
        #            deployments.append(self.factory.create_from_data(deployment))
        #            if len(deployments) == limit:
        #                break
        #return deployments

    def get_log_by_deployment_id(self, deployment_id: int) -> str:
        pass
        #path_to_log = const.DEPLOYMENTS_DIR + str(deployment_id) + "/log.txt"
        #if os.path.isfile(path_to_log):
        #    log = ""
        #    with open(path_to_log, "r") as f_log:
        #        log = f_log.read()
        #    return make_response(log, 200)
        #else:
        #    raise DeploymentLogNotFoundException

        #with open(path_to_log, "r") as f_log:
        #    log = f_log.read()


class DeploymentsValidator(CommonEntityValidator):
    """Deployments validator"""
    pass

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

