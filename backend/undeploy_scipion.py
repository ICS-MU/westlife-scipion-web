#!/usr/bin/env python3
"""Undeploy and delete deployments."""

import os
import json
import shutil
import logging.handlers
from b_constants import *  # pylint: disable=W0614,W0401

UNDELETE_ATTEMPTS = 3


def un_deploy_scipion(id_to_delete):
    """ Starts un-deploy process. """
    logger.debug("Starting undeploy for : %s", str(UNDELETE_ATTEMPTS))
    os_result = os.system("/bin/bash /var/scipion/backend/undeploy_scipion.sh " + id_to_delete)
#    logger.debug('Return value is: ' + str(os_result))
    logger.debug('Return value is: %s', str(os_result))


def is_scipion_deleted(id_to_delete):
    """ Returns result of un-deployment process. """
    ok_result_string = "CFY <local> 'uninstall' workflow execution succeeded"
    result_file = DEPLOYMENTS_DIR + id_to_delete + "/undelete_log.txt"

    try:
        result_string = open(result_file).read()
    except IOError:
        logger.warning('Error openning %s', result_file)
        return False
    return bool(ok_result_string in result_string)
#    if ok_result_string in result_string:
#        return True
#    else:
#        return False


def clean_up_files(deleted_filename):
    """ Changes records in database, moves files to appropriate folders."""
    deleted_id = os.path.splitext(deleted_filename)[0]
    shutil.move(DELETING_DIR + deleted_filename, DELETED_DIR + deleted_filename)
    shutil.move(DEPLOYMENTS_DIR + deleted_id, DEPLOYMENTS_DIR + "deleted/")

    logger.debug('Reading_database')
    with open(DATABASE_FILE, 'r') as f_obj:
        deployments = json.load(f_obj)
    logger.debug("Changing_record %s", deleted_id)
    for deployment in deployments:
        if str(deployment['id']) == str(deleted_id):
            deployment['status'] = "deleted"
    logger.debug('Writing_database.')
    with open(DATABASE_FILE, 'w') as f_obj:
        json.dump(deployments, f_obj)


# Set-up logging and start
logger = logging.getLogger('Sci_Un_deploy')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

f = logging.handlers.RotatingFileHandler(UN_DEPLOY_LOG_FILE, maxBytes=1000000, backupCount=3)
f.setLevel((logging.DEBUG))
f.setFormatter(formatter)
logger.addHandler(f)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

logger.debug('Starting undeploy.')

if os.listdir(TO_DELETE_DIR):
    filename = os.listdir(TO_DELETE_DIR)[0]
    deployment_id = os.path.splitext(filename)[0]

    shutil.move(TO_DELETE_DIR + filename, DELETING_DIR + filename)
    logger.debug('Un-deploying %s', deployment_id)

    while UNDELETE_ATTEMPTS > 0:
        logger.debug("Remaining undeploy attempts: %s", str(UNDELETE_ATTEMPTS))
        un_deploy_scipion(deployment_id)
        UNDELETE_ATTEMPTS -= 1
        if is_scipion_deleted(deployment_id):
            logger.debug("Scipion %s succesfully undeployed.", deployment_id)
            clean_up_files(filename)
            break
        elif UNDELETE_ATTEMPTS == 0:
            logger.error("All un-deploy attempts have failed.")
        else:

            logger.debug("Scipion %s undeployment failed. Remaining %s attempts.", deployment_id, str(UNDELETE_ATTEMPTS))


else:
    logger.debug('Nothing to undeploy.')
