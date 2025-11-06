import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import StatusIndicator from './StatusIndicator';

function ChatContainer({ socket, connected }) {
  const [messages, setMessages] = useState([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [interruptData, setInterruptData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Handle agent responses
    socket.on('agent_response', (data) => {
      setIsAgentTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'agent',
        content: data.message,
        timestamp: new Date()
      }]);
    });

    // Handle interrupts from LangGraph
    socket.on('interrupt', (data) => {
      setIsAgentTyping(false);
      setInterruptData(data);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'interrupt',
        content: data.message || 'Agent needs input',
        data: data,
        timestamp: new Date()
      }]);
    });

    // Handle agent thinking/processing
    socket.on('agent_thinking', () => {
      setIsAgentTyping(true);
    });

    // Handle errors
    socket.on('error', (data) => {
      setIsAgentTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        content: data.message || 'An error occurred',
        timestamp: new Date()
      }]);
    });

    return () => {
      socket.off('agent_response');
      socket.off('interrupt');
      socket.off('agent_thinking');
      socket.off('error');
    };
  }, [socket]);

  const sendMessage = (message) => {
    if (!socket || !connected) return;

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);

    // Send to backend
    socket.emit('user_message', { message });
    setIsAgentTyping(true);
  };

  const handleInterruptResponse = (response) => {
    if (!socket || !connected) return;

    socket.emit('interrupt_response', { 
      response,
      interrupt_id: interruptData?.id 
    });
    
    setInterruptData(null);
    setIsAgentTyping(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-medium text-gray-100">qwen3:8b</h1>
            <StatusIndicator connected={connected} />
          </div>
          <button className="text-gray-400 hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-base">Start a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  onInterruptResponse={message.type === 'interrupt' ? handleInterruptResponse : null}
                />
              ))}
              {isAgentTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-medium flex-shrink-0">
                    AI
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-5/6"></div>
                    <div className="h-3 bg-gray-800 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <ChatInput 
            onSendMessage={sendMessage} 
            disabled={!connected || isAgentTyping}
            hasInterrupt={!!interruptData}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;