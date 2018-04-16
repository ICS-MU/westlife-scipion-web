""" Shared path names and other constants"""

SCIPION_BACK_DIR = "/var/scipion/"
TO_DEPLOY_DIR = SCIPION_BACK_DIR + "to_deploy/"
DEPLOYING_DIR = SCIPION_BACK_DIR + "deploying/"
DEPLOYED_DIR = SCIPION_BACK_DIR + "deployed/"
TO_DELETE_DIR = SCIPION_BACK_DIR + "to_delete/"
DELETING_DIR = SCIPION_BACK_DIR + "deleting/"
DELETED_DIR = SCIPION_BACK_DIR + "deleted/"
TEMPLATE_DIR = SCIPION_BACK_DIR + "template/"


DEPLOYMENTS_DIR = SCIPION_BACK_DIR + "deployments/"

DATABASE_FILE = SCIPION_BACK_DIR + 'deployments.json'
# TEMPLATES_FILE = SCIPION_BACK_DIR + 'templates.json'
DATABASE = SCIPION_BACK_DIR + "scipion-cloudify.db"

DEPLOY_LOG_FILE = SCIPION_BACK_DIR + 'deploy.log'
UN_DEPLOY_LOG_FILE = SCIPION_BACK_DIR + 'un_deploy.log'

FLAVOURS_FILE = SCIPION_BACK_DIR + 'flavors.json'
IMAGES_FILE = SCIPION_BACK_DIR + 'images.json'

OLIN_RESOURCE_TPL_PLACEHOLDER = "medium2change"
VNC_PASSWORD_PLACEHOLDER = "Scipion4All"


STATUS_TO_DEPLOY = "to_deploy"
STATUS_DEPLOYING = "deploying"
STATUS_DEPLOYED = "deployed"
STATUS_UNDEPLOYING = "undeploying"
STATUS_UNDEPLOYED = "undeployed"
STATUS_TO_UNDEPLOY = "to_undeploy"