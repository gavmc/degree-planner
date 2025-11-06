from flask import current_app
from flask_socketio import SocketIO, emit

@current_app.socketio.on('connect')
def handle_connect():
    emit('msg', {'data': 'connected'})