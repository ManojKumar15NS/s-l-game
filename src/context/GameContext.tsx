import type React from 'react';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  type GameState,
  type Player,
  type PlayerColor,
  GameStatus,
  type Snake,
  type Ladder,
  type PlayerMove
} from '../types';

// Default snakes and ladders for 10x10 board
const DEFAULT_SNAKES: Snake[] = [
  { start: 16, end: 6 },
  { start: 47, end: 26 },
  { start: 49, end: 11 },
  { start: 56, end: 53 },
  { start: 62, end: 19 },
  { start: 64, end: 60 },
  { start: 87, end: 24 },
  { start: 93, end: 73 },
  { start: 95, end: 75 },
  { start: 98, end: 78 },
];

const DEFAULT_LADDERS: Ladder[] = [
  { start: 1, end: 38 },
  { start: 4, end: 14 },
  { start: 9, end: 31 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 36, end: 44 },
  { start: 51, end: 67 },
  { start: 71, end: 91 },
  { start: 80, end: 100 },
];

const PLAYER_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const initialGameState: GameState = {
  settings: {
    boardSize: 10,
    numberOfPlayers: 2,
    snakes: DEFAULT_SNAKES,
    ladders: DEFAULT_LADDERS,
    turnCount: 0,
  },
  players: [],
  currentPlayerIndex: 0,
  dice: {
    value: 1,
    rolling: false,
  },
  winner: null,
  status: 'setup',
  moveInProgress: false,
  message: 'Welcome to Snake and Ladder! Start a new game.',
};

interface GameContextProps {
  gameState: GameState;
  initGame: (numberOfPlayers: number, boardSize: number) => void;
  rollDice: () => void;
  movePlayer: (playerId: number, newPosition: number, diceValue: number, isSnake?: boolean, isLadder?: boolean) => void;
  resetGame: () => void;
  nextTurn: () => void;
  updatePlayerName: (playerId: number, name: string) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const initGame = (numberOfPlayers: number, boardSize: number) => {
    // Create initial players
    const players: Player[] = Array.from({ length: numberOfPlayers }).map((_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      color: PLAYER_COLORS[index],
      position: 0, // Start at position 0 (before the board)
      isActive: index === 0, // First player is active
      moveHistory: [],
      lastMove: null,
      animating: false,
    }));

