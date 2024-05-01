import {
  Game,
  Piece,
  Square,
  applyMove,
  asString,
  blackBishop,
  blackKing,
  blackKnight,
  blackPawn,
  blackQueen,
  blackRook,
  createNewGame,
  getAllValidMoves,
  isCheck,
  isCheckMate,
  whiteBishop,
  whiteKing,
  whiteKnight,
  whitePawn,
  whiteQueen,
  whiteRook,
} from './chess';

describe('chess', () => {
  test('fresh game has 20 valid moves', () => {
    const newGame = createNewGame();
    console.log(asString(newGame.board));
    expect(getAllValidMoves(newGame).length).toBe(20);
  });

  describe('movement', () => {
    function assertMovement(
      game: Game,
      targetPiece: Square,
      expectedMovements: Square[]
    ) {
      const validMovesForTarget = getAllValidMoves(game).filter(
        (move) => move.previousLocation === targetPiece
      );
      expect(validMovesForTarget.length).toBe(expectedMovements.length);
      for (const expectedMovement of expectedMovements) {
        console.log('expectedMovement', expectedMovement);
        expect(
          validMovesForTarget.find(
            (move) => move.newLocation === expectedMovement
          )
        ).toBeTruthy();
      }
    }
    describe('pawn', () => {
      test('pawn can move one or two spaces on first move - white', () => {
        const game: Game = {
          board: {
            a2: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a2', ['a3', 'a4']);
      });
      test('pawn can move one or two spaces on first move - black', () => {
        const game: Game = {
          board: {
            a7: blackPawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a7', ['a6', 'a5']);
      });
      test('pawn starting movement blocked hard - white', () => {
        const game: Game = {
          board: {
            a2: whitePawn,
            a3: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a2', []);
      });
      test('pawn starting movement blocked hard - black', () => {
        const game: Game = {
          board: {
            a7: blackPawn,
            a6: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a7', []);
      });
      test('starting movement blocked soft - white', () => {
        const game: Game = {
          board: {
            a2: whitePawn,
            a4: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a2', ['a3']);
      });
      test('starting movement blocked soft - black', () => {
        const game: Game = {
          board: {
            a7: blackPawn,
            a5: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a7', ['a6']);
      });
      test('normal movement - white', () => {
        const game: Game = {
          board: {
            a5: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a5', ['a6']);
      });
      test('normal movement - black', () => {
        const game: Game = {
          board: {
            a5: blackPawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a5', ['a4']);
      });
      test('normal movement blocked - white', () => {
        const game: Game = {
          board: {
            a5: whitePawn,
            a6: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a5', []);
      });
      test('normal movement blocked - black', () => {
        const game: Game = {
          board: {
            a5: blackPawn,
            a4: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a5', []);
      });
      test('attacking - white', () => {
        const game: Game = {
          board: {
            b5: whitePawn,
            a6: blackPawn,
            c6: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'b5', ['a6', 'b6', 'c6']);
      });
      test('attacking - black', () => {
        const game: Game = {
          board: {
            b5: blackPawn,
            a4: whitePawn,
            c4: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'b5', ['a4', 'b4', 'c4']);
      });
      test('attacking and movement blocked - white', () => {
        const game: Game = {
          board: {
            b5: whitePawn,
            a6: blackPawn,
            b6: blackPawn,
            c6: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'b5', ['a6', 'c6']);
      });
      test('attacking and movement blocked - black', () => {
        const game: Game = {
          board: {
            b5: blackPawn,
            a4: whitePawn,
            b4: whitePawn,
            c4: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'b5', ['a4', 'c4']);
      });
      test('first move with optional attack - white', () => {
        const game: Game = {
          board: {
            b2: whitePawn,
            a3: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'b2', ['a3', 'b3', 'b4']);
      });
      test('first move with optional attack - black', () => {
        const game: Game = {
          board: {
            b7: blackPawn,
            a6: whitePawn,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        console.log(getAllValidMoves(game));
        assertMovement(game, 'b7', ['a6', 'b6', 'b5']);
      });
      test('en passant - white', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e2',
          newLocation: 'e4',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e4',
          newLocation: 'e5',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd5',
          isAttack: false,
        });
        assertMovement(game, 'e5', ['d6', 'e6']);
        const enPassantMove = getAllValidMoves(game).find(
          (move) => move.isEnPassant
        );
        const afterEnPassant = applyMove(game, enPassantMove!);
        expect(asString(afterEnPassant.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♜ | ♞ | ♝ | ♛ | ♚ | ♝ |   | ♜  8
  -------------------------------
7  ♟ | ♟ | ♟ |   | ♟ | ♟ | ♟ | ♟  7
  -------------------------------
6    |   |   | ♙ |   |   |   | ♞  6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2  ♙ | ♙ | ♙ | ♙ |   | ♙ | ♙ | ♙  2
  -------------------------------
1  ♖ | ♘ | ♗ | ♕ | ♔ | ♗ | ♘ | ♖  1
   a   b   c   d   e   f   g   h`);
      });
      test('en passant - black', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd5',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'h3',
          newLocation: 'g1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd5',
          newLocation: 'd4',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e2',
          newLocation: 'e4',
          isAttack: false,
        });
        assertMovement(game, 'd4', ['d3', 'e3']);
        const enPassantMove = getAllValidMoves(game).find(
          (move) => move.isEnPassant
        );
        const afterEnPassant = applyMove(game, enPassantMove!);
        expect(asString(afterEnPassant.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♜ | ♞ | ♝ | ♛ | ♚ | ♝ | ♞ | ♜  8
  -------------------------------
7  ♟ | ♟ | ♟ |   | ♟ | ♟ | ♟ | ♟  7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   | ♟ |   |   |    3
  -------------------------------
2  ♙ | ♙ | ♙ | ♙ |   | ♙ | ♙ | ♙  2
  -------------------------------
1  ♖ | ♘ | ♗ | ♕ | ♔ | ♗ | ♘ | ♖  1
   a   b   c   d   e   f   g   h`);
      });
      test('cannot en passant unless it happens directly after the opposing double movement - white', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e2',
          newLocation: 'e4',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e4',
          newLocation: 'e5',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd5',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'h6',
          newLocation: 'g8',
          isAttack: false,
        });
        assertMovement(game, 'e5', ['e6']);
      });
      test('cannot en passant unless it happens directly after the opposing double movement - black', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd5',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'h3',
          newLocation: 'g1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd5',
          newLocation: 'd4',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'e2',
          newLocation: 'e4',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        assertMovement(game, 'd4', ['d3']);
      });
      test('promotion - white', () => {
        const aboutToPromote: Game = {
          board: {
            a7: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(aboutToPromote.board));
        assertMovement(aboutToPromote, 'a7', ['a8', 'a8', 'a8', 'a8']);
        const promoteToQueen = applyMove(aboutToPromote, {
          piece: whitePawn,
          previousLocation: 'a7',
          newLocation: 'a8',
          isAttack: false,
          promotion: 'queen',
        });
        expect(asString(promoteToQueen.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♕ |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
        const promoteToRook = applyMove(aboutToPromote, {
          piece: whitePawn,
          previousLocation: 'a7',
          newLocation: 'a8',
          isAttack: false,
          promotion: 'rook',
        });
        expect(asString(promoteToRook.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♖ |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);

        const promoteToBishop = applyMove(aboutToPromote, {
          piece: whitePawn,
          previousLocation: 'a7',
          newLocation: 'a8',
          isAttack: false,
          promotion: 'bishop',
        });
        expect(asString(promoteToBishop.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♗ |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
        const promoteToKnight = applyMove(aboutToPromote, {
          piece: whitePawn,
          previousLocation: 'a7',
          newLocation: 'a8',
          isAttack: false,
          promotion: 'knight',
        });
        expect(asString(promoteToKnight.board))
          .toBe(`   a   b   c   d   e   f   g   h
8  ♘ |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
      });
      test('promotion - black', () => {
        const aboutToPromote: Game = {
          board: {
            a2: blackPawn,
          },
          toMove: 'black',
        };
        console.log(asString(aboutToPromote.board));
        assertMovement(aboutToPromote, 'a2', ['a1', 'a1', 'a1', 'a1']);
        const promoteToQueen = applyMove(aboutToPromote, {
          piece: blackPawn,
          previousLocation: 'a2',
          newLocation: 'a1',
          isAttack: false,
          promotion: 'queen',
        });
        expect(asString(promoteToQueen.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1  ♛ |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
        const promoteToRook = applyMove(aboutToPromote, {
          piece: blackPawn,
          previousLocation: 'a2',
          newLocation: 'a1',
          isAttack: false,
          promotion: 'rook',
        });
        expect(asString(promoteToRook.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1  ♜ |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);

        const promoteToBishop = applyMove(aboutToPromote, {
          piece: blackPawn,
          previousLocation: 'a2',
          newLocation: 'a1',
          isAttack: false,
          promotion: 'bishop',
        });
        expect(asString(promoteToBishop.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1  ♝ |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
        const promoteToKnight = applyMove(aboutToPromote, {
          piece: blackPawn,
          previousLocation: 'a2',
          newLocation: 'a1',
          isAttack: false,
          promotion: 'knight',
        });
        expect(asString(promoteToKnight.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1  ♞ |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
      });
      test('promotion blocked - white', () => {
        const game: Game = {
          board: {
            a7: whitePawn,
            a8: blackQueen,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a7', []);
      });
      test('promotion blocked - black', () => {
        const game: Game = {
          board: {
            a2: blackPawn,
            a1: whiteQueen,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a2', []);
      });
      test('attack to promote - white', () => {
        const game: Game = {
          board: {
            a7: whitePawn,
            b8: blackQueen,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a7', [
          'a8',
          'a8',
          'a8',
          'a8',
          'b8',
          'b8',
          'b8',
          'b8',
        ]);
        const promoteToQueen = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'a7',
          newLocation: 'b8',
          isAttack: false,
          promotion: 'queen',
        });
        expect(asString(promoteToQueen.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    | ♕ |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    |   |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
      });
      test('attack to promote - black', () => {
        const game: Game = {
          board: {
            a2: blackPawn,
            b1: whiteQueen,
          },
          toMove: 'black',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a2', [
          'a1',
          'a1',
          'a1',
          'a1',
          'b1',
          'b1',
          'b1',
          'b1',
        ]);
        const promoteToQueen = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'a2',
          newLocation: 'b1',
          isAttack: false,
          promotion: 'queen',
        });
        expect(asString(promoteToQueen.board))
          .toBe(`   a   b   c   d   e   f   g   h
8    |   |   |   |   |   |   |    8
  -------------------------------
7    |   |   |   |   |   |   |    7
  -------------------------------
6    |   |   |   |   |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   |   |    3
  -------------------------------
2    |   |   |   |   |   |   |    2
  -------------------------------
1    | ♛ |   |   |   |   |   |    1
   a   b   c   d   e   f   g   h`);
      });
    });

    describe('knight', () => {
      test('basic knight movement', () => {
        const game: Game = {
          board: {
            d4: whiteKnight,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'c6',
          'e6',
          'b5',
          'f5',
          'b3',
          'f3',
          'c2',
          'e2',
        ]);
      });
      test('in corner', () => {
        const game: Game = {
          board: {
            a1: whiteKnight,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'a1', ['b3', 'c2']);
      });
      test('blocked by own piece', () => {
        const game: Game = {
          board: {
            d4: whiteKnight,
            c6: whitePawn,
            e6: whitePawn,
            b5: whitePawn,
            f5: whitePawn,
            b3: whitePawn,
            f3: whitePawn,
            c2: whitePawn,
            e2: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', []);
      });
      test('attacking enemy piece', () => {
        const game: Game = {
          board: {
            d4: whiteKnight,
            c6: blackPawn,
            e6: blackPawn,
            b5: blackPawn,
            f5: blackPawn,
            b3: blackPawn,
            f3: blackPawn,
            c2: blackPawn,
            e2: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'c6',
          'e6',
          'b5',
          'f5',
          'b3',
          'f3',
          'c2',
          'e2',
        ]);
      });
    });

    describe('bishop', () => {
      test('basic bishop movement', () => {
        const game: Game = {
          board: {
            d4: whiteBishop,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'c5',
          'b6',
          'a7',
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('blocked by own piece', () => {
        const game: Game = {
          board: {
            d4: whiteBishop,
            c5: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('attacking enemy piece', () => {
        const game: Game = {
          board: {
            d4: whiteBishop,
            b6: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'c5',
          'b6',
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
    });

    describe('rook', () => {
      test('basic rook movement', () => {
        const game: Game = {
          board: {
            d4: whiteRook,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
        ]);
      });
      test('blocked by own piece', () => {
        const game: Game = {
          board: {
            d4: whiteRook,
            d2: whiteQueen,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
        ]);
      });
      test('attacking enemy piece', () => {
        const game: Game = {
          board: {
            d4: whiteRook,
            d2: blackQueen,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
        ]);
      });
    });

    describe('queen', () => {
      test('basic movement', () => {
        const game: Game = {
          board: {
            d4: whiteQueen,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'c5',
          'b6',
          'a7',
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('blocked by own piece rook movement', () => {
        const game: Game = {
          board: {
            d4: whiteQueen,
            d2: whiteRook,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'c5',
          'b6',
          'a7',
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('attacking enemy piece with rook movement', () => {
        const game: Game = {
          board: {
            d4: whiteQueen,
            d2: blackRook,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'c5',
          'b6',
          'a7',
          'c3',
          'b2',
          'a1',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('blocked by own piece bishop movement', () => {
        const game: Game = {
          board: {
            d4: whiteQueen,
            b2: whiteRook,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'c5',
          'b6',
          'a7',
          'c3',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
      test('attacking enemy piece with bishop movement', () => {
        const game: Game = {
          board: {
            d4: whiteQueen,
            b2: blackRook,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd1',
          'd2',
          'd3',
          'd5',
          'd6',
          'd7',
          'd8',
          'a4',
          'b4',
          'c4',
          'e4',
          'f4',
          'g4',
          'h4',
          'c5',
          'b6',
          'a7',
          'c3',
          'b2',
          'e5',
          'f6',
          'g7',
          'e3',
          'f2',
          'g1',
          'h8',
        ]);
      });
    });

    describe('king', () => {
      test('basic movement', () => {
        const game: Game = {
          board: {
            d4: whiteKing,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd3',
          'd5',
          'c3',
          'c4',
          'c5',
          'e3',
          'e4',
          'e5',
        ]);
      });
      test('blocked by own piece', () => {
        const game: Game = {
          board: {
            d4: whiteKing,
            d3: whitePawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', ['d5', 'c3', 'c4', 'c5', 'e3', 'e4', 'e5']);
      });
      test('attacking enemy piece', () => {
        const game: Game = {
          board: {
            d4: whiteKing,
            d3: blackPawn,
          },
          toMove: 'white',
        };
        console.log(asString(game.board));
        assertMovement(game, 'd4', [
          'd3',
          'd5',
          'c3',
          'c4',
          'c5',
          'e3',
          'e4',
          'e5',
        ]);
      });
    });

    describe('castling', () => {
      test('castling left', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'b1',
          newLocation: 'a3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'b8',
          newLocation: 'a6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'd2',
          newLocation: 'd3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteBishop,
          previousLocation: 'c1',
          newLocation: 'e3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackBishop,
          previousLocation: 'c8',
          newLocation: 'e6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteQueen,
          previousLocation: 'd1',
          newLocation: 'd2',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackQueen,
          previousLocation: 'd8',
          newLocation: 'd7',
          isAttack: false,
        });
        assertMovement(game, 'e1', ['d1', 'c1']);
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'c1',
          isAttack: false,
          isCastle: true,
        });
        expect(asString(game.board)).toBe(`   a   b   c   d   e   f   g   h
8  ♜ |   |   |   | ♚ | ♝ | ♞ | ♜  8
  -------------------------------
7  ♟ | ♟ | ♟ | ♛ | ♟ | ♟ | ♟ | ♟  7
  -------------------------------
6  ♞ |   |   | ♟ | ♝ |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3  ♘ |   |   | ♙ | ♗ |   |   |    3
  -------------------------------
2  ♙ | ♙ | ♙ | ♕ | ♙ | ♙ | ♙ | ♙  2
  -------------------------------
1    |   | ♔ | ♖ |   | ♗ | ♘ | ♖  1
   a   b   c   d   e   f   g   h`);
        assertMovement(game, 'e8', ['d8', 'c8']);
        game = applyMove(game, {
          piece: blackKing,
          previousLocation: 'e8',
          newLocation: 'c8',
          isAttack: false,
          isCastle: true,
        });
        expect(asString(game.board)).toBe(`   a   b   c   d   e   f   g   h
8    |   | ♚ | ♜ |   | ♝ | ♞ | ♜  8
  -------------------------------
7  ♟ | ♟ | ♟ | ♛ | ♟ | ♟ | ♟ | ♟  7
  -------------------------------
6  ♞ |   |   | ♟ | ♝ |   |   |    6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3  ♘ |   |   | ♙ | ♗ |   |   |    3
  -------------------------------
2  ♙ | ♙ | ♙ | ♕ | ♙ | ♙ | ♙ | ♙  2
  -------------------------------
1    |   | ♔ | ♖ |   | ♗ | ♘ | ♖  1
   a   b   c   d   e   f   g   h`);
        console.log(asString(game.board));
      });
      test('castling right', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'g2',
          newLocation: 'g3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'g7',
          newLocation: 'g6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteBishop,
          previousLocation: 'f1',
          newLocation: 'g2',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackBishop,
          previousLocation: 'f8',
          newLocation: 'g7',
          isAttack: false,
        });
        assertMovement(game, 'e1', ['f1', 'g1']);
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'g1',
          isAttack: false,
          isCastle: true,
        });
        expect(asString(game.board)).toBe(`   a   b   c   d   e   f   g   h
8  ♜ | ♞ | ♝ | ♛ | ♚ |   |   | ♜  8
  -------------------------------
7  ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♝ | ♟  7
  -------------------------------
6    |   |   |   |   |   | ♟ | ♞  6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   | ♙ | ♘  3
  -------------------------------
2  ♙ | ♙ | ♙ | ♙ | ♙ | ♙ | ♗ | ♙  2
  -------------------------------
1  ♖ | ♘ | ♗ | ♕ |   | ♖ | ♔ |    1
   a   b   c   d   e   f   g   h`);
        assertMovement(game, 'e8', ['f8', 'g8']);
        game = applyMove(game, {
          piece: blackKing,
          previousLocation: 'e8',
          newLocation: 'g8',
          isAttack: false,
          isCastle: true,
        });
        expect(asString(game.board)).toBe(`   a   b   c   d   e   f   g   h
8  ♜ | ♞ | ♝ | ♛ |   | ♜ | ♚ |    8
  -------------------------------
7  ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♝ | ♟  7
  -------------------------------
6    |   |   |   |   |   | ♟ | ♞  6
  -------------------------------
5    |   |   |   |   |   |   |    5
  -------------------------------
4    |   |   |   |   |   |   |    4
  -------------------------------
3    |   |   |   |   |   | ♙ | ♘  3
  -------------------------------
2  ♙ | ♙ | ♙ | ♙ | ♙ | ♙ | ♗ | ♙  2
  -------------------------------
1  ♖ | ♘ | ♗ | ♕ |   | ♖ | ♔ |    1
   a   b   c   d   e   f   g   h`);
      });
      test('cannot castle if king has moved', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'g2',
          newLocation: 'g3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'g7',
          newLocation: 'g6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteBishop,
          previousLocation: 'f1',
          newLocation: 'g2',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackBishop,
          previousLocation: 'f8',
          newLocation: 'g7',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'f1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKing,
          previousLocation: 'e8',
          newLocation: 'f8',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'f1',
          newLocation: 'e1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKing,
          previousLocation: 'f8',
          newLocation: 'e8',
          isAttack: false,
        });
        assertMovement(game, 'e1', ['f1']);
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'f1',
          isAttack: false,
        });
        assertMovement(game, 'e8', ['f8']);
      });
      test('cannot castle left if rook has moved ', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'b1',
          newLocation: 'a3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'b8',
          newLocation: 'a6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'd2',
          newLocation: 'd3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'd7',
          newLocation: 'd6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteBishop,
          previousLocation: 'c1',
          newLocation: 'e3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackBishop,
          previousLocation: 'c8',
          newLocation: 'e6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteQueen,
          previousLocation: 'd1',
          newLocation: 'd2',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackQueen,
          previousLocation: 'd8',
          newLocation: 'd7',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteRook,
          previousLocation: 'a1',
          newLocation: 'b1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackRook,
          previousLocation: 'a8',
          newLocation: 'b8',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteRook,
          previousLocation: 'b1',
          newLocation: 'a1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackRook,
          previousLocation: 'b8',
          newLocation: 'a8',
          isAttack: false,
        });
        assertMovement(game, 'e1', ['d1']);
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'f1',
          isAttack: false,
        });
        assertMovement(game, 'e8', ['d8']);
      });
      test('cannot castle right if rook has moved', () => {
        let game = createNewGame();
        game = applyMove(game, {
          piece: whiteKnight,
          previousLocation: 'g1',
          newLocation: 'h3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackKnight,
          previousLocation: 'g8',
          newLocation: 'h6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whitePawn,
          previousLocation: 'g2',
          newLocation: 'g3',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackPawn,
          previousLocation: 'g7',
          newLocation: 'g6',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteBishop,
          previousLocation: 'f1',
          newLocation: 'g2',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackBishop,
          previousLocation: 'f8',
          newLocation: 'g7',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteRook,
          previousLocation: 'h1',
          newLocation: 'g1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackRook,
          previousLocation: 'h8',
          newLocation: 'g8',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: whiteRook,
          previousLocation: 'g1',
          newLocation: 'h1',
          isAttack: false,
        });
        game = applyMove(game, {
          piece: blackRook,
          previousLocation: 'g8',
          newLocation: 'h8',
          isAttack: false,
        });
        assertMovement(game, 'e1', ['f1']);
        game = applyMove(game, {
          piece: whiteKing,
          previousLocation: 'e1',
          newLocation: 'f1',
          isAttack: false,
        });
        assertMovement(game, 'e8', ['f8']);
      });
      test('cannot castle through check - white', () => {
        const game: Game = {
          toMove: 'white',
          board: {
            e1: whiteKing,
            a1: whiteRook,
            c2: blackPawn,
          },
        };
        assertMovement(game, 'e1', ['d2', 'e2', 'f1', 'f2']);
      });
      test('cannot castle through check - black', () => {
        const game: Game = {
          toMove: 'white',
          board: {
            e1: whiteKing,
            h1: whiteRook,
            g3: blackKnight,
          },
        };
        console.log(asString(game.board));
        assertMovement(game, 'e1', ['d1', 'd2', 'f2']);
      });
    });
  });

  describe('smoketest scenarios', () => {
    test('should not include a move that leaves the user in check as a valid move', () => {
      const checkingForLeavingSelfInCheck: Game = {
        board: {
          a1: whiteKing,
          b2: whiteKnight,
          h8: blackKing,
          g7: blackBishop,
        },
        toMove: 'white',
      };

      console.log(asString(checkingForLeavingSelfInCheck.board));
      const validMoves = getAllValidMoves(checkingForLeavingSelfInCheck);
      console.log(validMoves.find((move) => move.piece.type === 'knight'));
      expect(
        validMoves.find((move) => move.piece.type === 'knight') == null
      ).toBe(true);
    });

    test('should not allow the king to move into check', () => {
      const checkingForLeavingSelfInCheck: Game = {
        board: {
          a1: whiteKing,
          b2: whiteKnight,
          h8: blackKing,
          f7: blackBishop,
          g6: blackBishop,
        },
        toMove: 'white',
      };

      console.log(asString(checkingForLeavingSelfInCheck.board));
      expect(
        getAllValidMoves(checkingForLeavingSelfInCheck).filter(
          (move) => move.piece.type === 'king'
        ).length
      ).toBe(0);
    });

    test('checkmate', () => {
      const game: Game = {
        board: {
          d1: whiteKing,
          a1: blackRook,
          b2: blackQueen,
          a8: blackKing,
        },
        toMove: 'white',
      };

      console.log(asString(game.board));
      expect(isCheck(game)).toBe(true);
      expect(isCheckMate(game)).toBe(true);
    });

    test('can block checkmate', () => {
      const game: Game = {
        board: {
          d1: whiteKing,
          e3: whiteBishop,
          a1: blackRook,
          b2: blackQueen,
          a8: blackKing,
        },
        toMove: 'white',
      };

      console.log(asString(game.board));
      expect(isCheckMate(game)).toBe(false);
      expect(getAllValidMoves(game).length).toBe(1);
    });
  });
});
