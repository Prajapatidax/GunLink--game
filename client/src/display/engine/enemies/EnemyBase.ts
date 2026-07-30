import * as THREE from 'three';
import { EnemyTypeId, EnemyAIState, ENEMY_REGISTRY, EnemyConfig } from '@gunlink/shared';
import { EnemyFSM } from './EnemyFSM';

export interface EnemyInstance {
  id: string;
  typeId: EnemyTypeId;
  config: EnemyConfig;
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  rotationY: number;
  health: number;
  maxHealth: number;
  fsm: EnemyFSM;
  hitTimer: number;
}

export class EnemyBase {
  public static createInstance(id: string, typeId: EnemyTypeId, basePos: THREE.Vector3): EnemyInstance {
    const config = ENEMY_REGISTRY[typeId] || ENEMY_REGISTRY.ROBOT;

    return {
      id,
      typeId,
      config,
      position: basePos.clone(),
      basePosition: basePos.clone(),
      targetPosition: basePos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 0, (Math.random() - 0.5) * 4)),
      rotationY: 0,
      health: config.health,
      maxHealth: config.health,
      fsm: new EnemyFSM('PATROL'),
      hitTimer: 0
    };
  }
}
