import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../shared/store/useGameStore';
import { soundManager } from '../audio/SoundManager';

export const Weapon3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const recoilRef = useRef<THREE.Group>(null);
  const muzzleLightRef = useRef<THREE.PointLight>(null);

  const aimPitchYaw = useGameStore((s) => s.aimPitchYaw);
  const recoilTriggered = useGameStore((s) => s.recoilTriggered);
  const isReloading = useGameStore((s) => s.isReloading);

  // Recoil physics springs
  const recoilOffset = useRef({ z: 0, rotX: 0 });
  const lastRecoilTime = useRef(0);

  useEffect(() => {
    if (recoilTriggered > 0 && recoilTriggered !== lastRecoilTime.current) {
      lastRecoilTime.current = recoilTriggered;
      recoilOffset.current.z = -0.35;
      recoilOffset.current.rotX = 0.25;

      // Play audio
      soundManager.playGunshot();

      // Muzzle light pulse
      if (muzzleLightRef.current) {
        muzzleLightRef.current.intensity = 15;
      }
    }
  }, [recoilTriggered]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smoothly lerp aiming angles (yaw -> Y rot, pitch -> X rot)
    const targetRotY = aimPitchYaw.yaw;
    const targetRotX = aimPitchYaw.pitch;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 20);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 20);

    // Lerp recoil recovery spring
    recoilOffset.current.z = THREE.MathUtils.lerp(recoilOffset.current.z, 0, delta * 18);
    recoilOffset.current.rotX = THREE.MathUtils.lerp(recoilOffset.current.rotX, 0, delta * 18);

    if (recoilRef.current) {
      recoilRef.current.position.z = recoilOffset.current.z;
      recoilRef.current.rotation.x = recoilOffset.current.rotX;
    }

    // Decay muzzle light
    if (muzzleLightRef.current && muzzleLightRef.current.intensity > 0) {
      muzzleLightRef.current.intensity = THREE.MathUtils.lerp(muzzleLightRef.current.intensity, 0, delta * 35);
    }

    // Reload animation dip
    if (isReloading && recoilRef.current) {
      recoilRef.current.rotation.x = THREE.MathUtils.lerp(recoilRef.current.rotation.x, -0.6, delta * 8);
      recoilRef.current.position.y = THREE.MathUtils.lerp(recoilRef.current.position.y, -0.4, delta * 8);
    } else if (recoilRef.current) {
      recoilRef.current.position.y = THREE.MathUtils.lerp(recoilRef.current.position.y, 0, delta * 12);
    }
  });

  return (
    <group ref={groupRef} position={[0.45, -0.4, -0.75]}>
      <group ref={recoilRef}>
        {/* Weapon Frame (Pistol Body) */}
        {/* Slide */}
        <mesh position={[0, 0.12, -0.2]}>
          <boxGeometry args={[0.09, 0.1, 0.45]} />
          <meshStandardMaterial color="#1a233a" roughness={0.2} metalness={0.85} />
        </mesh>

        {/* Top Metallic Rail */}
        <mesh position={[0, 0.175, -0.2]}>
          <boxGeometry args={[0.07, 0.02, 0.4]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.1} metalness={0.9} emissive="#00f0ff" emissiveIntensity={0.2} />
        </mesh>

        {/* Barrel Tip */}
        <mesh position={[0, 0.12, -0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
          <meshStandardMaterial color="#0b0f19" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Handle Grip */}
        <mesh position={[0, -0.05, -0.05]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.08, 0.28, 0.12]} />
          <meshStandardMaterial color="#0d1424" roughness={0.6} />
        </mesh>

        {/* Cyber Neon Accents */}
        <mesh position={[0.046, 0.1, -0.15]}>
          <boxGeometry args={[0.005, 0.04, 0.25]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[-0.046, 0.1, -0.15]}>
          <boxGeometry args={[0.005, 0.04, 0.25]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.0} />
        </mesh>

        {/* Muzzle Flash Point Light */}
        <pointLight ref={muzzleLightRef} position={[0, 0.12, -0.55]} color="#00f0ff" intensity={0} distance={8} />

        {/* Muzzle Flash Core Mesh */}
        {useGameStore((s) => s.muzzleFlashTriggered) > Date.now() - 60 && (
          <mesh position={[0, 0.12, -0.55]} rotation={[0, 0, Math.random() * Math.PI]}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.9} />
          </mesh>
        )}
      </group>
    </group>
  );
};
