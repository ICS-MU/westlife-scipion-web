#!flask/bin/python

import json

deployments = [
{
    'id':1,
    'email':'name@example.org',
    'status':'online',
    'olinip':'147.251.6.10',
    'sshkey':'toto je key',
},
{
    'id':2,
    'email':'surname@example.org',
    'status':'deploying',
    'olinip':'',
    'sshkey':'',
}
]

filename = 'deployments.json'
with open(filename, 'w') as f_obj:
    json.dump(deployments, f_obj)
