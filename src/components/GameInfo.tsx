import type React from 'react';
import { useGameContext } from '../context/GameContext';
import Dice from './Dice';

const GameInfo: React.FC = () => {
  const { gameState, resetGame, updatePlayerName } = useGameContext();
  const { players, currentPlayerIndex, status, winner, message } = gameState;

  // Get the active player
  const activePlayer = players[currentPlayerIndex];

  const playerColors = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#8b5cf6',
    orange: '#f97316',
  };

  const getMoveTypeBadge = (isSnake: boolean, isLadder: boolean) => {
    if (isSnake) {
      return <span className="text-xs font-medium bg-red-100 text-red-800 rounded px-1">Snake</span>;
    }
    if (isLadder) {
      return <span className="text-xs font-medium bg-green-100 text-green-800 rounded px-1">Ladder</span>;
    }
    return <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded px-1">Move</span>;
  };

  const handleNameChange = (playerId: number, event: React.FocusEvent<HTMLInputElement>) => {
    const newName = event.target.value.trim();
    if (newName && newName !== players.find(p => p.id === playerId)?.name) {
      updatePlayerName(playerId, newName);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Game message area */}
      <div className="bg-indigo-50 rounded-md p-3 mb-4 min-h-[60px] flex items-center justify-center text-center">
        <p className="text-sm text-indigo-700">{message}</p>
      </div>

      {status === 'gameOver' && winner ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white text-white text-xl font-bold"
            style={{ backgroundColor: playerColors[winner.color] }}
          >
            {winner.id}
          </div>
          <p className="text-xl font-bold mb-6">
            {winner.name} Wins!
          </p>

          {/* Show winner's move history */}
          {winner.moveHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Winning Path</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Turn</th>
                      <th className="px-3 py-2 text-left">From</th>
                      <th className="px-3 py-2 text-left">To</th>
                      <th className="px-3 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {winner.moveHistory.map((move) => (
                      <tr key={`win-move-${move.turnNumber}-${move.from}-${move.to}`} className={move.isSnake ? 'bg-red-50' : move.isLadder ? 'bg-green-50' : ''}>
                        <td className="px-3 py-2">{move.turnNumber}</td>
                        <td className="px-3 py-2">{move.from}</td>
                        <td className="px-3 py-2">{move.to}</td>
                        <td className="px-3 py-2">{getMoveTypeBadge(move.isSnake, move.isLadder)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary w-full"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Current Turn</h2>

          {/* Current player info */}
          {activePlayer && (
            <div className="flex items-center mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white text-white font-bold"
                style={{ backgroundColor: playerColors[activePlayer.color] }}
              >
                {activePlayer.id}
              </div>
              <div className="ml-3 flex-1">
                <p className="font-semibold">{activePlayer.name}</p>
                <p className="text-sm text-gray-500">Position: {activePlayer.position}</p>
              </div>
            </div>
          )}

          {/* Dice */}
          <div className="flex justify-center mb-6">
            <Dice />
          </div>

          {/* Players list */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Players</h3>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center p-2 rounded-md ${
                    player.isActive ? 'bg-indigo-50 border border-indigo-200' : ''
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-white font-bold"
                    style={{ backgroundColor: playerColors[player.color] }}
                  >
                    {player.id}
                  </div>
                  <div className="ml-2 flex-1">
                    <input
                      type="text"
                      defaultValue={player.name}
                      onBlur={(e) => handleNameChange(player.id, e)}
                      className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5 text-sm font-medium"
                    />

                    {/* Last move information */}
                    {player.lastMove && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>Last: {player.lastMove.from} → {player.lastMove.to}</span>
                        {(player.lastMove.isSnake || player.lastMove.isLadder) && (
                          <span className="ml-1">
                            {getMoveTypeBadge(player.lastMove.isSnake, player.lastMove.isLadder)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold">{player.position}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent moves */}
          {activePlayer && activePlayer.moveHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Recent Moves</h3>
              <div className="border rounded-md overflow-hidden text-xs">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left">Turn</th>
                      <th className="px-2 py-1 text-left">Player</th>
                      <th className="px-2 py-1 text-left">Move</th>
                      <th className="px-2 py-1 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {players
                      .flatMap(p => p.moveHistory)
                      .sort((a, b) => b.turnNumber - a.turnNumber) // Most recent first
                      .slice(0, 5) // Show only the last 5 moves
                      .map((move, idx) => {
                        const movePlayer = players.find(p => p.moveHistory.includes(move));
                        if (!movePlayer) return null;

                        return (
                          <tr key={`move-${move.turnNumber}-${move.from}-${move.to}`} className={move.isSnake ? 'bg-red-50' : move.isLadder ? 'bg-green-50' : ''}>
                            <td className="px-2 py-1">{move.turnNumber}</td>
                            <td className="px-2 py-1">
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center mr-1"
                                  style={{ backgroundColor: playerColors[movePlayer.color] }}
                                >
                                </div>
                                <span>{movePlayer.name.split(' ')[0]}</span>
                              </div>
                            </td>
                            <td className="px-2 py-1">{move.from} → {move.to}</td>
                            <td className="px-2 py-1">{getMoveTypeBadge(move.isSnake, move.isLadder)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reset button */}
          <button
            className="btn btn-secondary w-full mt-6"
            onClick={resetGame}
          >
            Reset Game
          </button>
        </>
      )}
    </div>
  );
};

export default GameInfo;
