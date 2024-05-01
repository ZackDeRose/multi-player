export type PieceType =
  | 'pawn'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'queen'
  | 'king';

export type Color = 'white' | 'black';

export type Piece = {
  type: PieceType;
  color: Color;
};

export const whitePawn: Piece = { type: 'pawn', color: 'white' };
export const whiteKnight: Piece = { type: 'knight', color: 'white' };
export const whiteBishop: Piece = { type: 'bishop', color: 'white' };
export const whiteRook: Piece = { type: 'rook', color: 'white' };
export const whiteQueen: Piece = { type: 'queen', color: 'white' };
export const whiteKing: Piece = { type: 'king', color: 'white' };
export const blackPawn: Piece = { type: 'pawn', color: 'black' };
export const blackKnight: Piece = { type: 'knight', color: 'black' };
export const blackBishop: Piece = { type: 'bishop', color: 'black' };
export const blackRook: Piece = { type: 'rook', color: 'black' };
export const blackQueen: Piece = { type: 'queen', color: 'black' };
export const blackKing: Piece = { type: 'king', color: 'black' };

export function pieceSymbol(piece: Piece) {
  switch (piece.type) {
    case 'pawn':
      return piece.color === 'white' ? '♙' : '♟';
    case 'knight':
      return piece.color === 'white' ? '♘' : '♞';
    case 'bishop':
      return piece.color === 'white' ? '♗' : '♝';
    case 'rook':
      return piece.color === 'white' ? '♖' : '♜';
    case 'queen':
      return piece.color === 'white' ? '♕' : '♛';
    case 'king':
      return piece.color === 'white' ? '♔' : '♚';
  }
}

export const boardRows = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
export type BoardRow = (typeof boardRows)[number];

export const boardColumns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export type BoardColumn = (typeof boardColumns)[number];

export type Square = `${BoardColumn}${BoardRow}`;

export type Board = { [key in Square]?: Piece };

export type Game = { board: Board; toMove: Color; history?: Move[] };

export function asString(board: Board): string {
  const rowLabels = `   a   b   c   d   e   f   g   h`;
  const horizontalLine = [`  `, `-`.repeat(31)].join('');
  const boardBuilder = [rowLabels];
  for (let i = 0; i < boardRows.length; i++) {
    const row = boardRows[7 - i];
    const rowLabel = `${row}`;
    const rowBuilder = [`${rowLabel} `];
    for (let j = 0; j < boardColumns.length; j++) {
      const column = boardColumns[j];
      const piece = board[`${column}${row}`];
      rowBuilder.push(piece ? ` ${pieceSymbol(piece)} ` : '   ');
      if (j < boardColumns.length - 1) {
        rowBuilder.push('|');
      }
    }
    rowBuilder.push(` ${rowLabel}`);
    boardBuilder.push(rowBuilder.join(''));
    if (i < boardRows.length - 1) {
      boardBuilder.push(horizontalLine);
    }
  }
  boardBuilder.push(rowLabels);
  return boardBuilder.join('\n');
}

export function createNewGame(): Game {
  return {
    board: {
      a1: { type: 'rook', color: 'white' },
      b1: { type: 'knight', color: 'white' },
      c1: { type: 'bishop', color: 'white' },
      d1: { type: 'queen', color: 'white' },
      e1: { type: 'king', color: 'white' },
      f1: { type: 'bishop', color: 'white' },
      g1: { type: 'knight', color: 'white' },
      h1: { type: 'rook', color: 'white' },
      a2: { type: 'pawn', color: 'white' },
      b2: { type: 'pawn', color: 'white' },
      c2: { type: 'pawn', color: 'white' },
      d2: { type: 'pawn', color: 'white' },
      e2: { type: 'pawn', color: 'white' },
      f2: { type: 'pawn', color: 'white' },
      g2: { type: 'pawn', color: 'white' },
      h2: { type: 'pawn', color: 'white' },
      a7: { type: 'pawn', color: 'black' },
      b7: { type: 'pawn', color: 'black' },
      c7: { type: 'pawn', color: 'black' },
      d7: { type: 'pawn', color: 'black' },
      e7: { type: 'pawn', color: 'black' },
      f7: { type: 'pawn', color: 'black' },
      g7: { type: 'pawn', color: 'black' },
      h7: { type: 'pawn', color: 'black' },
      a8: { type: 'rook', color: 'black' },
      b8: { type: 'knight', color: 'black' },
      c8: { type: 'bishop', color: 'black' },
      d8: { type: 'queen', color: 'black' },
      e8: { type: 'king', color: 'black' },
      f8: { type: 'bishop', color: 'black' },
      g8: { type: 'knight', color: 'black' },
      h8: { type: 'rook', color: 'black' },
    },
    toMove: 'white',
    history: [],
  };
}

