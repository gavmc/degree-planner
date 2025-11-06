from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from app.api import bp
from app.socket import register_socket_handlers

def create_app():
    app = Flask(__name__)

    CORS(app, origins="*")
    socketio = SocketIO(app, cors_allowed_origins="*")

    app.register_blueprint(bp)
    
    register_socket_handlers(socketio)
    
    app.socketio = socketio
    return app