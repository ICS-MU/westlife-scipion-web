#!/usr/bin/env python3
"""Deploy Scipion"""

import os
import json
import shutil
import sys
import logging.handlers
import random, string
import b_constants as const  # pylint: disable=W0614,W0401
import sqlite3



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
#    TODO with  get_deployment_info
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

def get_first_id_to_deploy ()
    """ Returns id of first deployment to be deployed. Returns 0 if nothing to deploy """
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("SELECT id FROM deployments WHERE status=?", (const.STATUS_TO_DEPLOY,))
        d_id = c.fetchone()
    if d_id <> None:
        return d_id[0]
    else:
        return None

def set_status (new_status, id_to_change_status):
    """ Change status in database for deployment id"""
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("UPDATE deployments set status= ? WHERE id = ?", (new_status, id_to_change_status,))

def get_deployment_info(id_to_get_info):
    """ """
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM deployments WHERE id = ?", (id_to_get_info,))
        data = c.fetchone()
    return data


def remove_files_after_failed_deployment(id_to_remove):
    """ """

def initialize_logging():
    # Set-up logging and start
    logger = logging.getLogger('Sci_Deploy')
    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    f = logging.handlers.RotatingFileHandler(const.DEPLOY_LOG_FILE, maxBytes=1000000, backupCount=3)
    f.setLevel((logging.DEBUG))
    f.setFormatter(formatter)
    logger.addHandler(f)

    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(formatter)
    logger.addHandler(ch)


def main():
    initialize_logging()
    logger.debug('Starting deploy.')

    deployment_id = get_first_id_to_deploy()
    if deployment_id <> None:
        logger.debug("Deploying %s", deployment_id)
        set_status( const.STATUS_DEPLOYING, deployment_id)
        deploy_scipion(deployment_id)
        if is_scipion_deployed(deployment_id):
            update_database_after_deployment(deployment_id)
            logger.debug("Scipion %s succesfully deployed.", deployment_id)
        else:
            logger.debug("Deployment %s failed", deployment_id)
            remove_files_after_failed_deployment(deployment_id)
            set_status(const.STATUS_TO_DEPLOY, deployment_id)

    else:
        logger.debug('Nothing to deploy.')


if __name__ == "__main__":
    main()


