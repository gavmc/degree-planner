from flask import Flask
from flask_cors import CORS
from app.api import bp

def create_app():
    app = Flask(__name__)

    CORS(app, origins="*")

    app.register_blueprint(bp)

    return app