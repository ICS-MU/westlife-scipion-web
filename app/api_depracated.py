#!/usr/bin/env python
""" Main Scipion API file"""

import json
import os
import shutil
import re
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager
from passlib.apps import custom_app_context as pwd_context
from flask_httpauth import HTTPBasicAuth
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from flask import Flask, jsonify, abort, make_response, request, url_for, send_file, g, render_template


SCIPION_WORK_DIR = "/var/scipion/"
TODEPLOYDIR = SCIPION_WORK_DIR + "to_deploy/"
DEPLOYINGDIR = SCIPION_WORK_DIR + "deploying/"
DEPLOYEDDIR = SCIPION_WORK_DIR + "deployed/"
TODELETEDIR = SCIPION_WORK_DIR + "to_delete/"
WORKDIR = SCIPION_WORK_DIR + "workdir/"

FLAVORS_FILENAME = SCIPION_WORK_DIR + 'flavors.json'
IMAGES_FILENAME = SCIPION_WORK_DIR + 'images.json'

DATABASE_FILE = SCIPION_WORK_DIR + "deployments.json"
BASEDIR = os.path.abspath(os.path.dirname(__file__))


auth = HTTPBasicAuth()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASEDIR, 'data.sqlite')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'bla bla bla ble ble ble ha ha ha'

manager = Manager(app)
db = SQLAlchemy(app)

class User(db.Model):
    """ Class for users table"""
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64))
    name = db.Column(db.String(64))
    password_hash = db.Column(db.String(128))

    def hash_password(self, password):
        """Hash password"""
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """Verify password"""
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        """Generate auth token"""
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        """Verify auth token"""
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


def get_occi_resource(resource_id):
    """ Return list of occi resouces id from deployment log file. """
    list_of_resources = []
    log_path = WORKDIR + str(resource_id) + "/log.txt"
    if os.path.isfile(log_path):
        with open(log_path) as f_obj:
            lines = f_obj.readlines()
            for line in lines:
                list_from_line = re.findall(r'https://carach[0-9.]+ics.muni.cz:[0-9]+/[a-z]+/[0-9]+', line)
                for item in list_from_line:
                    if item not in list_of_resources:
                        list_of_resources.append(item)
    return list_of_resources

def get_vncpasswd(deployment_id):
    """Get VNC password from file."""
    path_to_vncpasswd = WORKDIR + str(deployment_id) + "/vncpasswd"
    vncpasswd = ""
    if os.path.isfile(path_to_vncpasswd):
        with open(path_to_vncpasswd) as f_vncpasswd:
            vncpasswd = f_vncpasswd.read()
    return vncpasswd

def init_deployment(deployment2i):
    """Init deployment."""
    path = TODEPLOYDIR + str(deployment2i['id']) + ".json"
    print path
    with open(path, 'w') as f_obj:
        json.dump(deployment2i, f_obj)

def deployment_details(deployment_2show):
    """Show deployment details."""
    with open(DATABASE_FILE, 'r') as f_obj:
        deployments = json.load(f_obj)
    deployment = [deployment for deployment in deployments if deployment['id'] == deployment_2show]
    if len(deployment) == 0:
        abort(404)
    deployment[0]['log'] = url_for('get_log', deployment_id=deployment_2show, _external=True)
    deployment[0]['sshkey'] = url_for('get_sshkey', deployment_id=deployment_2show, _external=True)
    deployment[0]['outputs'] = url_for('get_outputs', deployment_id=deployment_2show, _external=True)
    deployment[0]['occi_resources'] = get_occi_resource(deployment_2show)
    deployment[0]['vncpasswd'] = get_vncpasswd(deployment_2show)
    return deployment[0]


@app.route('/scipion/api/users', methods=['POST'])
@auth.login_required
def new_user():
    """Create new user"""
    email = request.json.get('email')
    password = request.json.get('password')
    if email is None or password is None:
        abort(400)  # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        abort(400)  # existing user
    user = User(email=email)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'email': user.email}), 201, {'Location': url_for('get_user', id=user.id, _external=True)}


@app.route('/scipion/api/users/<int:id>')
def get_user(user_id):
    """Get user's email."""
    user = User.query.get(user_id)
    if not user:
        abort(400)
    return jsonify({'email': user.email})


@app.route('/scipion/api/deployments/', methods=['GET'])
def get_deployments():
    """Get list of deployments."""
    with open(DATABASE_FILE, 'r') as f_obj:
        deployments = json.load(f_obj)
    return jsonify({'deployments': deployments})


@app.route('/scipion/api/deployments/<int:deployment_id>', methods=['GET'])
def get_deployment(deployment_id):
    """Get deployment json info. """
    return jsonify({'deployment': deployment_details(deployment_id)})


