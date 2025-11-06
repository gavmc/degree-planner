import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import ChatContainer from './components/ChatContainer';

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  return (
    <div className="h-screen bg-[#0a0a0a]">
      <ChatContainer socket={socket} connected={connected} />
    </div>
  );
}

export default App;