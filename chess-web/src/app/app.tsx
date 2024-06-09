// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePartySocket } from 'partysocket/react';
import { ChessBoard } from './chessboard';

import {
  Game,
  applyMove,
  createNewGame,
  getAllValidMoves,
  isStaleMate,
  toFen,
  toPieceNotionation,
} from 'chess';
import { useEffect } from 'react';

export function App() {
  useEffect(() => {
    let game: Game = createNewGame();
    const board: any = new ChessBoard('chessboard', {
      position: toFen(game),
      draggable: true,
      onDragStart: (dragStartSpot) => {
        if (game.toMove === 'black') {
          return false;
        }
        const piece = game.board[dragStartSpot];
        if (!piece) {
          return false;
        }
        if (piece.color !== game.toMove) {
          return false;
        }
        if (
          getAllValidMoves(game).filter(
            (move) => move.previousLocation === dragStartSpot
          ).length === 0
        ) {
          return false;
        }
      },
      onDrop: async (dragStartSpot, dropSpot) => {
        if (game.toMove === 'black') {
          return 'snapback';
        }
        const move = getAllValidMoves(game).find(
          (move) =>
            move.previousLocation === dragStartSpot &&
            move.newLocation === dropSpot
        );
        if (!move) {
          return 'snapback';
        }
        game = applyMove(game, move);
        if (move.isCastle || move.promotion || move.isEnPassant) {
          setPosition();
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const length = getAllValidMoves(game).length;
        if (length === 0) {
          if (isCheckMate(game)) {
            alert('Checkmate');
          } else if (isStaleMate(game)) {
            alert('Stalemate');
          }
          return;
        }
        const computerMove =
          getAllValidMoves(game)[Math.floor(Math.random() * length)];
        game = applyMove(game, computerMove);
        board.move(
          `${computerMove.previousLocation}-${computerMove.newLocation}`
        );
        if (
          computerMove.isCastle ||
          computerMove.promotion ||
          computerMove.isEnPassant
        ) {
          setPosition();
        }
        if (isCheckMate(game)) {
          alert('Checkmate');
        } else if (isStaleMate(game)) {
          alert('Stalemate');
        }
      },
      // onMoveEnd: () => {
      //   if (game.toMove === 'black') {
      //     const length = getAllValidMoves(game).length;
      //     const move =
      //       getAllValidMoves(game)[Math.floor(Math.random() * length)];
      //     game = applyMove(game, move);
      //     board.move(`${move.previousLocation}-${move.newLocation}`);
      //     if (move.isCastle || move.promotion || move.isEnPassant) {
      //       setPosition();
      //     }
      //   }
    });
    const setPosition = () => {
      const toChesbnoardJsPosition = () => {
        const newPosition: Record<string, string> = {};
        for (const [key, value] of Object.entries(game.board)) {
          newPosition[key] = `${
            value.color === 'white' ? 'w' : 'b'
          }${toPieceNotionation(value.type)}`;
        }
        return newPosition;
      };
      board.position(toChesbnoardJsPosition());
    };
  }, []);

  return (
    <div style={{ width: '864px' }}>
      <div id="chessboard" />
    </div>
  );
}

export default App;
