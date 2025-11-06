from app import create_app

application = create_app()

if __name__ == '__main__':
    application.socketio.run(application, host='127.0.0.1', port=5000, debug=True)