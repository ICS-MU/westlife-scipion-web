""" Shared path names and other constants"""

SCIPION_BACK_DIR = "/opt/cfy-wrapper/"
TEMPLATE_DIR = SCIPION_BACK_DIR + "template/"
DEPLOYMENTS_DIR = SCIPION_BACK_DIR + "deployments/"
UNDEPLOYED_DIR = SCIPION_BACK_DIR + "undeployed/"
LOG_DIR = SCIPION_BACK_DIR + "log/"
SCRIPT_DIR = SCIPION_BACK_DIR + "backend/"

DATABASE = SCIPION_BACK_DIR + "scipion-cloudify.db"

DEPLOY_SCRIPT_FILE = SCRIPT_DIR + "deploy_scipion.sh"
UNDEPLOY_SCRIPT_FILE = SCRIPT_DIR + "undeploy_scipion.sh"

DEPLOY_LOG_FILE = LOG_DIR + 'deploy.log'
UN_DEPLOY_LOG_FILE = LOG_DIR + 'un_deploy.log'

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
STATUS_TO_DELETE = "to_delete"
STATUS_ERROR = "error"