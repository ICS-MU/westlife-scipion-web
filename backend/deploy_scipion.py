#!/usr/bin/env python3
"""Deploy Scipion"""

import os
import json
import shutil
import sys
import logging.handlers
import random, string
from b_constants import *  # pylint: disable=W0614,W0401

deploy_attempts = 3

def get_random_passwd():
    """Generate and return random string."""
    N = 8
    result = ""
    for i in range(N):
        result += random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits)
    return result

def get_resource_tpl(size):
    """Return template size for defined size"""
    with open(TEMPLATES_FILE, 'r') as f_obj:
        templates = json.load(f_obj)
    resource_tpl = [temp['olin_resource_tpl'] for temp in templates if temp['name'] == size][0]
    return resource_tpl


def set_vnc_password(id_to_set_pwd):
    """Set password for vnc and template size"""
    passwd_file = DEPLOYMENTS_DIR + id_to_set_pwd + "/vncpasswd"
    replace_file = DEPLOYMENTS_DIR + id_to_set_pwd + "/scipion-inputs.yaml.m4"
    # Set vnc passwd
    if not os.path.exists(passwd_file):
        logger.debug("Setting VNC password.")
        passwd = get_random_passwd()
        with open(replace_file) as f:
            newText = f.read().replace(VNC_PASSWORD_PLACEHOLDER, passwd)

        with open(replace_file, "w") as f:
            f.write(newText)

        with open(passwd_file, "w") as f:
            f.write(passwd)

    else:
        logger.debug("VNC password already present.")


def set_template_size(id_to_set_size, size_to_be_set):
    """Setting deployment size."""
    logger.debug("Setting deployment size")
    replace_file = DEPLOYMENTS_DIR + id_to_set_size + "/scipion-inputs.yaml.m4"
    with open(replace_file, "r") as f_obj:
        newText = f_obj.read().replace(OLIN_RESOURCE_TPL_PLACEHOLDER, get_resource_tpl(size_to_be_set))
    with open(replace_file, "w") as f_obj:
        f_obj.write(newText)

def deploy_scipion(id_to_deploy):
    """Deploy Scipion"""
    THIS_SCI_DIR = DEPLOYMENTS_DIR + id_to_deploy
    with open(DATABASE_FILE, 'r') as f_obj:
        deployments = json.load(f_obj)
    deployment = [dep for dep in deployments if dep['id'] == int(id_to_deploy)][0]

    try:
        shutil.copytree(TEMPLATE_DIR, THIS_SCI_DIR)
    except:
        logger.error("Error creating directory: %s", THIS_SCI_DIR)
        sys.exit(1)
    set_vnc_password(id_to_deploy)

    size = deployment['size']
    set_template_size(id_to_deploy, size)
    os_result = os.system("/bin/bash /var/scipion/backend/deploy_scipion.sh " + id_to_deploy)
    logger.debug("Return value is: %s", str(os_result))
    logger.debug("Updating records for %s", id_to_deploy)


def get_endpoint(id_for_output):
    """Returns endpoint retrieved from outputs.json file."""
    output_filename = DEPLOYMENTS_DIR + str(id_for_output) + "/outputs.json"
    try:
        with open(output_filename) as f_out:
            outputs = json.load(f_out)
    except IOError as e:
        logger.error("Error openning file: %s", output_filename)
        sys.exit(1)
    else:
        return outputs["web_endpoint"]["url"]


def get_key(id_for_key):
    """Returns ssh key."""
    key_filename = DEPLOYMENTS_DIR + str(id_for_key) + "/resources/ssh_cfy/id_rsa"
    try:
        with open(key_filename, 'r') as keyfile:
            data = keyfile.read()
    except IOError as e:
        logger.error("Error openning file: %s", key_filename)
        sys.exit(1)
    return data


def clean_up_files(id_to_deploy):
    """ Clean up files."""
    logger.debug('Reading_database')
    with open(DATABASE_FILE, 'r') as f_obj:
        deployments = json.load(f_obj)
    logger.debug("Changing_record %s", id_to_deploy)
    for deployment in deployments:
        if str(deployment['id']) == str(id_to_deploy):
            logger.debug('Changing status')
            deployment['status'] = STATUS_DEPLOYED

    logger.debug('Writing_database.')
    with open(DATABASE_FILE, 'w') as f_obj:
        json.dump(deployments, f_obj)
    logger.debug('Moving file to deployed.')
    shutil.move(DEPLOYING_DIR + id_to_deploy + ".json", DEPLOYED_DIR + id_to_deploy + ".json")


def is_scipion_deployed(id_to_deploy):
    """Is scipion deployed?"""
    return True


# Set-up logging and start
logger = logging.getLogger('Sci_Deploy')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

f = logging.handlers.RotatingFileHandler(DEPLOY_LOG_FILE, maxBytes=1000000, backupCount=3)
f.setLevel((logging.DEBUG))
f.setFormatter(formatter)
logger.addHandler(f)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

logger.debug('Starting deploy.')

if os.listdir(TO_DEPLOY_DIR):
    filename = os.listdir(TO_DEPLOY_DIR)[0]
    deployment_id = os.path.splitext(filename)[0]

    shutil.move(TO_DEPLOY_DIR + filename, DEPLOYING_DIR + filename)
    logger.debug("Deploying %s", filename)

    while deploy_attempts > 0:
        logger.debug("Remaining deploy attempts: %s", str(deploy_attempts))
        deploy_scipion(deployment_id)
        deploy_attempts -= 1
        if is_scipion_deployed(deployment_id):
            logger.debug("Scipion %s succesfully deployed.", deployment_id)
            clean_up_files(deployment_id)
            break
        elif deploy_attempts == 0:
            logger.error("All deploy attempts have failed.")
        else:
            logger.debug("Scipion " + deployment_id + " deployment failed. Remaining " + str(deploy_attempts) + " attempts.")

# TODO: if failed remove directory

else:
    logger.debug('Nothing to deploy.')
