#!/usr/bin/env python3
""" """

import json
from b_constants import *  # pylint: disable=W0614,W0401

templates = [
    {
        "id": 1,
        "name": "small",
        "memory": 1,
        "cores": 2,
        "olin_resource_tpl": "medium"
    },
    {
        "id": 2,
        "name": "medium",
        "memory": 1,
        "cores": 2,
        "olin_resource_tpl": "medium"
    },
    {
        "id":3,
        "name": "large",
        "memory": 1,
        "cores": 2,
        "olin_resource_tpl": "medium"
    }
]


with open(TEMPLATES_FILE, 'w') as f_obj:
    json.dump(templates, f_obj)
