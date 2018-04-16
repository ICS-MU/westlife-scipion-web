#!/usr/bin/env python3
"""Undeploy and delete deployments."""

import os
import shutil
import logging.handlers
import b_constants as const
import sqlite3


def get_first_id_to_undeploy ():
    """ Returns id of first deployment to be un-deployed. Returns 0 if nothing to un-deploy """
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("SELECT id FROM deployments WHERE status=?",
                  (const.STATUS_TO_UNDEPLOY,))
        un_d_id = c.fetchone()
    conn.close()

    if un_d_id <> None:
        return un_d_id[0]
    else:
        return None


def un_deploy_scipion(id_to_delete):
    """ Starts un-deploy process. """
    logger.debug("Starting undeploy")
    os_result = os.system("/bin/bash /var/scipion/backend/undeploy_scipion.sh " + id_to_delete)
    logger.debug('Return value is: %s', str(os_result))


def is_scipion_deleted(id_to_delete):
    """ Returns result of un-deployment process. """
    ok_result_string = "CFY <local> 'uninstall' workflow execution succeeded"
    result_file = const.DEPLOYMENTS_DIR + id_to_delete + "/undelete_log.txt"

    try:
        result_string = open(result_file).read()
    except IOError:
        logger.warning('Error openning %s', result_file)
        return False
    return bool(ok_result_string in result_string)


def set_status (new_status, id_to_change_status):
    """ Change status in database for deployment id"""
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("UPDATE deployments set status= ? WHERE id = ?",
                  (new_status, id_to_change_status,))
    conn.close()

# Set-up logging and start
logger = logging.getLogger('Sci_Un_deploy')
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

f = logging.handlers.RotatingFileHandler(const.UN_DEPLOY_LOG_FILE, maxBytes=1000000, backupCount=3)
f.setLevel((logging.DEBUG))
f.setFormatter(formatter)
logger.addHandler(f)

ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch)

logger.debug('Starting undeploy.')

deployment_id = get_first_id_to_undeploy()
if deployment_id <> None:

    logger.debug('Un-deploying %s', deployment_id)
    set_status(const.STATUS_UNDEPLOYING, deployment_id)
    un_deploy_scipion(deployment_id)

    if is_scipion_deleted(deployment_id):
        logger.debug("Scipion %s successfully undeployed.", deployment_id)
        shutil.move(const.DEPLOYMENTS_DIR + deployment_id, const.DEPLOYMENTS_DIR + "deleted/")
        set_status(const.STATUS_UNDEPLOYED, deployment_id)
    else:
         logger.debug("Scipion %s undeployment failed.", deployment_id)
else:
    logger.debug('Nothing to undeploy.')
