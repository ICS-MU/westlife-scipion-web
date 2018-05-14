#!/usr/bin/python
""" CLI utility, shows OCCI resources and Deployment details. Python 2.7 only."""

import subprocess
import os
import b_constants as const
import sqlite3

OCCI_COMMAND = "/usr/local/bin/occi_list "


def get_info_from_database(resource_id):
    """Get details from database."""

    conn = sqlite3.connect(const.DATABASE)
    with conn:
        c = conn.cursor()
        c.execute("SELECT olinip, status, modified, user_id FROM deployments WHERE id=?", (int(resource_id),))
#        c.execute('SELECT olinip, status, modified, user_id FROM deployments WHERE id="%s"'  % (resource_id,))
        d_id = c.fetchone()
    conn.close()
    return d_id

def get_list_of_resource(type):
    """Return list of available resources"""

    command = OCCI_COMMAND + type
    de_result = subprocess.check_output(command, shell=True)
    occi_out = de_result
    list_of_lines = [line.strip() for line in occi_out.splitlines()]
    return list_of_lines

def get_deployment_id_for_occi_id(occi_id):
    """Return deployment ID."""
    for dir in os.listdir(const.DEPLOYMENTS_DIR):

        with open(const.DEPLOYMENTS_DIR + dir + "/log.txt", 'r') as logfile:
            if str(occi_id) in logfile.read():
                return str(dir)
    return None

def show_resources (resources):
    """ List retrieved information."""
    print ('')
    print ('{0:50} {1:5} {2:30} {3:11} {4:20} {5:10}'.format("OCCI resource", "Id", "Endpoint", "Status", "Modified",
                                                             "User id"))
    for resource in resources:
        id = str(get_deployment_id_for_occi_id(resource))
        from_database = get_info_from_database(int(id))
        olinip, status, modified, user_id = from_database
        datum = str(modified).split(".")[0]
        print ('{0:50} {1:5} {2:30} {3:11} {4:20} {5:10}'.format(resource, id, olinip, status, datum, user_id))

def main():
    for res_type in ["compute", "storage"]:
        res_items = get_list_of_resource(res_type)
        show_resources(res_items)

if __name__ == "__main__":
    main()

