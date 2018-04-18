#!/usr/bin/env python3
"""Deploy Scipion"""

import os
import json
import shutil
import sys
import logging.handlers
import random, string
import b_constants as const
import sqlite3



def get_random_passwd():
    """Generate and return random string."""
    N = 8
    result = ""
    for i in range(N):
        result += random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits)
    return result

def get_resource_tpl(size):
    """Return template for defined size"""
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT olin_resource_tpl FROM templates WHERE name = ?", (size,))
        resource_tpl = c.fetchone()
    conn.close
    return resource_tpl

def set_vnc_password(id_to_set_pwd):
    """Set password for vnc and template size"""
    passwd_file = const.DEPLOYMENTS_DIR + str(id_to_set_pwd) + "/vncpasswd"
    replace_file = const.DEPLOYMENTS_DIR + str(id_to_set_pwd) + "/scipion-inputs.yaml.m4"
    # Set vnc passwd
    if not os.path.exists(passwd_file):
        logger.debug("Setting VNC password.")
        passwd = get_random_passwd()
        with open(replace_file) as f:
            newText = f.read().replace(const.VNC_PASSWORD_PLACEHOLDER, passwd)

        with open(replace_file, "w") as f:
            f.write(newText)

        with open(passwd_file, "w") as f:
            f.write(passwd)

    else:
        logger.debug("VNC password already present.")


def set_template_size(id_to_set_size, size_to_be_set):
    """Setting deployment size."""
    logger.debug("Setting deployment size")
    replace_file = const.DEPLOYMENTS_DIR + str(id_to_set_size) + "/scipion-inputs.yaml.m4"
    with open(replace_file, "r") as f_obj:
        newText = f_obj.read().replace(const.OLIN_RESOURCE_TPL_PLACEHOLDER, str(get_resource_tpl(size_to_be_set)))
    with open(replace_file, "w") as f_obj:
        f_obj.write(newText)

def deploy_scipion(id_to_deploy):
    """Deploy Scipion"""

    THIS_SCI_DIR = const.DEPLOYMENTS_DIR + str(id_to_deploy)
    deployment = get_deployment_info(id_to_deploy)

    try:
        shutil.copytree(const.TEMPLATE_DIR, THIS_SCI_DIR)
    except:
        logger.error("Error creating directory: %s", THIS_SCI_DIR)
        sys.exit(1)
    set_vnc_password(id_to_deploy)

    set_template_size(id_to_deploy, deployment['name'])
    os_result = os.system("/bin/bash " + const.SCRIPT_DIR + "deploy_scipion.sh " + str(id_to_deploy))
    logger.debug("Return value is: %s", str(os_result))
    logger.debug("Updating records for %s", id_to_deploy)
    return os_result

def get_endpoint(id_for_output):
    """Returns endpoint retrieved from outputs.json file."""
    output_filename = const.DEPLOYMENTS_DIR + str(id_for_output) + "/outputs.json"
    try:
        with open(output_filename) as f_out:
            outputs = json.load(f_out)
    except IOError as e:
        logger.error("Error openning file: %s", output_filename)
        sys.exit(1)
    else:
        return outputs["web_endpoint"]["url"]

def get_first_id_to_deploy ():
    """ Returns id of first deployment to be deployed. Returns 0 if nothing to deploy """
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("SELECT id FROM deployments WHERE status=?",
                  (const.STATUS_TO_DEPLOY,))
        d_id = c.fetchone()
    conn.close()

    if d_id is not None:
        return d_id[0]
    else:
        return None

def set_status (new_status, id_to_change_status):
    """ Change status in database for deployment id"""
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("UPDATE deployments set status= ? WHERE id = ?",
                  (new_status, id_to_change_status,))
    conn.close()

def get_deployment_info(id_to_get_info):
    """ """
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("SELECT * FROM deployments WHERE id = ?",
                  (id_to_get_info,))
        data = c.fetchone()
    conn.close()
    return data

def get_vnc_password (id_to_get_pwd):
    passwd_file = const.DEPLOYMENTS_DIR + str(id_to_get_pwd) + "/vncpasswd"

    try:
        with open(passwd_file, 'r') as pfile:
            data = pfile.read()
    except IOError as e:
        logger.error("Error openning file: %s", passwd_file)
        sys.exit(1)
    return data

def update_database_after_deployment(id_to_update):
    """ """
    status = const.STATUS_DEPLOYED
    vnc_password = get_vnc_password(id_to_update)
    olinip = get_endpoint(id_to_update)
    conn = sqlite3.connect(const.DATABASE)
    with conn:
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        c.execute("UPDATE deployments SET status = ? , vnc_password = ? , olinip = ? WHERE id = ?",
                  (status, vnc_password, olinip, id_to_update))
        data = c.fetchone()
    conn.close

def remove_files_after_failed_deployment(id_to_remove):
    """ """
    DIR_TO_REMOVE = const.DEPLOYMENTS_DIR + str(id_to_remove)

    if os.path.exists(DIR_TO_REMOVE + ".failed"):
        shutil.rmtree(DIR_TO_REMOVE + ".failed")
    shutil.move(DIR_TO_REMOVE, DIR_TO_REMOVE + ".failed")

def init_logs():
    global logger
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
    # Set-up logging and start
    init_logs()
    logger.debug('Starting deploy.')

    deployment_id = get_first_id_to_deploy()
    if deployment_id is not None:
        logger.debug("Deploying %s", deployment_id)
        set_status(const.STATUS_DEPLOYING, deployment_id)
        if deploy_scipion(deployment_id) == 0:
            update_database_after_deployment(deployment_id)
            logger.debug("Scipion %s succesfully deployed.", deployment_id)
        else:
            logger.debug("Deployment %s failed", deployment_id)
    # TODO: find and delete existing occi resources
            remove_files_after_failed_deployment(deployment_id)
            set_status(const.STATUS_TO_DEPLOY, deployment_id)

    else:
        logger.debug('Nothing to deploy.')


if __name__ == "__main__":
    main()


