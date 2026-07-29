import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GAME_CONSTANTS } from '@gunlink/shared';
import { useGameStore } from '../../shared/store/useGameStore';
import { soundManager } from '../audio/SoundManager';

interface BotInstance {
  id: string;
  type: 'SCOUT' | 'HEAVY' | 'DRONE';
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  rotationY: number;
  health: number;
  maxHealth: number;
  isDead: boolean;
  hitTimer: number;
  speed: number;
  radius: number;
  headOffset: number;
}

export const BotSpawner: React.FC = () => {
  const [bots, setBots] = useState<BotInstance[]>([]);
  const recoilTriggered = useGameStore((s) => s.aimPitchYaw);
  const registerHit = useGameStore((s) => s.registerHit);
  const gamePhase = useGameStore((s) => s.gamePhase);

  // Initialize procedural bot targets in a semicircle arena layout
  useEffect(() => {
    if (gamePhase !== 'PLAYING') return;

    const initialBots: BotInstance[] = [
      {
        id: 'bot_scout_1',
        type: 'SCOUT',
        position: new THREE.Vector3(-4, 0, -8),
        basePosition: new THREE.Vector3(-4, 0, -8),
        targetPosition: new THREE.Vector3(-2, 0, -9),
        rotationY: 0,
        health: 70,
        maxHealth: 70,
        isDead: false,
        hitTimer: 0,
        speed: 2.2,
        radius: 0.7,
        headOffset: 1.6
      },
      {
        id: 'bot_scout_2',
        type: 'SCOUT',
        position: new THREE.Vector3(4, 0, -8),
        basePosition: new THREE.Vector3(4, 0, -8),
        targetPosition: new THREE.Vector3(2, 0, -9),
        rotationY: 0,
        health: 70,
        maxHealth: 70,
        isDead: false,
        hitTimer: 0,
        speed: 2.5,
        radius: 0.7,
        headOffset: 1.6
      },
      {
        id: 'bot_heavy_1',
        type: 'HEAVY',
        position: new THREE.Vector3(0, 0, -12),
        basePosition: new THREE.Vector3(0, 0, -12),
        targetPosition: new THREE.Vector3(0, 0, -10),
        rotationY: 0,
        health: 140,
        maxHealth: 140,
        isDead: false,
        hitTimer: 0,
        speed: 1.2,
        radius: 1.1,
        headOffset: 2.2
      },
      {
        id: 'bot_drone_1',
        type: 'DRONE',
        position: new THREE.Vector3(-6, 2.5, -10),
        basePosition: new THREE.Vector3(-6, 2.5, -10),
        targetPosition: new THREE.Vector3(-5, 3.2, -11),
        rotationY: 0,
        health: 50,
        maxHealth: 50,
        isDead: false,
        hitTimer: 0,
        speed: 3.0,
        radius: 0.6,
        headOffset: 0
      },
      {
        id: 'bot_drone_2',
        type: 'DRONE',
        position: new THREE.Vector3(6, 2.8, -10),
        basePosition: new THREE.Vector3(6, 2.8, -10),
        targetPosition: new THREE.Vector3(5, 2.0, -11),
        rotationY: 0,
        health: 50,
        maxHealth: 50,
        isDead: false,
        hitTimer: 0,
        speed: 3.2,
        radius: 0.6,
        headOffset: 0
      }
    ];

    setBots(initialBots);
  }, [gamePhase]);

  // Subscribe to trigger events for instant raycast hit detection
  const recoilTime = useGameStore((s) => s.recoilTriggered);
  const lastShotHandled = useRef(0);

  useEffect(() => {
    if (recoilTime > 0 && recoilTime !== lastShotHandled.current && gamePhase === 'PLAYING') {
      lastShotHandled.current = recoilTime;

      // Calculate camera ray vector based on aim pitch & yaw
      const { pitch, yaw } = useGameStore.getState().aimPitchYaw;

      // Ray direction in world coordinates
      const rayDir = new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      ).normalize();

      const rayOrigin = new THREE.Vector3(0, 0, 0);

      // Check hit against active bots
      setBots((prevBots) => {
        return prevBots.map((bot) => {
          if (bot.isDead) return bot;

          // Bot sphere collision centers (Body and Head)
          const bodyCenter = bot.position.clone().add(new THREE.Vector3(0, bot.type === 'DRONE' ? 0 : 0.9, 0));
          const headCenter = bot.position.clone().add(new THREE.Vector3(0, bot.headOffset, 0));

          // Distance from ray line to center
          const vBody = bodyCenter.clone().sub(rayOrigin);
          const projBody = vBody.dot(rayDir);
          const distBodySq = vBody.lengthSq() - projBody * projBody;

          const vHead = headCenter.clone().sub(rayOrigin);
          const projHead = vHead.dot(rayDir);
          const distHeadSq = vHead.lengthSq() - projHead * projHead;

          const isHeadshot = projHead > 0 && distHeadSq < 0.25;
          const isBodyHit = projBody > 0 && distBodySq < (bot.radius * bot.radius);

          if (isHeadshot || isBodyHit) {
            const damage = isHeadshot ? GAME_CONSTANTS.DAMAGE_PER_SHOT * 2 : GAME_CONSTANTS.DAMAGE_PER_SHOT;
            const newHealth = Math.max(0, bot.health - damage);
            const isDead = newHealth <= 0;

            // Register hit score
            registerHit(bot.id, isHeadshot);

            if (isDead) {
              soundManager.playExplosion();
              // Schedule respawn after 2 seconds
              setTimeout(() => {
                respawnBot(bot.id);
              }, GAME_CONSTANTS.BOT_RESPAWN_TIME_MS);
            } else {
              soundManager.playHitMarker(isHeadshot);
            }

            return {
              ...bot,
              health: newHealth,
              isDead,
              hitTimer: Date.now()
            };
          }

          return bot;
        });
      });
    }
  }, [recoilTime, gamePhase]);

  const respawnBot = (botId: string) => {
    setBots((prev) =>
      prev.map((bot) => {
        if (bot.id === botId) {
          // Reset position near base position with random offset
          const randomOffsetX = (Math.random() - 0.5) * 4;
          const randomOffsetZ = (Math.random() - 0.5) * 2;
          const newPos = bot.basePosition.clone().add(new THREE.Vector3(randomOffsetX, 0, randomOffsetZ));

          return {
            ...bot,
            position: newPos,
            health: bot.maxHealth,
            isDead: false,
            hitTimer: 0
          };
        }
        return bot;
      })
    );
  };

  // Bot Animation & Patrol Loop
  useFrame((_, delta) => {
    if (gamePhase !== 'PLAYING') return;

    setBots((prevBots) =>
      prevBots.map((bot) => {
        if (bot.isDead) return bot;

        // Move towards target position
        const dir = bot.targetPosition.clone().sub(bot.position);
        const dist = dir.length();

        if (dist < 0.3) {
          // Pick new random patrol target around base
          const newTarget = bot.basePosition.clone().add(
            new THREE.Vector3((Math.random() - 0.5) * 6, bot.type === 'DRONE' ? (Math.random() - 0.5) * 1.5 : 0, (Math.random() - 0.5) * 4)
          );
          return { ...bot, targetPosition: newTarget };
        }

        dir.normalize();
        const moveDist = Math.min(dist, bot.speed * delta);
        const nextPos = bot.position.clone().add(dir.multiplyScalar(moveDist));

        // Smooth rotation Y facing target
        const rotY = Math.atan2(dir.x, dir.z);

        return {
          ...bot,
          position: nextPos,
          rotationY: THREE.MathUtils.lerp(bot.rotationY, rotY, delta * 5)
        };
      })
    );
  });

  return (
    <group>
      {bots.map((bot) => {
        if (bot.isDead) return null;

        const isHitRecent = Date.now() - bot.hitTimer < 120;
        const color = isHitRecent ? '#ffffff' : bot.type === 'HEAVY' ? '#ff2a5f' : bot.type === 'DRONE' ? '#ffb700' : '#00f0ff';

        return (
          <group key={bot.id} position={bot.position.toArray()} rotation={[0, bot.rotationY, 0]}>
            {/* Robot Model */}
            {bot.type === 'SCOUT' && (
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
                {/* Torso */}
                <mesh position={[0, 1.1, 0]}>
                  <boxGeometry args={[0.7, 0.7, 0.4]} />
                  <meshStandardMaterial color="#0f192d" metalness={0.7} roughness={0.2} />
                </mesh>
                {/* Head */}
                <mesh position={[0, 1.6, 0]}>
                  <sphereGeometry args={[0.25, 16, 16]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHitRecent ? 3 : 0.8} />
                </mesh>
              </group>
            )}

            {bot.type === 'HEAVY' && (
              <group>
                {/* Legs */}
                <mesh position={[-0.45, 0.5, 0]}>
                  <boxGeometry args={[0.25, 1.0, 0.25]} />
                  <meshStandardMaterial color="#200d18" roughness={0.3} />
                </mesh>
                <mesh position={[0.45, 0.5, 0]}>
                  <boxGeometry args={[0.25, 1.0, 0.25]} />
                  <meshStandardMaterial color="#200d18" roughness={0.3} />
                </mesh>
                {/* Massive Torso */}
                <mesh position={[0, 1.5, 0]}>
                  <boxGeometry args={[1.2, 1.0, 0.7]} />
                  <meshStandardMaterial color="#2d0f1a" metalness={0.8} roughness={0.1} />
                </mesh>
                {/* Glowing Eye Visor */}
                <mesh position={[0, 2.2, 0]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.4, 8]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHitRecent ? 3 : 1.2} />
                </mesh>
              </group>
            )}

            {bot.type === 'DRONE' && (
              <group>
                {/* Floating Flying Drone Orb */}
                <mesh position={[0, 0, 0]}>
                  <sphereGeometry args={[0.4, 24, 24]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHitRecent ? 4 : 1.5} wireframe={!isHitRecent} />
                </mesh>
                {/* Rotor Ring */}
                <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.6, 0.04, 16, 32]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.9} />
                </mesh>
              </group>
            )}

            {/* Health Bar floating above bot */}
            <group position={[0, bot.headOffset + 0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[1.0, 0.1]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              <mesh position={[(-0.5 + (bot.health / bot.maxHealth) * 0.5), 0, 0.01]}>
                <planeGeometry args={[(bot.health / bot.maxHealth), 0.08]} />
                <meshBasicMaterial color={bot.health / bot.maxHealth > 0.4 ? '#00f0ff' : '#ff0055'} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
