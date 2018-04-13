#!/usr/bin/env python3
""" """

import sqlite3
import b_constants as const  # pylint: disable=W0614,W0401


templates_list = [
    {
        "cores": 2,
        "id": 1,
        "memory": 1,
        "name": "small",
        "olin_resource_tpl": "medium"
    },
    {
        "cores": 2,
        "id": 2,
        "memory": 1,
        "name": "medium",
        "olin_resource_tpl": "medium"
    },
    {
        "cores": 2,
        "id": 3,
        "memory": 1,
        "name": "large",
        "olin_resource_tpl": "medium"
    }
]

conn = sqlite3.connect(const.DATABASE)
c = conn.cursor()

c.execute(''' DELETE FROM templates''')


for template in templates_list:
    c.execute('''INSERT INTO templates(name,memory,cores,olin_resource_tpl)
                  VALUES (?,?,?,?)''', (template['name'],template['memory'],template['cores'],template['olin_resource_tpl']))
#    print (template['name'])

conn.commit()

c.execute('SELECT * FROM templates')
print c.fetchall()

conn.close()