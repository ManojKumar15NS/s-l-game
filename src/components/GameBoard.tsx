import type React from 'react';
import { useEffect, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { generateBoard, positionToGrid, getSnakeColor, getLadderColor } from '../utils/boardUtils';
import type { Cell } from '../types';
import PlayerToken from './PlayerToken';

const GameBoard: React.FC = () => {
  const { gameState } = useGameContext();
  const { settings, players } = gameState;
  const [boardCells, setBoardCells] = useState<Cell[]>([]);

  // Generate board cells when settings change
  useEffect(() => {
    const cells = generateBoard(
      settings.boardSize,
      settings.snakes,
      settings.ladders
    );
    setBoardCells(cells);
  }, [settings.boardSize, settings.snakes, settings.ladders]);

  // Calculate cell size based on window width
  const [cellSize, setCellSize] = useState(50);

  useEffect(() => {
    const updateCellSize = () => {
      const boardContainer = document.getElementById('board-container');
      if (boardContainer) {
        const containerWidth = boardContainer.clientWidth;
        const newCellSize = Math.min(60, Math.floor(containerWidth / settings.boardSize));
        setCellSize(newCellSize);
      }
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);

    return () => {
      window.removeEventListener('resize', updateCellSize);
    };
  }, [settings.boardSize]);

  // Render board grid
  const renderBoardGrid = () => {
    return (
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${settings.boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${settings.boardSize}, ${cellSize}px)`,
          width: `${settings.boardSize * cellSize}px`,
          height: `${settings.boardSize * cellSize}px`,
        }}
      >
        {boardCells.map((cell) => {
          const { row, col } = positionToGrid(cell.number, settings.boardSize);
          const isEvenCell = (row + col) % 2 === 0;

          return (
            <div
              key={cell.number}
              className={`board-cell ${isEvenCell ? 'bg-indigo-50' : 'bg-white'}`}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }}
            >
              {/* Cell content */}
              <span className="board-cell-number">{cell.number}</span>

              {/* Snake head indicator */}
              {cell.hasSnakeHead && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 1 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm5-3c.83 0 1.5-.67 1.5-1.5S12.83 5 12 5s-1.5.67-1.5 1.5S11.17 8 12 8zm5 3c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                      fill={cell.snakeId !== undefined ? getSnakeColor(cell.snakeId) : '#ef4444'} />
                  </svg>
                </div>
              )}

              {/* Snake tail indicator */}
              {cell.hasSnakeTail && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 1 }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: cell.snakeId !== undefined ? getSnakeColor(cell.snakeId) : '#ef4444',
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              )}

              {/* Ladder start indicator */}
              {cell.hasLadderStart && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 1 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="6" width="12" height="12" rx="2"
                      stroke={cell.ladderId !== undefined ? getLadderColor(cell.ladderId) : '#eab308'}
                      strokeWidth="2"
                      fill="white" />
                  </svg>
                </div>
              )}

              {/* Ladder end indicator */}
              {cell.hasLadderEnd && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 1 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L19.6603 16H4.33975L12 2Z"
                      fill={cell.ladderId !== undefined ? getLadderColor(cell.ladderId) : '#eab308'} />
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Render snakes */}
        {settings.snakes.map((snake) => {
          const startPos = positionToGrid(snake.start, settings.boardSize);
          const endPos = positionToGrid(snake.end, settings.boardSize);

          const startX = (startPos.col + 0.5) * cellSize;
          const startY = (startPos.row + 0.5) * cellSize;
          const endX = (endPos.col + 0.5) * cellSize;
          const endY = (endPos.row + 0.5) * cellSize;

          // Create a curved path for the snake
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const offsetX = (startY > endY) ? 40 : -40;

          const path = `M ${startX},${startY} Q ${midX + offsetX},${midY} ${endX},${endY}`;

          return (
            <svg
              key={`snake-${snake.start}-${snake.end}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <path
                d={path}
                stroke={getSnakeColor(snake.start % 6)}
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                strokeLinecap="round"
              />
            </svg>
          );
        })}

        {/* Render ladders */}
        {settings.ladders.map((ladder) => {
          const startPos = positionToGrid(ladder.start, settings.boardSize);
          const endPos = positionToGrid(ladder.end, settings.boardSize);

          const startX = (startPos.col + 0.5) * cellSize;
          const startY = (startPos.row + 0.5) * cellSize;
          const endX = (endPos.col + 0.5) * cellSize;
          const endY = (endPos.row + 0.5) * cellSize;

          return (
            <svg
              key={`ladder-${ladder.start}-${ladder.end}`}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 2 }}
            >
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={getLadderColor(ladder.start % 6)}
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Add rungs to the ladder */}
              {Array.from({ length: 4 }).map((_, i) => {
                const t = (i + 1) / 5;
                const x1 = startX + (endX - startX) * t - 5;
                const y1 = startY + (endY - startY) * t - 5;
                const x2 = startX + (endX - startX) * t + 5;
                const y2 = startY + (endY - startY) * t + 5;

                return (
                  <line
                    key={`ladder-${ladder.start}-${ladder.end}-rung-${i + 1}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={getLadderColor(ladder.start % 6)}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          );
        })}

        {/* Player tokens */}
        {players.map((player) => (
          <PlayerToken
            key={player.id}
            player={player}
            boardSize={settings.boardSize}
            cellSize={cellSize}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      id="board-container"
      className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md overflow-auto"
    >
      {renderBoardGrid()}
    </div>
  );
};

export default GameBoard;
