import React from 'react';
import { WeaponId } from '@gunlink/shared';

interface WeaponFallbackProps {
  weaponId: WeaponId;
  muzzleFlash?: boolean;
  recoilProgress?: number;
}

export const WeaponFallbackRenderer: React.FC<WeaponFallbackProps> = ({ weaponId, muzzleFlash }) => {
  switch (weaponId) {
    case 'PISTOL':
      return (
        <group>
          <mesh position={[0, 0.12, -0.2]}>
            <boxGeometry args={[0.09, 0.1, 0.45]} />
            <meshStandardMaterial color="#1a233a" roughness={0.2} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.175, -0.2]}>
            <boxGeometry args={[0.07, 0.02, 0.4]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, -0.05, -0.05]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.08, 0.28, 0.12]} />
            <meshStandardMaterial color="#0d1424" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'RIFLE':
      return (
        <group>
          {/* Long Barrel & Handguard */}
          <mesh position={[0, 0.1, -0.45]}>
            <boxGeometry args={[0.1, 0.12, 0.8]} />
            <meshStandardMaterial color="#141c2e" metalness={0.8} />
          </mesh>
          {/* Magazine */}
          <mesh position={[0, -0.15, -0.25]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.07, 0.35, 0.12]} />
            <meshStandardMaterial color="#0a0f1c" />
          </mesh>
          {/* Scope / Optic */}
          <mesh position={[0, 0.2, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2]} />
            <meshStandardMaterial color="#00a2ff" emissive="#00a2ff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      );

    case 'SHOTGUN':
      return (
        <group>
          {/* Twin Heavy Barrels */}
          <mesh position={[-0.04, 0.1, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.7]} />
            <meshStandardMaterial color="#2d0a14" metalness={0.9} />
          </mesh>
          <mesh position={[0.04, 0.1, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.7]} />
            <meshStandardMaterial color="#2d0a14" metalness={0.9} />
          </mesh>
          {/* Heavy Foregrip */}
          <mesh position={[0, 0.02, -0.45]}>
            <boxGeometry args={[0.16, 0.12, 0.3]} />
            <meshStandardMaterial color="#ff2a5f" emissive="#ff2a5f" emissiveIntensity={0.3} />
          </mesh>
        </group>
      );

    case 'SNIPER':
      return (
        <group>
          {/* Extra Long Precision Railgun Barrel */}
          <mesh position={[0, 0.1, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
          {/* High Power Sniper Scope */}
          <mesh position={[0, 0.22, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.35]} />
            <meshStandardMaterial color="#ffb700" emissive="#ffb700" emissiveIntensity={1.2} />
          </mesh>
        </group>
      );

    case 'SMG':
      return (
        <group>
          {/* Compact Frame */}
          <mesh position={[0, 0.08, -0.25]}>
            <boxGeometry args={[0.09, 0.14, 0.35]} />
            <meshStandardMaterial color="#091426" metalness={0.7} />
          </mesh>
          {/* Extended Mag */}
          <mesh position={[0, -0.18, -0.15]}>
            <boxGeometry args={[0.05, 0.4, 0.08]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} />
          </mesh>
        </group>
      );

    case 'ROCKET':
      return (
        <group>
          {/* Massive Launch Tube */}
          <mesh position={[0, 0.15, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.9]} />
            <meshStandardMaterial color="#360a18" metalness={0.8} />
          </mesh>
          {/* Front Rocket Warhead Tip */}
          <mesh position={[0, 0.15, -0.95]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.13, 0.25]} />
            <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={1.5} />
          </mesh>
        </group>
      );

    case 'LASER':
      return (
        <group>
          {/* Quantum Beam Coil */}
          <mesh position={[0, 0.12, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.7]} />
            <meshStandardMaterial color="#1a042d" metalness={0.9} />
          </mesh>
          {/* Energy Ring Emitters */}
          <mesh position={[0, 0.12, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.11, 0.02, 16, 32]} />
            <meshStandardMaterial color="#aa00ff" emissive="#aa00ff" emissiveIntensity={3.0} />
          </mesh>
        </group>
      );

    default:
      return (
        <mesh position={[0, 0.12, -0.2]}>
          <boxGeometry args={[0.09, 0.1, 0.45]} />
          <meshStandardMaterial color="#1a233a" />
        </mesh>
      );
  }
};
