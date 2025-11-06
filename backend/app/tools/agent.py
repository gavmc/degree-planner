from langgraph.graph import StateGraph
from typing import TypedDict
from flask import current_app
from app.socket import send_interrupt_to_frontend

class AgentState(TypedDict):
    messages: list
    user_input: str
    
def agent_node(state: AgentState):
    # Do some processing
    
    # If you need user input:
    socketio = current_app.socketio
    send_interrupt_to_frontend(
        socketio,
        message="Which course would you like to add?",
        options=["CS 3521", "CS 3541", "CS 3901"],
        interrupt_id="course_selection_123"
    )
    
    # The graph will pause here until interrupt_response is received
    return state

# Build your graph
graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
# ... add more nodes and edges