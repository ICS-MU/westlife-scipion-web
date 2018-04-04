#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/scipion-cloudify-web/")

from app_entry import get_app
application=get_app()
application.secret_key = "your-application-secret-key"
