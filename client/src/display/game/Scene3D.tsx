import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { LevelEnvironment } from '../engine/levels/LevelEnvironment';
import { EnemyManager } from '../engine/enemies/EnemyManager';
import { WeaponManager } from '../engine/weapons/WeaponManager';

export const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#040814]">
      <Canvas
        camera={{ position: [0, 1.4, 0], fov: 65, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Physics gravity={[0, -9.81, 0]}>
          {/* Level Environment & Lighting */}
          <LevelEnvironment />

          {/* FSM AI Enemy Manager */}
          <EnemyManager />
        </Physics>

        {/* Polymorphic 3D Weapon Manager */}
        <WeaponManager />
      </Canvas>
    </div>
  );
};
