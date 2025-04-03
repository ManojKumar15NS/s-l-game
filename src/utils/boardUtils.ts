import type { Cell, Snake, Ladder } from '../types';

/**
 * Generate a snake and ladder board
 * @param boardSize Size of the board (e.g., 10 for a 10x10 board)
 * @param snakes Array of snakes with start and end positions
 * @param ladders Array of ladders with start and end positions
 * @returns Array of Cell objects representing the board
 */
export const generateBoard = (
  boardSize: number,
  snakes: Snake[],
  ladders: Ladder[]
): Cell[] => {
  const cells: Cell[] = [];
  const totalCells = boardSize * boardSize;

  // Create cells with alternating row directions for zig-zag pattern
  for (let i = 1; i <= totalCells; i++) {
    const cell: Cell = { number: i };
    cells.push(cell);
  }

  // Add snake information to cells
  snakes.forEach((snake, index) => {
    const headCell = cells.find((cell) => cell.number === snake.start);
    const tailCell = cells.find((cell) => cell.number === snake.end);

    if (headCell) {
      headCell.hasSnakeHead = true;
      headCell.snakeId = index;
    }

    if (tailCell) {
      tailCell.hasSnakeTail = true;
      tailCell.snakeId = index;
    }
  });

  // Add ladder information to cells
  ladders.forEach((ladder, index) => {
    const startCell = cells.find((cell) => cell.number === ladder.start);
    const endCell = cells.find((cell) => cell.number === ladder.end);

    if (startCell) {
      startCell.hasLadderStart = true;
      startCell.ladderId = index;
    }

    if (endCell) {
      endCell.hasLadderEnd = true;
      endCell.ladderId = index;
    }
  });

  return cells;
};

/**
 * Convert a 1D position to a 2D grid position
 * @param position Position in the 1D array (1-based)
 * @param boardSize Size of the board (e.g., 10 for a 10x10 board)
 * @returns Grid position {row, col} (0-based)
 */
export const positionToGrid = (position: number, boardSize: number) => {
  // For position 0 (before starting the game), return a special position
  if (position === 0) {
    return { row: boardSize, col: -1 };
  }

  // Adjust position to 0-based for calculation
  const adjustedPos = position - 1;

  // Calculate row and column
  const row = boardSize - 1 - Math.floor(adjustedPos / boardSize);
  let col = adjustedPos % boardSize;

  // For even rows (from bottom), reverse the column order to create the zigzag pattern
  const isEvenRow = (boardSize - 1 - row) % 2 === 0;
  if (isEvenRow) {
    col = boardSize - 1 - col;
  }

  return { row, col };
};

/**
 * Get the pixel coordinates for a given position
 * @param position Position in the 1D array (1-based)
 * @param boardSize Size of the board (e.g., 10 for a 10x10 board)
 * @param cellSize Size of each cell in pixels
 * @returns Pixel coordinates {x, y}
 */
export const getPositionCoordinates = (
  position: number,
  boardSize: number,
  cellSize: number
) => {
  const { row, col } = positionToGrid(position, boardSize);

  // For position 0 (before starting), place at the bottom left of the board
  if (position === 0) {
    return {
      x: -cellSize / 2,
      y: boardSize * cellSize + cellSize / 2,
    };
  }

  return {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
  };
};

/**
 * Get the color of a snake based on its ID
 * @param snakeId ID of the snake
 * @returns CSS color string
 */
export const getSnakeColor = (snakeId: number) => {
  const snakeColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#84cc16', // lime
    '#06b6d4', // cyan
    '#8b5cf6', // violet
    '#ec4899', // pink
  ];

  return snakeColors[snakeId % snakeColors.length];
};

/**
 * Get the color of a ladder based on its ID
 * @param ladderId ID of the ladder
 * @returns CSS color string
 */
export const getLadderColor = (ladderId: number) => {
  const ladderColors = [
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#d946ef', // fuchsia
    '#f43f5e', // rose
    '#0ea5e9', // sky
  ];

  return ladderColors[ladderId % ladderColors.length];
};
