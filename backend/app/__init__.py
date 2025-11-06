from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from app.api import bp

def create_app():
    app = Flask(__name__)

    CORS(app, origins="*")
    app.socketio = SocketIO(app, cors_allowed_origins="*")

    app.register_blueprint(bp)

    return app