import type React from 'react';
import { useState } from 'react';
import { useGameContext } from '../context/GameContext';

const GameSetup: React.FC = () => {
  const { initGame } = useGameContext();
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [boardSize, setBoardSize] = useState(10);

  const handleStartGame = () => {
    initGame(numberOfPlayers, boardSize);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Game Setup</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Number of Players</label>
        <div className="flex items-center justify-between">
          <button
            className="btn btn-secondary"
            onClick={() => setNumberOfPlayers(Math.max(2, numberOfPlayers - 1))}
          >
            -
          </button>
          <span className="text-xl font-bold">{numberOfPlayers}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setNumberOfPlayers(Math.min(6, numberOfPlayers + 1))}
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Min: 2, Max: 6 players</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Board Size</label>
        <div className="flex items-center space-x-4">
          <button
            className={`px-3 py-2 rounded-md ${boardSize === 8 ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setBoardSize(8)}
          >
            8x8
          </button>
          <button
            className={`px-3 py-2 rounded-md ${boardSize === 10 ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setBoardSize(10)}
          >
            10x10
          </button>
          <button
            className={`px-3 py-2 rounded-md ${boardSize === 12 ? 'bg-indigo-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setBoardSize(12)}
          >
            12x12
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="btn btn-primary w-full" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameSetup;
