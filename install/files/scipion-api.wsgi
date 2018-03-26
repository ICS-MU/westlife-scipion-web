#!/usr/bin/python
activate_this='/var/www/scipion-api/venv/bin/activate_this.py'
execfile(activate_this,dict(__file__=activate_this))

import sys
sys.path.insert(0,"/var/www/scipion-api")

from api import app as application