    // Initialize game state
    setGameState({
      ...initialGameState,
      settings: {
        ...initialGameState.settings,
        boardSize,
        numberOfPlayers,
        turnCount: 0,
      },
      players,
      currentPlayerIndex: 0,
      winner: null,
      status: 'playing',
      message: 'Game started! Roll the dice to begin.',
    });
  };

  const updatePlayerName = (playerId: number, name: string) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId) {
          return { ...player, name };
        }
        return player;
      });

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const rollDice = () => {
    if (gameState.dice.rolling || gameState.moveInProgress || gameState.status !== 'playing') {
      return;
    }

    // Set dice as rolling
    setGameState((prev) => ({
      ...prev,
      dice: {
        ...prev.dice,
        rolling: true,
      },
      message: 'Rolling the dice...',
    }));

    // Simulate dice rolling animation
    const rollInterval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        dice: {
          ...prev.dice,
          value: Math.floor(Math.random() * 6) + 1,
        },
      }));
    }, 100);

    // Stop rolling after a delay
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;

      setGameState((prev) => {
        const currentPlayer = prev.players[prev.currentPlayerIndex];
        let newPosition = currentPlayer.position + finalValue;
        const maxPosition = prev.settings.boardSize * prev.settings.boardSize;

        // Check if exceeding max position
        if (newPosition > maxPosition) {
          newPosition = currentPlayer.position;
          return {
            ...prev,
            dice: {
              value: finalValue,
              rolling: false,
            },
            moveInProgress: false,
            message: 'You need exact roll to reach 100. Try again next turn.',
          };
        }

        return {
          ...prev,
          dice: {
            value: finalValue,
            rolling: false,
          },
          moveInProgress: newPosition !== currentPlayer.position,
          message: `${currentPlayer.name} rolled a ${finalValue}. Moving from ${currentPlayer.position} to ${newPosition}.`,
        };
      });

      // Move player after dice is set
      setTimeout(() => {
        movePlayerAfterRoll(finalValue);
      }, 500);
    }, 1000);
  };

  const movePlayerAfterRoll = (diceValue: number) => {
    const { currentPlayerIndex, players, settings } = gameState;
    const currentPlayer = players[currentPlayerIndex];
    const newPosition = currentPlayer.position + diceValue;

    // Check for board boundaries
    const maxPosition = settings.boardSize * settings.boardSize;
    if (newPosition > maxPosition) {
      setGameState((prev) => ({
        ...prev,
        moveInProgress: false,
        message: 'You need exact roll to reach 100. Try again next turn.',
      }));
      nextTurn();
      return;
    }

    movePlayer(currentPlayer.id, newPosition, diceValue);
  };

  const movePlayer = (playerId: number, newPosition: number, diceValue: number, isSnake = false, isLadder = false) => {
    setGameState((prev) => {
      const { turnCount } = prev.settings;
      const currentPlayer = prev.players.find(p => p.id === playerId);
      const oldPosition = currentPlayer?.position || 0;

      // Create new move record
      const newMove: PlayerMove = {
        from: oldPosition,
        to: newPosition,
        diceValue,
        isSnake,
        isLadder,
        turnNumber: turnCount,
      };

      const updatedPlayers = prev.players.map((player) => {
        if (player.id === playerId) {
          const updatedMoveHistory = [...player.moveHistory, newMove];
          return {
            ...player,
            position: newPosition,
            animating: true,
            lastMove: newMove,
            moveHistory: updatedMoveHistory,
          };
        }
        return player;
      });

      const messagePrefix = isSnake
        ? '🐍 Oh no! You landed on a snake!'
        : isLadder
          ? '🪜 Great! You found a ladder!'
          : '';

      return {
        ...prev,
        players: updatedPlayers,
        moveInProgress: true,
        settings: {
          ...prev.settings,
          turnCount: isSnake || isLadder ? turnCount : turnCount + 1,
        },
        message: messagePrefix
          ? `${messagePrefix} Moving from ${oldPosition} to ${newPosition}.`
          : `Moving from ${oldPosition} to ${newPosition}.`,
      };
    });

    // Stop the animation after a short delay
    setTimeout(() => {
      setGameState((prev) => {
        const updatedPlayers = prev.players.map((player) => {
          if (player.id === playerId) {
            return { ...player, animating: false };
          }
          return player;
        });

        return {
          ...prev,
          players: updatedPlayers,
        };
      });

      // Check for snakes and ladders after movement animation completes
      setTimeout(() => {
        checkSnakesAndLadders(playerId, newPosition);
      }, 300);
    }, 500);
  };

  const checkSnakesAndLadders = (playerId: number, position: number) => {
    const { snakes, ladders } = gameState.settings;
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    // Check for snakes
    const snake = snakes.find((s) => s.start === position);
    if (snake) {
      // Create delay for more realistic snake sliding effect
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          message: `🐍 Oh no! ${player.name} landed on a snake at ${position}!`,
        }));

        setTimeout(() => {
          movePlayer(playerId, snake.end, 0, true, false);
        }, 700);
      }, 300);
      return;
    }

    // Check for ladders
    const ladder = ladders.find((l) => l.start === position);
    if (ladder) {
      // Create delay for more realistic ladder climbing effect
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          message: `🪜 Great! ${player.name} found a ladder at ${position}!`,
        }));

        setTimeout(() => {
          movePlayer(playerId, ladder.end, 0, false, true);
        }, 700);
      }, 300);
      return;
    }

    // Check for win condition
    const maxPosition = gameState.settings.boardSize * gameState.settings.boardSize;
    if (position === maxPosition) {
      const winner = gameState.players.find((p) => p.id === playerId) || null;
      setGameState((prev) => ({
        ...prev,
        winner,
        status: 'gameOver',
        moveInProgress: false,
        message: `🎉 ${winner?.name} wins the game after ${prev.settings.turnCount} turns!`,
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      moveInProgress: false,
    }));
    nextTurn();
  };

  const nextTurn = () => {
    if (gameState.status !== 'playing') {
      return;
    }

    setGameState((prev) => {
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextPlayerIndex];
      const updatedPlayers = prev.players.map((player, index) => ({
        ...player,
        isActive: index === nextPlayerIndex,
      }));

      return {
        ...prev,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        message: `${nextPlayer.name}'s turn. Roll the dice!`,
      };
    });
  };

  const resetGame = () => {
    setGameState({
      ...initialGameState,
      message: 'Game reset. Set up a new game!',
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        initGame,
        rollDice,
        movePlayer,
        resetGame,
        nextTurn,
        updatePlayerName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
