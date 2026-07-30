import React from 'react';
import { Stars, Grid } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { LEVEL_REGISTRY } from '@gunlink/shared';
import { useGameStore } from '../../../shared/store/useGameStore';

export const LevelEnvironment: React.FC = () => {
  const currentLevelId = useGameStore((s) => s.currentLevel);
  const levelConfig = LEVEL_REGISTRY[currentLevelId] || LEVEL_REGISTRY.TRAINING;

  return (
    <group>
      {/* Dynamic Ambient & Directional Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 15]} intensity={1.2} color={levelConfig.lightColor} />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color={levelConfig.accentColor} />

      {/* Atmospheric Stars */}
      <Stars radius={50} depth={50} count={2500} factor={4} saturation={0.5} fade speed={1.5} />

      {/* Environment Ground Surface */}
      <RigidBody type="fixed">
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={levelConfig.groundColor} roughness={0.8} metalness={0.5} />
        </mesh>
      </RigidBody>

      {/* Cyber Grid Lines */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.8}
        cellColor={levelConfig.lightColor}
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor={levelConfig.accentColor}
        fadeDistance={40}
        fadeStrength={1.5}
      />

      {/* Arena Barrier Pillars */}
      <group position={[0, 0, -20]}>
        <RigidBody type="fixed">
          <mesh position={[-15, 4, 0]}>
            <boxGeometry args={[1, 8, 1]} />
            <meshStandardMaterial color={levelConfig.lightColor} emissive={levelConfig.lightColor} emissiveIntensity={0.6} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed">
          <mesh position={[15, 4, 0]}>
            <boxGeometry args={[1, 8, 1]} />
            <meshStandardMaterial color={levelConfig.accentColor} emissive={levelConfig.accentColor} emissiveIntensity={0.6} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
