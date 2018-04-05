from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_restful import Api
from flask_jwt_simple import ( JWTManager, create_jwt )
from datetime import timedelta
# disable CORS on production environment later ...
from flask_cors import CORS
from api.users import IdentityResource
from api.deployments import Deployments, Deployment, DeploymentLog

def get_app():
    app = Flask(__name__, static_url_path="", static_folder="frontend")

    # trailing slashes accepted
    app.url_map.strict_slashes = False

    # Api wrapper over the Flask app with prefix "/api"
    api = Api(app, "/api")

    # Cross origin resource sharing - disable in production env.
    CORS(app)

    # Setup the Flask-JWT-Simple extension
    app.config['JWT_SECRET_KEY'] = "super_secret_scipion_cloudify_web_jwt_key"
    app.config['JWT_EXPIRES'] = timedelta(days=1)
    jwt = JWTManager(app)

    # change JWT default error messages
    @jwt.expired_token_loader
    def my_expired_token_callback():
        return jsonify({ "message": "Access token expired, please login" }), 401

    @jwt.invalid_token_loader
    def my_invalid_token_callback(reason):
        return jsonify({ "message": "Access token invalid: " + reason }), 401

    @jwt.unauthorized_loader
    def my_unauthorized_token_callback(reason):
        return jsonify({ "message": "Unauthorized: " + reason }), 401    

    
    # Serve React App
    @app.route("/", defaults={'e': None})
    # handle all routes (except API) by react
    @app.errorhandler(404)
    def react_index(e):
        return app.send_static_file('index.html')


    # API routes bellow
    @app.route("/api/authenticate")
    def authenticate():
        try:
            #name = request.environ['MELLON_name']
            name = bytearray(request.environ['MELLON_name'], 'iso-8859-1').decode('utf-8')
            email = request.environ['MELLON_mail']
            id = request.environ['MELLON_eduPersonUniqueId']
        except:
            return "No Shibboleth data. This page should not be accessed directly!"
        return render_template(
            "store_jwt.html", token=create_jwt(identity = {
                "id": id, "name": name, "email": email
            })
        )

    @app.route("/api/development/authenticate")
    def authenticate_dev():
        name = "Tom Bombadil"
        email = "tom@bombadil.com"
        id = "some_shibboleth_id_of_the_user"

        return jsonify({ 
            "token": create_jwt(identity={ "id": id, "name": name, "email": email }) 
        })

    # current user identity
    api.add_resource(IdentityResource, "/users/me")

    # deployments
    api.add_resource(Deployments, "/deployments")
    api.add_resource(Deployment, "/deployments/<int:deployment_id>")
    api.add_resource(DeploymentLog, "/deployments/<int:deployment_id>/log")

    return app    


if __name__ == "__main__":
    get_app().run(debug=True, threaded=True)
