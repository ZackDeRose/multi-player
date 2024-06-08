// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { usePartySocket } from 'partysocket/react';
import { ChessBoard } from './chessboard';

import NxWelcome from './nx-welcome';
import { useEffect } from 'react';

const Party = () => {
  const ws = usePartySocket({
    // usePartySocket takes the same arguments as PartySocket.
    host: 'localhost:1999', // or localhost:1999 in dev
    room: 'my-room',

    // in addition, you can provide socket lifecycle event handlers
    // (equivalent to using ws.addEventListener in an effect hook)
    onOpen(event) {
      console.log('connected');
      console.log(event.target);
      ws.send(JSON.stringify({ type: 'new game' }));
    },
    onMessage(e) {
      console.log('message', e.data);
    },
    onClose() {
      console.log('closed');
    },
    onError(e) {
      console.log('error');
    },
  });
  return <></>;
};

export function App() {
  useEffect(() => {
    const board = new ChessBoard('chessboard', 'start');
  }, []);

  return (
    <div>
      <div id="chessboard" />
    </div>
  );
}

export default App;
