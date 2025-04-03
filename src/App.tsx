import React from 'react';
import { GameProvider } from './context/GameContext';
import Game from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}

export default App;
