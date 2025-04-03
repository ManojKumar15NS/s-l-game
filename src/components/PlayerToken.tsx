import type React from 'react';
import { useState, useEffect } from 'react';
import type { Player } from '../types';
import { positionToGrid } from '../utils/boardUtils';

interface PlayerTokenProps {
  player: Player;
  boardSize: number;
  cellSize: number;
}

const PlayerToken: React.FC<PlayerTokenProps> = ({ player, boardSize, cellSize }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showPreviousPosition, setShowPreviousPosition] = useState(false);
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });

  // Define colors for different player tokens
  const tokenColors = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#8b5cf6',
    orange: '#f97316',
  };

  useEffect(() => {
    // If this is a new movement, store the previous position
    if (player.animating && player.lastMove) {
      // Calculate position for the previous cell
      const { row: prevRow, col: prevCol } = positionToGrid(player.lastMove.from, boardSize);

      // Handle position 0 (before starting the game)
      if (player.lastMove.from === 0) {
        setPreviousPosition({
          x: -cellSize / 2 + (player.id - 1) * 10,
          y: boardSize * cellSize + cellSize / 2 - (player.id - 1) * 10,
        });
      } else {
        // Calculate the position within the cell for the previous position
        const offsetX = ((player.id - 1) % 2) * (cellSize / 3);
        const offsetY = Math.floor((player.id - 1) / 2) * (cellSize / 3);

        setPreviousPosition({
          x: prevCol * cellSize + offsetX + cellSize / 3,
          y: prevRow * cellSize + offsetY + cellSize / 3,
        });
      }

      setShowPreviousPosition(true);

      // Hide trace after animation completes
      setTimeout(() => {
        setShowPreviousPosition(false);
      }, 1000);
    }

    // Calculate position on the board
    const { row, col } = positionToGrid(player.position, boardSize);

    // Handle position 0 (before starting the game)
    if (player.position === 0) {
      // Position tokens at the bottom left of the board (before the first cell)
      // Stagger tokens slightly based on player ID
      setPosition({
        x: -cellSize / 2 + (player.id - 1) * 10,
        y: boardSize * cellSize + cellSize / 2 - (player.id - 1) * 10,
      });
    } else {
      // Calculate the position within the cell
      // Stagger tokens slightly based on player ID to avoid overlap
      const offsetX = ((player.id - 1) % 2) * (cellSize / 3);
      const offsetY = Math.floor((player.id - 1) / 2) * (cellSize / 3);

      setPosition({
        x: col * cellSize + offsetX + cellSize / 3,
        y: row * cellSize + offsetY + cellSize / 3,
      });
    }
  }, [player.position, player.id, boardSize, cellSize, player.animating, player.lastMove]);

  // Determine animation class based on move type
  const getAnimationClass = () => {
    if (!player.animating) return '';
    if (!player.lastMove) return '';

    if (player.lastMove.isSnake) {
      return 'animate-slide-down';
    }
    if (player.lastMove.isLadder) {
      return 'animate-slide-up';
    }
    return 'animate-move';
  };

  return (
    <>
      {/* Previous position indicator (trace) */}
      {showPreviousPosition && player.lastMove && (
        <div
          className="absolute opacity-30 transition-opacity duration-1000"
          style={{
            transform: `translate(${previousPosition.x}px, ${previousPosition.y}px)`,
            width: `${cellSize / 3}px`,
            height: `${cellSize / 3}px`,
          }}
        >
          <div
            className="w-full h-full rounded-full border-2 border-white"
            style={{
              backgroundColor: tokenColors[player.color],
              opacity: 0.5,
            }}
          />
        </div>
      )}

      {/* Movement path line */}
      {showPreviousPosition && player.lastMove && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-5"
          style={{ opacity: 0.5 }}
        >
          <line
            x1={previousPosition.x + cellSize / 6}
            y1={previousPosition.y + cellSize / 6}
            x2={position.x + cellSize / 6}
            y2={position.y + cellSize / 6}
            stroke={tokenColors[player.color]}
            strokeWidth="2"
            strokeDasharray="4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Current position (player token) */}
      <div
        className={`absolute transition-all duration-500 ease-in-out z-10 ${player.isActive ? 'animate-bounce' : ''} ${getAnimationClass()}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${cellSize / 3}px`,
          height: `${cellSize / 3}px`,
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center shadow-md border-2 border-white"
          style={{
            backgroundColor: tokenColors[player.color],
            fontSize: `${cellSize / 5}px`,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {player.id}
        </div>

        {/* Move value indicator */}
        {player.animating && player.lastMove && player.lastMove.diceValue > 0 && (
          <div
            className="absolute -top-4 -right-4 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-gray-300 shadow-sm"
            style={{ color: tokenColors[player.color] }}
          >
            {player.lastMove.diceValue}
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerToken;
