export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface PlayerMove {
  from: number;
  to: number;
  diceValue: number;
  isSnake: boolean;
  isLadder: boolean;
  turnNumber: number;
}

export interface Player {
  id: number;
  name: string;
  color: PlayerColor;
  position: number;
  isActive: boolean;
  moveHistory: PlayerMove[];
  lastMove: PlayerMove | null;
  animating: boolean;
}

export interface Snake {
  start: number;
  end: number;
}

export interface Ladder {
  start: number;
  end: number;
}

export interface GameSettings {
  boardSize: number;
  numberOfPlayers: number;
  snakes: Snake[];
  ladders: Ladder[];
  turnCount: number;
}

export interface Dice {
  value: number;
  rolling: boolean;
}

export type GameStatus = 'setup' | 'playing' | 'gameOver';

export interface GameState {
  settings: GameSettings;
  players: Player[];
  currentPlayerIndex: number;
  dice: Dice;
  winner: Player | null;
  status: GameStatus;
  moveInProgress: boolean;
  message: string;
}

export interface Cell {
  number: number;
  hasSnakeHead?: boolean;
  hasSnakeTail?: boolean;
  hasLadderStart?: boolean;
  hasLadderEnd?: boolean;
  snakeId?: number;
  ladderId?: number;
}
