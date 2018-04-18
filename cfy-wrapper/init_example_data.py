#!/usr/bin/env python3
"""Insert demo data to database."""

import sqlite3
import b_constants as const


deployments_list = [
    {
        "id": 1,
        "user_id": "some_shibboleth_id_of_the_user",
        "name": "Project X",
        "status": "deploying",
        "modified": "2018-04-03T13:00:00",
        "data_url": "http://www.example.com",
        "template_id": 1,
        "days_duration": 5
    },
    {
        "id": 2,
        "user_id": "some_shibboleth_id_of_the_user",
        "name": "Project Y",
        "status": "to_deploy",
        "modified": "2018-04-03T13:00:00",
        "data_url": "http://www.example.com",
        "template_id": 1,
        "days_duration": 5
    }

]


conn = sqlite3.connect(const.DATABASE)
c = conn.cursor()

c.execute(''' DELETE FROM deployments''')


for deployment in deployments_list:
    c.execute('''INSERT INTO deployments (id,user_id,name,status,data_url,template_id)
                  VALUES (?,?,?,?,?,?)''', (deployment['id'], deployment['user_id'], deployment['name'],
                                          deployment['status'], deployment['data_url'], deployment['template_id']))

conn.commit()

c.execute('SELECT * FROM templates')
print c.fetchall()

conn.close()