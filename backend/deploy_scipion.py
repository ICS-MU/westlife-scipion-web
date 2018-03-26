#!/usr/bin/env python
"""Deploy Scipion"""

import os
import json
import shutil
import sys
import logging.handlers
from directories import *  # pylint: disable=W0614,W0401

deploy_attempts = 3


def deploy_scipion(id_to_deploy):
    """Deploy Scipion"""
    sci_dirname = WORK_DIRNAME + id_to_deploy
    try:
        os.mkdir(sci_dirname)
    except:
        logger.error("Error creating directory: %s", sci_dirname)
        sys.exit(1)
    os_result = os.system("/bin/bash /var/scipion/backend/deploy_scipion.sh " + id_to_deploy)
    logger.debug("Return value is: %s", str(os_result))
    logger.debug("Updating records for %s", id_to_deploy)


def get_endpoint(id_for_output):
    """Returns endpoint retrieved from outputs.json file."""
    output_filename = WORK_DIRNAME + str(id_for_output) + "/outputs.json"
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
    key_filename = WORK_DIRNAME + str(id_for_key) + "/resources/ssh_cfy/id_rsa"
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
    with open(DATABASE_FILENAME, 'r') as f_obj:
        deployments = json.load(f_obj)
    logger.debug("Changing_record %s", id_to_deploy)
    for deployment in deployments:
        if str(deployment['id']) == str(id_to_deploy):
            logger.debug('Changing status')
            deployment['status'] = "deployed"
            deployment['olinip'] = get_endpoint(id_to_deploy)

    logger.debug('Writing_database.')
    with open(DATABASE_FILENAME, 'w') as f_obj:
        json.dump(deployments, f_obj)
    logger.debug('Moving file to deployed.')
    shutil.move(DEPLOYING_DIRNAME + id_to_deploy + ".json", DEPLOYED_DIRNAME + id_to_deploy + ".json")


def is_scipion_deployed(id_to_deploy):
    """Is scipion deployed?"""
    return True


# Set-up logging and start
logger = logging.getLogger('Sci_Deploy')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

f = logging.handlers.RotatingFileHandler(DEPLOY_LOG_FILENAME, maxBytes=1000000, backupCount=3)
f.setLevel((logging.DEBUG))
f.setFormatter(formatter)
logger.addHandler(f)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

logger.debug('Starting deploy.')

if os.listdir(TO_DEPLOY_DIRNAME):
    filename = os.listdir(TO_DEPLOY_DIRNAME)[0]
    deployment_id = os.path.splitext(filename)[0]

    shutil.move(TO_DEPLOY_DIRNAME + filename, DEPLOYING_DIRNAME + filename)
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
