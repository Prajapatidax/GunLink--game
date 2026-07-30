import { EnemyTypeId, WeaponId, LevelId } from '@gunlink/shared';

export const ASSET_REGISTRY = {
  models: {
    enemies: {
      ROBOT: '/assets/models/robot/Robot.glb',
      ZOMBIE: '/assets/models/zombie/Zombie.glb',
      ALIEN: '/assets/models/alien/Alien.glb',
      SOLDIER: '/assets/models/soldier/Soldier.glb',
      ANIMAL: '/assets/models/animal/Hound.glb',
      DRONE: '/assets/models/drone/Drone.glb',
      BOSS: '/assets/models/boss/BossTitan.glb'
    } as Record<EnemyTypeId, string>,
    weapons: {
      PISTOL: '/assets/models/weapons/Pistol.glb',
      RIFLE: '/assets/models/weapons/Rifle.glb',
      SHOTGUN: '/assets/models/weapons/Shotgun.glb',
      SNIPER: '/assets/models/weapons/Sniper.glb',
      SMG: '/assets/models/weapons/SMG.glb',
      ROCKET: '/assets/models/weapons/RocketLauncher.glb',
      LASER: '/assets/models/weapons/LaserGun.glb'
    } as Record<WeaponId, string>,
    maps: {
      TRAINING: '/assets/models/maps/TrainingGround.glb',
      WAREHOUSE: '/assets/models/maps/Warehouse.glb',
      CITY: '/assets/models/maps/City.glb',
      LABORATORY: '/assets/models/maps/Laboratory.glb',
      INDUSTRIAL: '/assets/models/maps/IndustrialZone.glb'
    } as Record<LevelId, string>
  }
};
