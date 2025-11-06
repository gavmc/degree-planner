import { useState } from 'react';

function ChatInput({ onSendMessage, disabled, hasInterrupt }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg focus-within:border-gray-700 transition-colors">
          <button
            type="button"
            className="pl-4 text-gray-500 hover:text-gray-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              hasInterrupt 
                ? "Please respond to the interrupt above..." 
                : disabled 
                  ? "Waiting for agent..." 
                  : "Send a Message"
            }
            disabled={disabled && !hasInterrupt}
            rows={1}
            className="flex-1 px-4 py-3 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none disabled:cursor-not-allowed text-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`pr-4 transition-colors ${
              disabled || !input.trim()
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <p className="text-xs text-gray-600">
            LLMs can make mistakes. Verify important information.
          </p>
          <button className="ml-2 text-gray-600 hover:text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;