export type Move = {
  piece: Piece;
  previousLocation: Square;
  newLocation: Square;
  isAttack: boolean;
  isCastle?: true;
  isEnPassant?: true;
  promotion?: PieceType;
};

export function isMoveValid(move: Move, game: Game): boolean {
  return true;
}

function getAllPieces(board: Board, color?: Color): [Piece, Square][] {
  return Object.entries(board)
    .filter(([square, piece]) => piece && (!color || piece.color === color))
    .map(([square, piece]) => [piece, square as Square]);
}

function isOccupied(square: Square, board: Board, color?: Color): boolean {
  const piece = board[square];
  if (!piece) {
    return false;
  }
  return !color || color === piece.color;
}

function parseSquare(square: Square): [BoardColumn, BoardRow] {
  return square.split('') as [BoardColumn, BoardRow];
}

function pawnMovement(square: Square, color: Color): Square | false {
  const [boardColumn, boardRow] = parseSquare(square);
  if (color === 'white' && boardRow === '7') {
    return false;
  }
  if (color === 'black' && boardRow === '2') {
    return false;
  }
  const newRow = (+boardRow +
    1 * (color === 'white' ? 1 : -1) +
    '') as BoardRow;
  return `${boardColumn}${newRow}`;
}

function pawnDoubleStart(square: Square, color: Color): Square {
  const [boardColumn, boardRow] = parseSquare(square);
  const newRow = (+boardRow +
    2 * (color === 'white' ? 1 : -1) +
    '') as BoardRow;
  return `${boardColumn}${newRow}`;
}

function pawnAttack(square: Square, color: Color): Square[] {
  const targets: Square[] = [];
  const [boardColumn, boardRow] = parseSquare(square);
  if (boardColumn !== 'a') {
    const oldColumnIndex = boardColumns.indexOf(boardColumn);
    const newColumn = boardColumns[oldColumnIndex - 1];
    targets.push(
      `${newColumn}${
        (+boardRow + (color === 'white' ? 1 : -1) + '') as BoardRow
      }`
    );
  }
  if (boardColumn !== 'h') {
    const oldColumnIndex = boardColumns.indexOf(boardColumn);
    const newColumn = boardColumns[oldColumnIndex + 1];
    targets.push(
      `${newColumn}${
        (+boardRow + (color === 'white' ? 1 : -1) + '') as BoardRow
      }`
    );
  }
  return targets;
}

function enPassantMovements(
  square: Square,
  toMove: Color,
  lastMove?: Move
): Square | false {
  if (!lastMove || lastMove.piece.type !== 'pawn') {
    return false;
  }
  if (toMove === 'white') {
    const attackTargets = pawnAttack(square, toMove);
    for (const attackTarget of attackTargets) {
      if (
        lastMove.newLocation[0] === attackTarget[0] &&
        lastMove.newLocation[1] === '5' &&
        lastMove.previousLocation[1] === '7' &&
        square[1] === '5'
      ) {
        return `${lastMove.newLocation[0] as BoardColumn}6`;
      }
    }
    return false;
  }
  if (toMove === 'black') {
    const attackTargets = pawnAttack(square, toMove);
    for (const attackTarget of attackTargets) {
      if (
        lastMove.newLocation[0] === attackTarget[0] &&
        lastMove.newLocation[1] === '4' &&
        lastMove.previousLocation[1] === '2' &&
        square[1] === '4'
      ) {
        return `${lastMove.newLocation[0] as BoardColumn}3`;
      }
    }
    return false;
  }
  return false;
}

