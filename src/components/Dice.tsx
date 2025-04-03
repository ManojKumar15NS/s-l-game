import type React from 'react';
import { useGameContext } from '../context/GameContext';

interface DiceProps {
  size?: number;
}

const Dice: React.FC<DiceProps> = ({ size = 80 }) => {
  const { gameState, rollDice } = useGameContext();
  const { dice, status, moveInProgress } = gameState;

  // Define dice face patterns
  const diceFaces = [
    // Face 1
    <svg key="face-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="10" fill="currentColor" />
    </svg>,
    // Face 2
    <svg key="face-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="10" fill="currentColor" />
      <circle cx="70" cy="70" r="10" fill="currentColor" />
    </svg>,
    // Face 3
    <svg key="face-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="10" fill="currentColor" />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <circle cx="70" cy="70" r="10" fill="currentColor" />
    </svg>,
    // Face 4
    <svg key="face-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="10" fill="currentColor" />
      <circle cx="70" cy="30" r="10" fill="currentColor" />
      <circle cx="30" cy="70" r="10" fill="currentColor" />
      <circle cx="70" cy="70" r="10" fill="currentColor" />
    </svg>,
    // Face 5
    <svg key="face-5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="10" fill="currentColor" />
      <circle cx="70" cy="30" r="10" fill="currentColor" />
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <circle cx="30" cy="70" r="10" fill="currentColor" />
      <circle cx="70" cy="70" r="10" fill="currentColor" />
    </svg>,
    // Face 6
    <svg key="face-6" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="25" r="10" fill="currentColor" />
      <circle cx="70" cy="25" r="10" fill="currentColor" />
      <circle cx="30" cy="50" r="10" fill="currentColor" />
      <circle cx="70" cy="50" r="10" fill="currentColor" />
      <circle cx="30" cy="75" r="10" fill="currentColor" />
      <circle cx="70" cy="75" r="10" fill="currentColor" />
    </svg>,
  ];

  const handleDiceClick = () => {
    if (status === 'playing' && !dice.rolling && !moveInProgress) {
      rollDice();
    }
  };

  return (
    <div
      className={`dice ${dice.rolling ? 'animate-spin' : ''} ${
        moveInProgress || status !== 'playing' ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
      }`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: dice.rolling ? '#6366f1' : '#1e293b',
        transform: dice.rolling ? 'rotateX(45deg) rotateY(45deg)' : 'none',
        transition: 'all 0.3s ease',
      }}
      onClick={handleDiceClick}
    >
      {diceFaces[dice.value - 1]}
    </div>
  );
};

export default Dice;
