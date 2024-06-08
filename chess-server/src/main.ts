import type * as Party from 'partykit/server';
import { Game, createNewGame } from 'chess';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

export default class ChessParty implements Party.Server {
  constructor() {
    addGame();
  }

  onStart() {
    console.log('🎈🎈🎈 chess server started 🎈🎈🎈');
    addGame();
    console.log(JSON.stringify(games, null, 2));
  }

  async onMessage(messageAsString, webSocketObj) {
    const message = JSON.parse(messageAsString);
    switch (message.type) {
      case 'new game': {
        const { id, game } = await addGame();
        webSocketObj.socket.send(
          JSON.stringify({ type: 'game created', id, game })
        );
      }
    }
  }
}

const games: Record<string, Game> = {};
let count = 0;

function getGame(id: string): { id: string; game: Game } | { error: any } {
  const game = games[id];
  if (!game) {
    return { error: 'game not found' };
  }
  return { id, game };
}

async function addGame(): Promise<{ id: string; game: Game }> {
  const id = randomUUID();
  const game = createNewGame();
  games[id] = game;
  const result = await supabaseClient.from('games').insert([{ id, game }]);
  console.log(result);
  return { id, game };
}
