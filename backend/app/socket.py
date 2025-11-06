from flask import current_app
from flask_socketio import emit
import time

# Example: How to integrate with your LangGraph agent

def register_socket_handlers(socketio):
    
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
        emit('msg', {'data': 'Connected to server'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')
    
    @socketio.on('user_message')
    def handle_user_message(data):
        """
        Handle incoming user messages and route to LangGraph agent
        """
        user_message = data.get('message', '')
        print(f"Received message: {user_message}")
        
        # Notify frontend that agent is thinking
        emit('agent_thinking')
        
        try:
            # TODO: Call your LangGraph agent here
            # Example:
            # response = run_langgraph_agent(user_message)
            
            # For now, echo back as example
            response = f"Agent received: {user_message}"

            # Send response to frontend
            emit('agent_response', {
                'message': response
            })
            
        except Exception as e:
            print(f"Error: {e}")
            emit('error', {
                'message': f'An error occurred: {str(e)}'
            })
    
    @socketio.on('interrupt_response')
    def handle_interrupt_response(data):
        """
        Handle user responses to LangGraph interrupts
        """
        response = data.get('response', '')
        interrupt_id = data.get('interrupt_id', '')
        
        print(f"Interrupt response: {response}")
        
        # Notify frontend that agent is processing
        emit('agent_thinking')
        
        try:
            # TODO: Resume your LangGraph agent with the interrupt response
            # Example:
            # result = resume_langgraph_agent(interrupt_id, response)
            
            result = f"Agent resumed with: {response}"
            
            emit('agent_response', {
                'message': result
            })
            
        except Exception as e:
            print(f"Error: {e}")
            emit('error', {
                'message': f'An error occurred: {str(e)}'
            })


# Helper function to send interrupts from your LangGraph agent
def send_interrupt_to_frontend(socketio, message, options=None, interrupt_id=None):
    """
    Call this from your LangGraph agent when you need user input
    
    Args:
        socketio: The SocketIO instance
        message: The interrupt message to display
        options: Optional list of choices for the user
        interrupt_id: Optional ID to track this interrupt
    """
    socketio.emit('interrupt', {
        'message': message,
        'options': options,
        'id': interrupt_id
    })
