function ChatMessage({ message, onInterruptResponse }) {
  const isUser = message.type === 'user';
  const isInterrupt = message.type === 'interrupt';
  const isError = message.type === 'error';

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isInterrupt) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          ⚠
        </div>
        <div className="flex-1">
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-amber-400 font-medium text-sm">Action Required</span>
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">{message.content}</p>
            
            {message.data?.options && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-2">Please choose an option:</p>
                <div className="flex flex-wrap gap-2">
                  {message.data.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => onInterruptResponse?.(option)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!message.data?.options && onInterruptResponse && (
              <button
                onClick={() => onInterruptResponse('continue')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          ✕
        </div>
        <div className="flex-1">
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-red-400 font-medium text-sm">Error</span>
              <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
            </div>
            <p className="text-gray-300 text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="flex flex-col items-end">
            <div className="bg-gray-800 rounded-lg px-4 py-2.5">
              <p className="text-gray-100 text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <span className="text-xs text-gray-600 mt-1 px-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-medium flex-shrink-0">
        AI
      </div>
      <div className="flex-1">
        <div className="text-gray-200 text-sm leading-relaxed">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="text-xs text-gray-600 mt-2 inline-block">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;