function getPromotionOptions(
  square: Square,
  color: Color,
  board: Board
): Move[] {
  const piece = board[square];
  if (!piece) {
    return [];
  }
  if (color === 'white') {
    if (square[1] !== '7') {
      return [];
    }
    if (board[`${square[0] as BoardColumn}8`]) {
      return [];
    }
    return [
      {
        piece,
        newLocation: `${square[0] as BoardColumn}8`,
        previousLocation: square,
        isAttack: false,
        promotion: 'queen',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}8`,
        previousLocation: square,
        isAttack: false,
        promotion: 'rook',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}8`,
        previousLocation: square,
        isAttack: false,
        promotion: 'bishop',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}8`,
        previousLocation: square,
        isAttack: false,
        promotion: 'knight',
      },
    ];
  } else {
    if (square[1] !== '2') {
      return [];
    }
    if (board[`${square[0] as BoardColumn}1`]) {
      return [];
    }
    return [
      {
        piece,
        newLocation: `${square[0] as BoardColumn}1`,
        previousLocation: square,
        isAttack: false,
        promotion: 'queen',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}1`,
        previousLocation: square,
        isAttack: false,
        promotion: 'rook',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}1`,
        previousLocation: square,
        isAttack: false,
        promotion: 'bishop',
      },
      {
        piece,
        newLocation: `${square[0] as BoardColumn}1`,
        previousLocation: square,
        isAttack: false,
        promotion: 'knight',
      },
    ];
  }
}

function knightMovement(square: Square): Square[] {
  const targets: Square[] = [];
  const [boardColumn, boardRow] = parseSquare(square);
  const columnIndex = boardColumns.indexOf(boardColumn);
  const rowIndex = boardRows.indexOf(boardRow);
  const adjustmentPatterns: [number, number][] = [
    [1, 2],
    [1, -2],
    [-1, -2],
    [-1, 2],
    [2, 1],
    [2, -1],
    [-2, -1],
    [-2, 1],
  ];
  for (const [columnOffset, rowOffset] of adjustmentPatterns) {
    const newColumnIndex = columnIndex + columnOffset;
    const newRowIndex = rowIndex + rowOffset;
    if (
      newColumnIndex >= 0 &&
      newColumnIndex <= 7 &&
      newRowIndex >= 0 &&
      newColumnIndex <= 7
    ) {
      targets.push(`${boardColumns[newColumnIndex]}${boardRows[newRowIndex]}`);
    }
  }
  return targets;
}

function getOppositeColor(color: Color): Color {
  return color === 'white' ? 'black' : 'white';
}

type ContinuousMovementTrajectoryDefinition = [1 | -1 | 0, 1 | -1 | 0];

function continuousMovement(
  square: Square,
  board: Board,
  color: Color,
  possibleTrajectories: ContinuousMovementTrajectoryDefinition[]
): Move[] {
  const piece = board[square];
  if (!piece) {
    throw new Error('No piece found');
  }
  const moves: Move[] = [];
  for (const [columnOffset, rowOffset] of possibleTrajectories) {
    let curr = square;
    let stop = false;
    while (!stop) {
      const [boardColumn, boardRow] = parseSquare(curr);
      const newColumnIndex = boardColumns.indexOf(boardColumn) + columnOffset;
      const newRowIndex = boardRows.indexOf(boardRow) + rowOffset;
      if (
        newColumnIndex < 0 ||
        newColumnIndex > 7 ||
        newRowIndex < 0 ||
        newRowIndex > 7
      ) {
        stop = true;
      } else {
        curr =
          `${boardColumns[newColumnIndex]}${boardRows[newRowIndex]}` as Square;
        if (!isOccupied(curr, board, color)) {
          moves.push({
            piece,
            newLocation: curr,
            previousLocation: square,
            isAttack: isOccupied(curr, board),
          });
        }
        if (isOccupied(curr, board)) {
          stop = true;
        }
      }
    }
  }
  return moves;
}

function getPossibleMovesForPawn(
  square: Square,
  board: Board,
  lastMove?: Move
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'pawn') {
    return 'validation error';
  }
  const moves: Move[] = [];
  const normalMovementTargetSpace = pawnMovement(square, piece.color);
  if (
    normalMovementTargetSpace &&
    !isOccupied(normalMovementTargetSpace, board)
  ) {
    moves.push({
      piece,
      newLocation: normalMovementTargetSpace,
      previousLocation: square,
      isAttack: false,
    });
    const [boardColumn, boardRow] = parseSquare(square);
    if (
      (boardRow === '2' && piece.color === 'white') ||
      (boardRow === '7' && piece.color === 'black')
    ) {
      const pawnDoubleStartTarget = pawnDoubleStart(square, piece.color);
      if (!isOccupied(pawnDoubleStartTarget, board)) {
        moves.push({
          piece,
          newLocation: pawnDoubleStartTarget,
          previousLocation: square,
          isAttack: false,
        });
      }
    }
  }
  const pawnAttackTargets = pawnAttack(square, piece.color);
  for (const pawnAttackTarget of pawnAttackTargets) {
    if (isOccupied(pawnAttackTarget, board, getOppositeColor(piece.color))) {
      if (
        (piece.color === 'white' && pawnAttackTarget[1] === '8') ||
        (piece.color === 'black' && pawnAttackTarget[1] === '1')
      ) {
        moves.push(
          {
            piece,
            newLocation: pawnAttackTarget,
            previousLocation: square,
            isAttack: true,
            promotion: 'queen',
          },
          {
            piece,
            newLocation: pawnAttackTarget,
            previousLocation: square,
            isAttack: true,
            promotion: 'rook',
          },
          {
            piece,
            newLocation: pawnAttackTarget,
            previousLocation: square,
            isAttack: true,
            promotion: 'bishop',
          },
          {
            piece,
            newLocation: pawnAttackTarget,
            previousLocation: square,
            isAttack: true,
            promotion: 'knight',
          }
        );
      } else {
        moves.push({
          piece,
          newLocation: pawnAttackTarget,
          previousLocation: square,
          isAttack: true,
        });
      }
    }
  }
  const enPassantMove = enPassantMovements(square, piece.color, lastMove);
  if (enPassantMove) {
    moves.push({
      piece,
      previousLocation: square,
      newLocation: enPassantMove,
      isAttack: true,
      isEnPassant: true,
    });
  }
  const promotionOptions = getPromotionOptions(square, piece.color, board);
  for (const promotionOption of promotionOptions) {
    moves.push(promotionOption);
  }

  return moves;
}
function getPossibleMovesForBishop(
  square: Square,
  board: Board
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'bishop') {
    return 'validation error';
  }
  const possibleTrajectories: ContinuousMovementTrajectoryDefinition[] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  return continuousMovement(square, board, piece.color, possibleTrajectories);
}
function getPossibleMovesForKnight(
  square: Square,
  board: Board
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'knight') {
    return 'validation error';
  }
  const moves: Move[] = [];
  const possibleLocations = knightMovement(square);
  for (const possibleLocation of possibleLocations) {
    if (!isOccupied(possibleLocation, board, piece.color)) {
      moves.push({
        piece,
        newLocation: possibleLocation,
        previousLocation: square,
        isAttack: isOccupied(possibleLocation, board),
      });
    }
  }
  return moves;
}
function getPossibleMovesForRook(
  square: Square,
  board: Board
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'rook') {
    return 'validation error';
  }
  const possibleTrajectories: ContinuousMovementTrajectoryDefinition[] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  return continuousMovement(square, board, piece.color, possibleTrajectories);
}
function getPossibleMovesForQueen(
  square: Square,
  board: Board
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'queen') {
    return 'validation error';
  }
  const possibleTrajectories: ContinuousMovementTrajectoryDefinition[] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  return continuousMovement(square, board, piece.color, possibleTrajectories);
}
function getPossibleMovesForKing(
  square: Square,
  board: Board
): Move[] | 'validation error' {
  const piece = board[square];
  if (!piece || piece.type !== 'king') {
    return 'validation error';
  }
  const moves: Move[] = [];
  const offsets: ContinuousMovementTrajectoryDefinition[] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const [boardColumn, boardRow] = parseSquare(square);
  const oldColumnIndex = boardColumns.indexOf(boardColumn);
  const oldRowIndex = boardRows.indexOf(boardRow);
  for (const [columnOffset, rowOffset] of offsets) {
    const newColumnIndex = oldColumnIndex + columnOffset;
    const newRowIndex = oldRowIndex + rowOffset;
    if (
      newColumnIndex < 0 ||
      newColumnIndex > 7 ||
      newRowIndex < 0 ||
      newRowIndex > 7
    ) {
      continue;
    }
    const newSquare =
      `${boardColumns[newColumnIndex]}${boardRows[newRowIndex]}` as Square;
    if (!isOccupied(newSquare, board, piece.color)) {
      moves.push({
        piece,
        newLocation: newSquare,
        previousLocation: square,
        isAttack: isOccupied(newSquare, board),
      });
    }
  }
  return moves;
}

function getPossibleMovesForPiece(
  piece: Piece,
  square: Square,
  board: Board,
  validateCheck = true,
  history?: Move[]
): Move[] | 'validation error' {
  let moves: Move[] | 'validation error';
  const lastMove = history?.[history.length - 1];
  // first get all moves regardless of whether the moving player is in check at the end
  switch (piece.type) {
    case 'pawn':
      moves = getPossibleMovesForPawn(square, board, lastMove);
      break;
    case 'bishop':
      moves = getPossibleMovesForBishop(square, board);
      break;
    case 'knight':
      moves = getPossibleMovesForKnight(square, board);
      break;
    case 'rook':
      moves = getPossibleMovesForRook(square, board);
      break;
    case 'queen':
      moves = getPossibleMovesForQueen(square, board);
      break;
    case 'king':
      moves = getPossibleMovesForKing(square, board);
      break;
  }
  if (moves === 'validation error') {
    return 'validation error';
  }
  // remove options where the moving player is in check by the move
  return validateCheck
    ? moves.filter(
        (move) =>
          !isAlreadyCheck(
            applyMove(
              { board, history: [...(history || [])], toMove: piece.color },
              move
            )
          )
      )
    : moves;
}

function getCastleMoves(game: Game): Move[] {
  // if king has moved, no castling
  if (
    game.history?.find(
      (move) => move.piece.type === 'king' && move.piece.color === game.toMove
    )
  ) {
    return [];
  }
  const castleMoves: Move[] = [];
  // left castle
  if (
    game.board[`e${game.toMove === 'white' ? '1' : '8'}`]?.type === 'king' &&
    game.board[`e${game.toMove === 'white' ? '1' : '8'}`]?.color ===
      game.toMove &&
    game.board[`a${game.toMove === 'white' ? '1' : '8'}`]?.type === 'rook' &&
    game.board[`a${game.toMove === 'white' ? '1' : '8'}`]?.color ===
      game.toMove &&
    game.history?.find(
      (move) =>
        move.previousLocation === (game.toMove === 'white' ? 'a1' : 'a8')
    ) === undefined &&
    game.board[`b${game.toMove === 'white' ? '1' : '8'}`] === undefined &&
    game.board[`c${game.toMove === 'white' ? '1' : '8'}`] === undefined &&
    game.board[`d${game.toMove === 'white' ? '1' : '8'}`] === undefined
  ) {
    const potentialGame = applyMove(game, {
      piece: game.toMove === 'white' ? whiteKing : blackKing,
      previousLocation: game.toMove === 'white' ? 'e1' : 'e8',
      newLocation: game.toMove === 'white' ? 'd1' : 'd8',
      isAttack: false,
    });
    if (!isAlreadyCheck(potentialGame)) {
      castleMoves.push({
        piece: game.toMove === 'white' ? whiteKing : blackKing,
        previousLocation: game.toMove === 'white' ? 'e1' : 'e8',
        newLocation: game.toMove === 'white' ? 'c1' : 'c8',
        isAttack: false,
        isCastle: true,
      });
    }
  }
  //right castle
  if (
    game.board[`e${game.toMove === 'white' ? '1' : '8'}`]?.type === 'king' &&
    game.board[`e${game.toMove === 'white' ? '1' : '8'}`]?.color ===
      game.toMove &&
    game.board[`h${game.toMove === 'white' ? '1' : '8'}`]?.type === 'rook' &&
    game.board[`h${game.toMove === 'white' ? '1' : '8'}`]?.color ===
      game.toMove &&
    game.history?.find(
      (move) =>
        move.previousLocation === (game.toMove === 'white' ? 'h1' : 'h8')
    ) === undefined &&
    game.board[`f${game.toMove === 'white' ? '1' : '8'}`] === undefined &&
    game.board[`g${game.toMove === 'white' ? '1' : '8'}`] === undefined
  ) {
    const potentialGame = applyMove(game, {
      piece: game.toMove === 'white' ? whiteKing : blackKing,
      previousLocation: game.toMove === 'white' ? 'e1' : 'e8',
      newLocation: game.toMove === 'white' ? 'f1' : 'f8',
      isAttack: false,
    });
    if (!isAlreadyCheck(potentialGame)) {
      castleMoves.push({
        piece: game.toMove === 'white' ? whiteKing : blackKing,
        previousLocation: game.toMove === 'white' ? 'e1' : 'e8',
        newLocation: game.toMove === 'white' ? 'g1' : 'g8',
        isAttack: false,
        isCastle: true,
      });
    }
  }
  return castleMoves;
}

export function getAllValidMoves(game: Game, validateCheck = true): Move[] {
  const moves: Move[] = [];
  const piecesToCheckForMoves = getAllPieces(game.board, game.toMove);
  for (const [piece, square] of piecesToCheckForMoves) {
    const pieceMoves = getPossibleMovesForPiece(
      piece,
      square,
      game.board,
      validateCheck,
      game.history
    );
    if (pieceMoves !== 'validation error') {
      for (const pieceMove of pieceMoves) {
        moves.push(pieceMove);
      }
    }
  }
  for (const castleMove of getCastleMoves(game)) {
    moves.push(castleMove);
  }
  return moves;
}

export function isCheck(game: Game, alreadyCheck = false): boolean {
  const possibleMoves = getAllValidMoves(
    alreadyCheck ? game : { ...game, toMove: getOppositeColor(game.toMove) },
    false
  );
  const targetKingLocation = Object.entries(game.board).find(
    ([_square, piece]) =>
      piece?.type === 'king' &&
      piece.color ===
        (alreadyCheck ? getOppositeColor(game.toMove) : game.toMove)
  )?.[0] as Square;
  for (const move of possibleMoves) {
    if (move.isAttack && move.newLocation === targetKingLocation) {
      return true;
    }
  }
  return false;
}

function isAlreadyCheck(game: Game): boolean {
  return isCheck(game, true);
}

export function applyMove(game: Game, move: Move): Game {
  const newBoard = { ...game.board };
  newBoard[move.newLocation] = move.promotion
    ? { type: move.promotion, color: move.piece.color }
    : move.piece;
  delete newBoard[move.previousLocation];
  if (move.isEnPassant) {
    const toDeleteColumn = move.newLocation[0];
    const toDeleteRow = move.newLocation[1] === '6' ? '5' : '4';
    delete newBoard[`${toDeleteColumn}${toDeleteRow}` as Square];
  }
  if (move.isCastle) {
    const oldRookColumn = move.newLocation[0] === 'c' ? 'a' : 'h';
    const oldRookRow = move.newLocation[1];
    const oldRookPosition = `${oldRookColumn}${oldRookRow}` as Square;
    delete newBoard[oldRookPosition];
    const newRookColumn = move.newLocation[0] === 'c' ? 'd' : 'f';
    const newRookPosition = `${newRookColumn}${oldRookRow}` as Square;
    newBoard[newRookPosition] =
      move.piece.color === 'white' ? whiteRook : blackRook;
  }
  return {
    board: newBoard,
    toMove: getOppositeColor(game.toMove),
    history: [...(game.history || []), move],
  };
}

export function isCheckMate(game: Game): boolean {
  if (!isCheck(game)) {
    return false;
  }
  const possibleMoves = getAllValidMoves(game);
  return possibleMoves.length === 0;
}

export function isStaleMate(game: Game): boolean {
  if (isCheck(game)) {
    return false;
  }
  const possibleMoves = getAllValidMoves(game);
  return possibleMoves.length === 0;
}
