import React, { useEffect, useState } from 'react';
import { useGameStore } from './shared/store/useGameStore';
import { socketClient } from './shared/socket/socketClient';
import { LandingPage } from './display/components/LandingPage';
import { Scene3D } from './display/game/Scene3D';
import { HUD } from './display/components/HUD';
import { GameOverModal } from './display/components/GameOverModal';
import { ControllerView } from './controller/ControllerView';

export const App: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const tickGameTimer = useGameStore((s) => s.tickGameTimer);
  const [isControllerRoute, setIsControllerRoute] = useState(false);

  useEffect(() => {
    // Check if user navigated to mobile controller URL (e.g. /#/controller)
    const checkRoute = () => {
      const isController = window.location.hash.includes('/controller') || window.location.pathname.includes('/controller');
      setIsControllerRoute(isController);
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    // Initialize Socket.IO connection
    socketClient.init();

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, []);

  // Main 1-second Game Loop Timer
  useEffect(() => {
    let interval: any = null;
    if (gamePhase === 'PLAYING') {
      interval = setInterval(() => {
        tickGameTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase, tickGameTimer]);

  // Mobile Controller Route
  if (isControllerRoute) {
    return <ControllerView />;
  }

  // Desktop Display Route
  if (gamePhase === 'LANDING') {
    return <LandingPage />;
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#040814] select-none">
      {/* 3D WebGL Canvas */}
      <Scene3D />

      {/* Cyberpunk HUD Overlay */}
      <HUD />

      {/* Game Over Modal */}
      <GameOverModal />
    </div>
  );
};

export default App;
