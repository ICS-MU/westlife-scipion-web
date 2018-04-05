SCIPION_WORKDIR = "/var/scipion/"
#SCIPION_WORKDIR = "/www/sites/scipion/"
TO_DEPLOY_DIR = SCIPION_WORKDIR + "to_deploy/"
DEPLOYING_DIR = SCIPION_WORKDIR + "deploying/"
DEPLOYED_DIR = SCIPION_WORKDIR + "deployed/"
TO_DELETE_DIR = SCIPION_WORKDIR + "to_delete/"
WORKDIR = SCIPION_WORKDIR + "workdir/"
FLAVORS_FILENAME = SCIPION_WORKDIR + "flavors.json"
IMAGES_FILENAME = SCIPION_WORKDIR + "images.json"
DEPLOYMENTS_DB_FILE = SCIPION_WORKDIR + "deployments.json"

STATUS_DEPLOYING = "deploying"
STATUS_DEPLOYED = "deployed"
STATUS_UNDEPLOYING = "undeploying"
STATUS_UNDEPLOYED = "undeployed"

STATUSES_RUNNING = [STATUS_DEPLOYING, STATUS_DEPLOYED]