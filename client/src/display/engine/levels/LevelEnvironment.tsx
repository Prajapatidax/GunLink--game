import React from 'react';
import { Stars, Grid } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { LEVEL_REGISTRY } from '@gunlink/shared';
import { useGameStore } from '../../../shared/store/useGameStore';

export const LevelEnvironment: React.FC = () => {
  const currentLevelId = useGameStore((s) => s.currentLevel);
  const theme = useGameStore((s) => s.theme);
  const levelConfig = LEVEL_REGISTRY[currentLevelId] || LEVEL_REGISTRY.TRAINING;

  const isLight = theme === 'light';
  const groundColor = isLight ? '#e2e8f0' : levelConfig.groundColor;
  const gridCellColor = isLight ? '#0284c7' : levelConfig.lightColor;
  const gridSectionColor = isLight ? '#0284c7' : levelConfig.accentColor;

  return (
    <group>
      {/* High-Visibility 3D Environment Lighting */}
      <ambientLight intensity={isLight ? 2.0 : 1.5} color="#ffffff" />
      <directionalLight position={[12, 25, 15]} intensity={isLight ? 3.0 : 2.5} color="#ffffff" castShadow />
      <pointLight position={[-15, 12, -10]} intensity={2.0} color={levelConfig.lightColor} />
      <pointLight position={[15, 12, -10]} intensity={1.5} color={levelConfig.accentColor} />

      {/* Atmospheric Background */}
      {!isLight && <Stars radius={50} depth={50} count={2500} factor={4} saturation={0.5} fade speed={1.5} />}

      {/* Ground Surface */}
      <RigidBody type="fixed">
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color={groundColor} roughness={0.4} metalness={0.2} />
        </mesh>
      </RigidBody>

      {/* Interactive Grid Lines */}
      <Grid
        position={[0, 0, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={1.0}
        cellColor={gridCellColor}
        sectionSize={5}
        sectionThickness={2.0}
        sectionColor={gridSectionColor}
        fadeDistance={45}
        fadeStrength={1.5}
      />

      {/* Arena Barrier Pillars */}
      <group position={[0, 0, -20]}>
        <RigidBody type="fixed">
          <mesh position={[-15, 4, 0]}>
            <boxGeometry args={[1.2, 8, 1.2]} />
            <meshStandardMaterial color={levelConfig.lightColor} emissive={levelConfig.lightColor} emissiveIntensity={0.8} />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed">
          <mesh position={[15, 4, 0]}>
            <boxGeometry args={[1.2, 8, 1.2]} />
            <meshStandardMaterial color={levelConfig.accentColor} emissive={levelConfig.accentColor} emissiveIntensity={0.8} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
