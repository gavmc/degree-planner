function StatusIndicator({ connected }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-1.5 h-1.5 rounded-full ${
        connected ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      <span className="text-xs text-gray-500">
        {connected ? 'online' : 'offline'}
      </span>
    </div>
  );
}

export default StatusIndicator;