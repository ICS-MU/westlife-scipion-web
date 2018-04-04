import os
import api.constants as const
from api.entities.base import BaseEntityFactory
from api.utils.dictionary import Dictionary

class DeploymentEntity:
    """Deployment entity"""

    SIZE_SMALL = "small"
    SIZE_MEDIUM = "medium"
    SIZE_LARGE = "large"

    def __init__(self):
        self.id = None
        self.user_id = None
        self.name = None
        self.status = const.STATUS_DEPLOYING
        self.modified = None
        self.data_url = None
        self.size = None
        self.vnc_password = None

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

    def set_data_url(self, deployment_data_url: str) -> "DeploymentEntity":
        self.data_url = deployment_data_url
        return self

    def get_data_url(self) -> str:
        return self.data_url

    def set_size(self, deployment_size: str) -> "DeploymentEntity":
        self.size = deployment_size
        return self

    def get_vnc_password(self) -> str:
        return self.vnc_password

    def set_vnc_password_from_file(self) -> "DeploymentEntity":
        """Get VNC password from file and set it to the entity attribute"""
        path_to_vnc_password = const.WORKDIR + str(self.id) + "/vncpasswd"
        vnc_password = ""
        if os.path.isfile(path_to_vnc_password):
            with open(path_to_vnc_password) as f_vnc_password:
                vnc_password = f_vnc_password.read()
        self.vnc_password = vnc_password
        return self

    def get_size(self) -> str:
        return self.size

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
            "data_url": self.get_data_url(),
            "size": self.get_size(),
            "vnc_password": self.get_vnc_password()
        }

class DeploymentEntityFactory(BaseEntityFactory):
    """Deployment entity factory"""
    mandatory_items = ["user_id", "name", "data_url", "size"]
    optional_items = ["id", "status", "modified"]

    def create_from_data(self, data: dict, check_mandatory_items: bool = True) -> DeploymentEntity:
        # remove None data items
        data = Dictionary.delete_none_values(data)

        # check data items
        self._check_data_items(data, check_mandatory_items)

        # setting deployment data
        deployment = DeploymentEntity()
        data_items = data
        deployment.set_user_id(data['user_id'])
        deployment.set_name(data['name'])
        deployment.set_data_url(data['data_url'])
        deployment.set_size(data['size'])

        if "id" in data_items:
            deployment.set_id(data['id'])
        if "status" in data_items:
            deployment.set_status(data['status'])
        if "modified" in data_items:
            deployment.set_modified(data['modified'])

        # set additional deployment attributes located in backend files
        deployment.set_vnc_password_from_file()

        return deployment

