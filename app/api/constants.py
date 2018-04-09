#SCIPION_BACK_DIR = "/var/scipion/"
SCIPION_BACK_DIR = "/www/sites/scipion/"
DEPLOYMENTS_DIR = SCIPION_BACK_DIR + "deployments/"
DATABASE_URI = "sqlite:///" + SCIPION_BACK_DIR + "scipion-cloudify.db"

STATUS_TO_DEPLOY = "to_deploy"
STATUS_DEPLOYING = "deploying"
STATUS_DEPLOYED = "deployed"
STATUS_TO_UNDEPLOY = "to_undeploy"
STATUS_UNDEPLOYING = "undeploying"
STATUS_UNDEPLOYED = "undeployed"

STATUSES_RUNNING = [STATUS_TO_DEPLOY, STATUS_DEPLOYING, STATUS_DEPLOYED]

