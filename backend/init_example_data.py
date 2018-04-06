#!/usr/bin/env python3
""" """

import json
from bconstants import *  # pylint: disable=W0614,W0401

deployments = [
    {
        "id": 1,
        "user_id": "some_shibboleth_id_of_the_user",
        "name": "Project X",
        "status": "deploying",
        "modified": "2018-04-03T13:00:00",
        "data_url": "http://www.example.com",
        "size": "small",
        "days_duration": 5
    },
    {
        "id": 2,
        "user_id": "some_shibboleth_id_of_the_user",
        "name": "Project Y",
        "status": "deploying",
        "modified": "2018-04-03T13:00:00",
        "data_url": "http://www.example.com",
        "size": "medium",
        "days_duration": 5
    }

]

with open(DATABASE_FILENAME, 'w') as f_obj:
    json.dump(deployments, f_obj)
