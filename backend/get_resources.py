#!/usr/bin/env python3
""" Get info from site with occi"""

import subprocess
import json
from bconstants import *  # pylint: disable=W0614,W0401


OCCI_COMMON = "/usr/local/bin/occi --auth x509 --user-cred /tmp/x509up_u1000 --voms --o json "
# OCCI_ENDPOINT = "--endpoint https://nova3.ui.savba.sk:8787/occi1.1 "
OCCI_ENDPOINT = "--endpoint https://carach5.ics.muni.cz:11443 "

A_DESCRIBE = "--action describe "
A_LIST = "--action list "


def describe_resource(resource):
    """ Vraci describe v json pro resource"""
    a_resource = "--resource " + resource
    command = OCCI_COMMON + OCCI_ENDPOINT + A_DESCRIBE + a_resource
    de_result = subprocess.check_output(command, shell=True)
    describe_json = json.loads(de_result)
    return describe_json


def list_resources(resource_type):
    """ Vraci list zdroju """
    described = []
    get_os_list_path = OCCI_COMMON + OCCI_ENDPOINT + A_LIST + "--resource " + resource_type
    output = subprocess.check_output(get_os_list_path, shell=True)
    resources_json = json.loads(output)
    for item in resources_json:
        described.append(describe_resource(item))
    return described


flavors = list_resources("resource_tpl")
images = list_resources("os_tpl")

with open(FLAVOURS_FILENAME, 'w') as flavor_f:
    json.dump(flavors, flavor_f)

with open(IMAGES_FILENAME, 'w') as images_f:
    json.dump(images, images_f)
