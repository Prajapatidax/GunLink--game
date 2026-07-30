import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EnemyTypeId, GAME_CONSTANTS, WEAPON_REGISTRY } from '@gunlink/shared';
import { EnemyInstance, EnemyBase } from './EnemyBase';
import { EnemyModelLoader } from '../assets/ModelLoader';
import { useGameStore } from '../../../shared/store/useGameStore';
import { soundManager } from '../../audio/SoundManager';

export const EnemyManager: React.FC = () => {
  const [enemies, setEnemies] = useState<EnemyInstance[]>([]);
  const registerHit = useGameStore((s) => s.registerHit);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const currentWeaponId = useGameStore((s) => s.currentWeapon);

  // Initialize Level Enemy Roster
  useEffect(() => {
    if (gamePhase !== 'PLAYING') return;

    const initialEnemies: EnemyInstance[] = [
      EnemyBase.createInstance('e_robot_1', 'ROBOT', new THREE.Vector3(-4, 0, -8)),
      EnemyBase.createInstance('e_zombie_1', 'ZOMBIE', new THREE.Vector3(-2, 0, -10)),
      EnemyBase.createInstance('e_soldier_1', 'SOLDIER', new THREE.Vector3(2, 0, -9)),
      EnemyBase.createInstance('e_alien_1', 'ALIEN', new THREE.Vector3(5, 0, -11)),
      EnemyBase.createInstance('e_drone_1', 'DRONE', new THREE.Vector3(-5, 2.5, -9)),
      EnemyBase.createInstance('e_drone_2', 'DRONE', new THREE.Vector3(4, 2.8, -10)),
      EnemyBase.createInstance('e_boss_1', 'BOSS', new THREE.Vector3(0, 0, -14))
    ];

    setEnemies(initialEnemies);
  }, [gamePhase]);

  // Raycast Hit Detection on Weapon Firing
  const recoilTime = useGameStore((s) => s.recoilTriggered);
  const lastShotHandled = useRef(0);

  useEffect(() => {
    if (recoilTime > 0 && recoilTime !== lastShotHandled.current && gamePhase === 'PLAYING') {
      lastShotHandled.current = recoilTime;

      const { pitch, yaw } = useGameStore.getState().aimPitchYaw;
      const weaponStats = WEAPON_REGISTRY[currentWeaponId] || WEAPON_REGISTRY.PISTOL;

      // Ray direction from player camera
      const rayDir = new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      ).normalize();

      const rayOrigin = new THREE.Vector3(0, 0, 0);

      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          if (enemy.fsm.getState() === 'DEAD') return enemy;

          // Enemy hitboxes
          const isDrone = enemy.typeId === 'DRONE';
          const bodyCenter = enemy.position.clone().add(new THREE.Vector3(0, isDrone ? 0 : 0.9, 0));
          const headCenter = enemy.position.clone().add(new THREE.Vector3(0, enemy.config.headOffset, 0));

          // Ray distance calculations
          const vBody = bodyCenter.clone().sub(rayOrigin);
          const projBody = vBody.dot(rayDir);
          const distBodySq = vBody.lengthSq() - projBody * projBody;

          const vHead = headCenter.clone().sub(rayOrigin);
          const projHead = vHead.dot(rayDir);
          const distHeadSq = vHead.lengthSq() - projHead * projHead;

          const isHeadshot = projHead > 0 && distHeadSq < 0.28;
          const isBodyHit = projBody > 0 && distBodySq < (enemy.config.boundingRadius * enemy.config.boundingRadius);

          if (isHeadshot || isBodyHit) {
            const rawDamage = weaponStats.damage;
            const damageGained = isHeadshot ? rawDamage * weaponStats.headshotMultiplier : rawDamage;
            const newHealth = Math.max(0, enemy.health - damageGained);
            const isDead = newHealth <= 0;

            // Update FSM state
            if (isDead) {
              enemy.fsm.setState('DEAD');
              soundManager.playExplosion();

              // Schedule respawn after 2 seconds
              setTimeout(() => {
                respawnEnemy(enemy.id);
              }, GAME_CONSTANTS.BOT_RESPAWN_TIME_MS);
            } else {
              enemy.fsm.setState('HIT');
              soundManager.playHitMarker(isHeadshot);
            }

            // Register hit score in global store
            registerHit(enemy.id, isHeadshot);

            return {
              ...enemy,
              health: newHealth,
              hitTimer: Date.now()
            };
          }

          return enemy;
        })
      );
    }
  }, [recoilTime, gamePhase, currentWeaponId]);

  const respawnEnemy = (id: string) => {
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.id === id) {
          const randomOffsetX = (Math.random() - 0.5) * 6;
          const randomOffsetZ = (Math.random() - 0.5) * 4;
          const newPos = enemy.basePosition.clone().add(new THREE.Vector3(randomOffsetX, 0, randomOffsetZ));

          enemy.fsm.setState('PATROL');
          return {
            ...enemy,
            position: newPos,
            health: enemy.maxHealth,
            hitTimer: 0
          };
        }
        return enemy;
      })
    );
  };

  // AI FSM Animation & Movement Loop
  useFrame((_, delta) => {
    if (gamePhase !== 'PLAYING') return;

    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        const state = enemy.fsm.getState();
        if (state === 'DEAD') return enemy;

        // Move towards target position during PATROL or SEARCH state
        const dir = enemy.targetPosition.clone().sub(enemy.position);
        const dist = dir.length();

        if (dist < 0.4) {
          const isDrone = enemy.typeId === 'DRONE';
          const newTarget = enemy.basePosition.clone().add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 8,
              isDrone ? (Math.random() - 0.5) * 1.5 : 0,
              (Math.random() - 0.5) * 6
            )
          );
          return { ...enemy, targetPosition: newTarget };
        }

        dir.normalize();
        const moveDist = Math.min(dist, enemy.config.speed * delta);
        const nextPos = enemy.position.clone().add(dir.multiplyScalar(moveDist));
        const rotY = Math.atan2(dir.x, dir.z);

        return {
          ...enemy,
          position: nextPos,
          rotationY: THREE.MathUtils.lerp(enemy.rotationY, rotY, delta * 4)
        };
      })
    );
  });

  return (
    <group>
      {enemies.map((enemy) => {
        const isDead = enemy.fsm.getState() === 'DEAD';
        if (isDead) return null;

        const isHitRecent = Date.now() - enemy.hitTimer < 120;

        return (
          <group key={enemy.id} position={enemy.position.toArray()} rotation={[0, enemy.rotationY, 0]}>
            {/* Enemy Model (GLB or Procedural Fallback) */}
            <EnemyModelLoader typeId={enemy.typeId} isHit={isHitRecent} />

            {/* Floating Health Bar */}
            <group position={[0, enemy.config.headOffset + 0.5, 0]}>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[1.0, 0.1]} />
                <meshBasicMaterial color="#000000" />
              </mesh>
              <mesh position={[(-0.5 + (enemy.health / enemy.maxHealth) * 0.5), 0, 0.01]}>
                <planeGeometry args={[(enemy.health / enemy.maxHealth), 0.08]} />
                <meshBasicMaterial color={enemy.health / enemy.maxHealth > 0.35 ? '#00f0ff' : '#ff0055'} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
};
