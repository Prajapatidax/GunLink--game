import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { LevelEnvironment } from '../engine/levels/LevelEnvironment';
import { EnemyManager } from '../engine/enemies/EnemyManager';
import { WeaponManager } from '../engine/weapons/WeaponManager';
import { useGameStore } from '../../shared/store/useGameStore';

export const Scene3D: React.FC = () => {
  const theme = useGameStore((s) => s.theme);
  const isLight = theme === 'light';

  return (
    <div className={`w-full h-full absolute inset-0 transition-colors ${isLight ? 'bg-slate-200' : 'bg-[#040814]'}`}>
      <Canvas
        camera={{ position: [0, 1.5, 0], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Physics gravity={[0, -9.81, 0]}>
          {/* Level Environment & Ambient/Directional Lighting */}
          <LevelEnvironment />

          {/* FSM AI Enemy Manager (3D Bots) */}
          <EnemyManager />
        </Physics>

        {/* Dynamic 3D Weapon Manager */}
        <WeaponManager />
      </Canvas>
    </div>
  );
};