@app.route('/scipion/api/deployments/<int:deployment_id>/key', methods=['GET'])
@auth.login_required
def get_sshkey(deployment_id):
    """Get sshkey from file."""
    path_to_key = WORKDIR + str(deployment_id) + "/resources/ssh_cfy/id_rsa"
    if os.path.isfile(path_to_key):
        return send_file(WORKDIR + str(deployment_id) + "/resources/ssh_cfy/id_rsa", attachment_filename='id_rsa')
    else:
        return make_response(jsonify({'error': 'Not found'}), 404)


@app.route('/scipion/api/deployments/<int:deployment_id>/log', methods=['GET'])
def get_log(deployment_id):
    """Get log from file."""
    path_to_log = WORKDIR + str(deployment_id) + "/log.txt"
    if os.path.isfile(path_to_log):
        return send_file(WORKDIR + str(deployment_id) + "/log.txt", attachment_filename='log.txt')
    else:
        return make_response(jsonify({'error': 'Not found'}), 404)


@app.route('/scipion/api/deployments/<int:deployment_id>/outputs', methods=['GET'])
def get_outputs(deployment_id):
    """Get outputs from file."""
    path_to_outputs = WORKDIR + str(deployment_id) + "/outputs.json"
    if os.path.isfile(path_to_outputs):
        with open(path_to_outputs) as f_out:
            outputs = json.load(f_out)
        return jsonify(outputs)
    else:
        return make_response(jsonify({'error': 'Not found'}), 404)


@app.route('/scipion/api/deployments', methods=['POST'])
@auth.login_required
def create_deployment():
    """Create new deployment."""
    with open(DATABASE_FILE) as f_obj:
        deployments = json.load(f_obj)

    if not request.json or 'email' not in request.json:
        abort(400)
    deployment = {
        'id': deployments[-1]['id']+1,
        'email': request.json['email'],
        'status': 'deploying',
    }
    deployment['uri'] = url_for('get_deployment', deployment_id=deployment['id'], _external=True)
    init_deployment(deployment)

# update_database
    deployments.append(deployment)
    with open(DATABASE_FILE, 'w') as f_obj:
        json.dump(deployments, f_obj)
    return jsonify({'deployment': deployment}), 201


@app.route('/scipion/api/deployments/<int:deployment_id>', methods=['DELETE'])
def delete_deployment(deployment_id):
    """Delete deployment."""
    d_not_found = False
    if os.path.exists(DEPLOYEDDIR + str(deployment_id) + ".json"):
        shutil.move(DEPLOYEDDIR + str(deployment_id) + ".json", TODELETEDIR + str(deployment_id) + ".json")
    elif os.path.exists(DEPLOYINGDIR + str(deployment_id) + ".json"):
        shutil.move(DEPLOYINGDIR + str(deployment_id) + ".json", TODELETEDIR + str(deployment_id) + ".json")
    elif os.path.exists(TODEPLOYDIR + str(deployment_id) + ".json"):
        shutil.move(TODEPLOYDIR + str(deployment_id) + ".json", TODELETEDIR + str(deployment_id) + ".json")
    else:
        d_not_found = True

# Change status to deleting
    if d_not_found:
        abort(404)
    else:
        with open(DATABASE_FILE) as f_obj:
            deployments = json.load(f_obj)

        for deployment in deployments:
            if str(deployment['id']) == str(deployment_id):
                deployment['status'] = "deleting"

        with open(DATABASE_FILE, 'w') as f_obj:
            json.dump(deployments, f_obj)
        return jsonify({'result': True})


@app.route('/scipion/api/resources/flavors', methods=['GET'])
def get_flavors():
    """ Get json list of available flavors."""
    with open(FLAVORS_FILENAME, 'r') as f_obj:
        flavors = json.load(f_obj)
    return jsonify({'flavors': flavors})


@app.route('/scipion/api/resources/images', methods=['GET'])
def get_images():
    """ Get json list of available images."""
    with open(IMAGES_FILENAME, 'r') as f_obj:
        images = json.load(f_obj)
    return jsonify({'images': images})

@auth.verify_password
def verify_password(username_or_token, password):
    """ Verify password for user."""
    user = User.verify_auth_token(username_or_token)
    if not user:
        user = User.query.filter_by(email=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@app.route('/scipion/api/token')
@auth.login_required
def get_auth_token():
    """ Get token. """
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})

@auth.error_handler
def unauthorized():
    """Handler for auth error"""
    return make_response(jsonify({'error': 'Unauthorized access'}), 403)

@app.errorhandler(404)
def not_found(error):
    """Handler for 404"""
    return make_response(jsonify({'error': 'Not found.'}) , 404)

if __name__ == '__main__':
    # app.run(debug=True)
    # app.run(host='0.0.0.0')
    if not os.path.exists('data.sqlite'):
        db.create_all()
    manager.run()
