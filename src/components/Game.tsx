import type React from 'react';
import { useGameContext } from '../context/GameContext';
import GameBoard from './GameBoard';
import GameInfo from './GameInfo';
import GameSetup from './GameSetup';

const Game: React.FC = () => {
  const { gameState } = useGameContext();
  const { status } = gameState;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Snake and Ladder</h1>
        <p className="text-gray-600">Roll the dice, climb the ladders, and watch out for snakes!</p>
      </header>

      {status === 'setup' ? (
        <div className="max-w-md mx-auto">
          <GameSetup />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GameBoard />
          </div>
          <div>
            <GameInfo />
          </div>
        </div>
      )}

      <footer className="mt-10 text-center text-sm text-gray-500">
        <p>© 2025 Snake and Ladder Game • All rights reserved</p>

        <div className="mt-4 p-3 bg-indigo-50 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-bold mb-1">How to Play:</h3>
          <ul className="text-xs text-left list-disc pl-5 space-y-1">
            <li>Players take turns rolling the dice by clicking on it</li>
            <li>Move your token by the number of spaces shown on the dice</li>
            <li>If you land on a ladder, you climb up to the top of the ladder</li>
            <li>If you land on a snake head, you slide down to the tail of the snake</li>
            <li>The first player to reach exactly square 100 wins the game</li>
            <li>If your roll would take you beyond square 100, you don't move</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Game;
