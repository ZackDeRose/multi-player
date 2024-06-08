import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { Chessground } from 'chessground';
import { createNewGame, toFen } from 'chess';

// const config = {
//   fen: toFen(createNewGame()),
// };
// console.log(config);
// const ground = Chessground(document.body, config);
// ground.redrawAll();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
