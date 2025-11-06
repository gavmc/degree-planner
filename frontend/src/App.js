import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:5000');
    newSocket.on('interrupt', (data) => {
      console.log(data);
    })
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);


  return (
    <p>hi!</p>
  );
}

export default App;
