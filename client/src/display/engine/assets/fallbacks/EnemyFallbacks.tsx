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
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color="#131b2e" roughness={0.4} />
      </mesh>
      <mesh position={[0.25, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color="#131b2e" roughness={0.4} />
      </mesh>
      {/* Torso Box */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial color="#0f192d" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Sphere Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 3 : 0.8} />
      </mesh>
    </group>
  );
};

export const ZombieFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const bodyColor = isHit ? '#ffffff' : '#1e381e';
  const eyeColor = isHit ? '#ffffff' : '#ff0033';
  return (
    <group>
      {/* Mutant Green Capsule Body */}
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.3, 0.9, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      {/* Glowing Red Eyes */}
      <mesh position={[-0.1, 1.45, 0.22]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.1, 1.45, 0.22]}>
        <sphereGeometry args={[0.1, 1.45, 0.22]} />
        <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

export const AlienFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#aa00ff';
  return (
    <group>
      {/* Thin Slender Torso */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 1.1]} />
        <meshStandardMaterial color="#2d053d" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Bulbous Alien Head */}
      <mesh position={[0, 1.5, 0]} scale={[1.2, 1.5, 1.2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 3 : 1.0} wireframe />
      </mesh>
    </group>
  );
};

export const SoldierFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const armorColor = isHit ? '#ffffff' : '#2b3648';
  const visorColor = isHit ? '#ffffff' : '#ffb700';
  return (
    <group>
      {/* Armored Legs */}
      <mesh position={[-0.2, 0.45, 0]}>
        <boxGeometry args={[0.16, 0.9, 0.18]} />
        <meshStandardMaterial color="#141a24" />
      </mesh>
      <mesh position={[0.2, 0.45, 0]}>
        <boxGeometry args={[0.16, 0.9, 0.18]} />
        <meshStandardMaterial color="#141a24" />
      </mesh>
      {/* Armored Chest Plate */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.65, 0.6, 0.35]} />
        <meshStandardMaterial color={armorColor} metalness={0.7} />
      </mesh>
      {/* Helmet & Golden Visor */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#141a24" />
      </mesh>
      <mesh position={[0, 1.65, 0.15]}>
        <boxGeometry args={[0.3, 0.08, 0.1]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

export const AnimalFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#ff2a5f';
  return (
    <group position={[0, 0.4, 0]}>
      {/* Quadruped Hound Body */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.9]} />
        <meshStandardMaterial color="#1f0a14" metalness={0.8} />
      </mesh>
      {/* Hound Head & Red Jaws */}
      <mesh position={[0, 0.25, -0.5]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 3 : 1.2} />
      </mesh>
    </group>
  );
};

export const DroneFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#00f0ff';
  return (
    <group position={[0, 0, 0]}>
      {/* Flying Box Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color="#0c182b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Central Eye Sensor */}
      <mesh position={[0, 0, -0.26]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 4 : 2.0} />
      </mesh>
      {/* Rotor Rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 16, 32]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} />
      </mesh>
    </group>
  );
};

export const BossFallback: React.FC<FallbackProps> = ({ isHit }) => {
  const activeColor = isHit ? '#ffffff' : '#ff0055';
  return (
    <group position={[0, 0, 0]}>
      {/* Massive Mech Legs */}
      <mesh position={[-0.6, 0.8, 0]}>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial color="#1a050f" metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]}>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial color="#1a050f" metalness={0.9} />
      </mesh>
      {/* Giant Titan Chest */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[1.6, 1.2, 0.9]} />
        <meshStandardMaterial color="#2b0a1a" metalness={0.85} roughness={0.1} />
      </mesh>
      {/* Shoulder Cannon Pods */}
      <mesh position={[-1.0, 2.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8]} />
        <meshStandardMaterial color="#3d0f25" />
      </mesh>
      <mesh position={[1.0, 2.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8]} />
        <meshStandardMaterial color="#3d0f25" />
      </mesh>
      {/* Glowing Titan Core */}
      <mesh position={[0, 2.3, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color={activeColor} emissive={activeColor} emissiveIntensity={isHit ? 4 : 2.5} />
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
