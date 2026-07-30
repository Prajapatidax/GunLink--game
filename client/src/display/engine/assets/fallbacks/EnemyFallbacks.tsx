import React from 'react';
import { EnemyTypeId } from '@gunlink/shared';

interface FallbackProps {
  color?: string;
  isHit?: boolean;
}

export const RobotFallback: React.FC<FallbackProps> = ({ color = '#00f0ff', isHit }) => {
  const activeColor = isHit ? '#ffffff' : color;
  return (
    <group>
      {/* Legs */}
      <mesh position={[-0.25, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.25, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Bright Torso Box */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Glowing Sphere Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 4 : 1.5} />
      </mesh>
    </group>
  );
};

export const ZombieFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const bodyColor = isHit ? '#ffffff' : '#22c55e';
  const eyeColor = isHit ? '#ffffff' : '#ef4444';
  return (
    <group>
      {/* Mutant Green Capsule Body */}
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.32, 0.9, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Glowing Red Eyes */}
      <mesh position={[-0.12, 1.45, 0.24]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3.0} />
      </mesh>
      <mesh position={[0.12, 1.45, 0.24]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={3.0} />
      </mesh>
    </group>
  );
};

export const AlienFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#a855f7';
  return (
    <group>
      {/* Slender Purple Torso */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.14, 0.1, 1.1]} />
        <meshStandardMaterial color="#581c87" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Bulbous Alien Head */}
      <mesh position={[0, 1.5, 0]} scale={[1.3, 1.6, 1.3]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 4 : 2.0} />
      </mesh>
    </group>
  );
};

export const SoldierFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const armorColor = isHit ? '#ffffff' : '#334155';
  const visorColor = isHit ? '#ffffff' : '#eab308';
  return (
    <group>
      {/* Armored Legs */}
      <mesh position={[-0.2, 0.45, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.2, 0.45, 0]}>
        <boxGeometry args={[0.18, 0.9, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Armored Chest Plate */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.7, 0.65, 0.4]} />
        <meshStandardMaterial color={armorColor} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Helmet & Golden Visor */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 1.65, 0.16]}>
        <boxGeometry args={[0.32, 0.1, 0.12]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

export const AnimalFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#f43f5e';
  return (
    <group position={[0, 0.4, 0]}>
      {/* Quadruped Hound Body */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.95]} />
        <meshStandardMaterial color="#881337" metalness={0.8} />
      </mesh>
      {/* Hound Head & Glowing Jaws */}
      <mesh position={[0, 0.25, -0.5]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 4 : 2.0} />
      </mesh>
    </group>
  );
};

export const DroneFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#06b6d4';
  return (
    <group position={[0, 0, 0]}>
      {/* Flying Box Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.22, 0.55]} />
        <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Central Eye Sensor */}
      <mesh position={[0, 0, -0.28]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 5 : 3.0} />
      </mesh>
      {/* Rotor Rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.04, 16, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} />
      </mesh>
    </group>
  );
};

export const BossFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#ec4899';
  return (
    <group position={[0, 0, 0]}>
      {/* Massive Mech Legs */}
      <mesh position={[-0.6, 0.8, 0]}>
        <boxGeometry args={[0.45, 1.6, 0.45]} />
        <meshStandardMaterial color="#4c0519" metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]}>
        <boxGeometry args={[0.45, 1.6, 0.45]} />
        <meshStandardMaterial color="#4c0519" metalness={0.9} />
      </mesh>
      {/* Giant Titan Chest */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1.7, 1.3, 1.0]} />
        <meshStandardMaterial color="#831843" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* Shoulder Cannon Pods */}
      <mesh position={[-1.05, 2.8, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.85]} />
        <meshStandardMaterial color="#be123c" />
      </mesh>
      <mesh position={[1.05, 2.8, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.85]} />
        <meshStandardMaterial color="#be123c" />
      </mesh>
      {/* Glowing Titan Core */}
      <mesh position={[0, 2.3, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.12, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 5 : 3.0} />
      </mesh>
    </group>
  );
};

export const EnemyFallbackRenderer: React.FC<{ typeId: EnemyTypeId; isHit?: boolean }> = ({ typeId, isHit }) => {
  switch (typeId) {
    case 'ROBOT':
      return <RobotFallback isHit={isHit} />;
    case 'ZOMBIE':
      return <ZombieFallback isHit={isHit} />;
    case 'ALIEN':
      return <AlienFallback isHit={isHit} />;
    case 'SOLDIER':
      return <SoldierFallback isHit={isHit} />;
    case 'ANIMAL':
      return <AnimalFallback isHit={isHit} />;
    case 'DRONE':
      return <DroneFallback isHit={isHit} />;
    case 'BOSS':
      return <BossFallback isHit={isHit} />;
    default:
      return <RobotFallback isHit={isHit} />;
  }
};
