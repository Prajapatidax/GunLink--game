import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Weapon3D } from './Weapon3D';
import { BotSpawner } from './BotSpawner';

export const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#040814]">
      <Canvas
        camera={{ position: [0, 1.4, 0], fov: 65, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 15]} intensity={1.2} color="#00f0ff" />
        <pointLight position={[-10, -5, -10]} intensity={0.8} color="#ff0055" />

        {/* Space & Star Background */}
        <Stars radius={50} depth={50} count={2500} factor={4} saturation={0.5} fade speed={1.5} />

        <Physics gravity={[0, -9.81, 0]}>
          {/* Cyber Ground Grid Surface */}
          <RigidBody type="fixed">
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#050b18" roughness={0.8} metalness={0.5} />
            </mesh>
          </RigidBody>

          {/* Grid Lines */}
          <Grid
            position={[0, 0, 0]}
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.8}
            cellColor="#00f0ff"
            sectionSize={5}
            sectionThickness={1.5}
            sectionColor="#ff0055"
            fadeDistance={40}
            fadeStrength={1.5}
          />

          {/* Arena Barrier Pillars */}
          <group position={[0, 0, -20]}>
            <RigidBody type="fixed">
              <mesh position={[-15, 4, 0]}>
                <boxGeometry args={[1, 8, 1]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} />
              </mesh>
            </RigidBody>
            <RigidBody type="fixed">
              <mesh position={[15, 4, 0]}>
                <boxGeometry args={[1, 8, 1]} />
                <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} />
              </mesh>
            </RigidBody>
          </group>

          {/* Procedural Enemies */}
          <BotSpawner />
        </Physics>

        {/* In-Game Weapon mounted to camera */}
        <Weapon3D />

        {/* Orbit Controls (Only for mouse debug testing when phone not connected) */}
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    </div>
  );
};
