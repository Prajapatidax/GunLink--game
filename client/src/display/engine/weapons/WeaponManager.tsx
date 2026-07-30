import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WEAPON_REGISTRY } from '@gunlink/shared';
import { WeaponModelLoader } from '../assets/ModelLoader';
import { useGameStore } from '../../../shared/store/useGameStore';
import { soundManager } from '../../audio/SoundManager';

export const WeaponManager: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const recoilRef = useRef<THREE.Group>(null);
  const muzzleLightRef = useRef<THREE.PointLight>(null);

  const currentWeaponId = useGameStore((s) => s.currentWeapon);
  const aimPitchYaw = useGameStore((s) => s.aimPitchYaw);
  const recoilTriggered = useGameStore((s) => s.recoilTriggered);
  const isReloading = useGameStore((s) => s.isReloading);

  const weaponStats = WEAPON_REGISTRY[currentWeaponId] || WEAPON_REGISTRY.PISTOL;

  // Recoil physics springs
  const recoilOffset = useRef({ z: 0, rotX: 0 });
  const lastRecoilTime = useRef(0);

  useEffect(() => {
    if (recoilTriggered > 0 && recoilTriggered !== lastRecoilTime.current) {
      lastRecoilTime.current = recoilTriggered;
      const intensity = weaponStats.recoilIntensity;
      recoilOffset.current.z = -0.35 * intensity;
      recoilOffset.current.rotX = 0.3 * intensity;

      // Play audio based on weapon sound type
      soundManager.playGunshot();

      // Muzzle light pulse
      if (muzzleLightRef.current) {
        muzzleLightRef.current.intensity = 18;
      }
    }
  }, [recoilTriggered, weaponStats]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp aiming angles
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
        {/* Dynamic 3D Weapon Model (GLB or Procedural Fallback) */}
        <WeaponModelLoader weaponId={currentWeaponId} />

        {/* Muzzle Flash Point Light */}
        <pointLight
          ref={muzzleLightRef}
          position={[0, 0.12, -0.6]}
          color={weaponStats.muzzleColor}
          intensity={0}
          distance={10}
        />
      </group>
    </group>
  );
};
