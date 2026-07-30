import { WeaponStats, LevelConfig, EnemyConfig, WeaponId, EnemyTypeId, LevelId } from './types.js';

export const WEAPON_REGISTRY: Record<WeaponId, WeaponStats> = {
  PISTOL: {
    id: 'PISTOL',
    name: 'Cyber Pistol',
    damage: 35,
    fireRateMs: 160,
    magazineSize: 12,
    reloadTimeMs: 1400,
    recoilIntensity: 0.25,
    bulletSpeed: 85,
    soundType: 'PISTOL',
    muzzleColor: '#00f0ff',
    headshotMultiplier: 2.0
  },
  RIFLE: {
    id: 'RIFLE',
    name: 'Plasma Assault Rifle',
    damage: 25,
    fireRateMs: 90,
    magazineSize: 30,
    reloadTimeMs: 2000,
    recoilIntensity: 0.18,
    bulletSpeed: 95,
    soundType: 'RIFLE',
    muzzleColor: '#00a2ff',
    headshotMultiplier: 1.8
  },
  SHOTGUN: {
    id: 'SHOTGUN',
    name: 'Heavy Pulse Shotgun',
    damage: 90,
    fireRateMs: 650,
    magazineSize: 8,
    reloadTimeMs: 2400,
    recoilIntensity: 0.6,
    bulletSpeed: 70,
    soundType: 'SHOTGUN',
    muzzleColor: '#ff2a5f',
    headshotMultiplier: 1.5
  },
  SNIPER: {
    id: 'SNIPER',
    name: 'Railgun Sniper',
    damage: 150,
    fireRateMs: 1200,
    magazineSize: 5,
    reloadTimeMs: 2800,
    recoilIntensity: 0.8,
    bulletSpeed: 140,
    soundType: 'SNIPER',
    muzzleColor: '#ffb700',
    headshotMultiplier: 3.0
  },
  SMG: {
    id: 'SMG',
    name: 'Neon Vector SMG',
    damage: 18,
    fireRateMs: 60,
    magazineSize: 40,
    reloadTimeMs: 1600,
    recoilIntensity: 0.12,
    bulletSpeed: 80,
    soundType: 'RIFLE',
    muzzleColor: '#00f0ff',
    headshotMultiplier: 1.5
  },
  ROCKET: {
    id: 'ROCKET',
    name: 'Thermal Rocket Launcher',
    damage: 220,
    fireRateMs: 1500,
    magazineSize: 4,
    reloadTimeMs: 3200,
    recoilIntensity: 1.0,
    bulletSpeed: 50,
    soundType: 'SHOTGUN',
    muzzleColor: '#ff0055',
    headshotMultiplier: 1.2
  },
  LASER: {
    id: 'LASER',
    name: 'Quantum Beam Cannon',
    damage: 45,
    fireRateMs: 100,
    magazineSize: 50,
    reloadTimeMs: 2200,
    recoilIntensity: 0.05,
    bulletSpeed: 160,
    soundType: 'LASER',
    muzzleColor: '#aa00ff',
    headshotMultiplier: 2.2
  }
};

export const ENEMY_REGISTRY: Record<EnemyTypeId, EnemyConfig> = {
  ROBOT: {
    typeId: 'ROBOT',
    name: 'Cyber Scout',
    health: 70,
    maxHealth: 70,
    speed: 2.2,
    damage: 15,
    detectionRadius: 15,
    scoreReward: 100,
    headOffset: 1.6,
    boundingRadius: 0.7
  },
  ZOMBIE: {
    typeId: 'ZOMBIE',
    name: 'Mutant Walker',
    health: 60,
    maxHealth: 60,
    speed: 1.6,
    damage: 20,
    detectionRadius: 12,
    scoreReward: 90,
    headOffset: 1.5,
    boundingRadius: 0.6
  },
  ALIEN: {
    typeId: 'ALIEN',
    name: 'Xeno Lurker',
    health: 85,
    maxHealth: 85,
    speed: 2.8,
    damage: 25,
    detectionRadius: 18,
    scoreReward: 150,
    headOffset: 1.4,
    boundingRadius: 0.8
  },
  SOLDIER: {
    typeId: 'SOLDIER',
    name: 'Rogue Mercenary',
    health: 100,
    maxHealth: 100,
    speed: 2.0,
    damage: 30,
    detectionRadius: 20,
    scoreReward: 180,
    headOffset: 1.7,
    boundingRadius: 0.75
  },
  ANIMAL: {
    typeId: 'ANIMAL',
    name: 'Cyber Hound',
    health: 50,
    maxHealth: 50,
    speed: 3.8,
    damage: 18,
    detectionRadius: 16,
    scoreReward: 120,
    headOffset: 0.8,
    boundingRadius: 0.6
  },
  DRONE: {
    typeId: 'DRONE',
    name: 'Sentry Drone',
    health: 45,
    maxHealth: 45,
    speed: 3.2,
    damage: 12,
    detectionRadius: 22,
    scoreReward: 130,
    headOffset: 0,
    boundingRadius: 0.5
  },
  BOSS: {
    typeId: 'BOSS',
    name: 'Oversight Titan',
    health: 400,
    maxHealth: 400,
    speed: 1.1,
    damage: 50,
    detectionRadius: 30,
    scoreReward: 1000,
    headOffset: 2.6,
    boundingRadius: 1.5
  }
};

export const LEVEL_REGISTRY: Record<LevelId, LevelConfig> = {
  TRAINING: {
    id: 'TRAINING',
    name: 'Level 1 — Training Ground',
    description: 'Neon-lit proving grounds. Ideal for target practice.',
    lightColor: '#00f0ff',
    fogColor: '#040814',
    groundColor: '#050b18',
    accentColor: '#00f0ff',
    maxEnemies: 5
  },
  WAREHOUSE: {
    id: 'WAREHOUSE',
    name: 'Level 2 — Abandoned Warehouse',
    description: 'Crates, dark shadows, and patrolling sentry drones.',
    lightColor: '#ffb700',
    fogColor: '#0c0a06',
    groundColor: '#12100a',
    accentColor: '#ffb700',
    maxEnemies: 7
  },
  CITY: {
    id: 'CITY',
    name: 'Level 3 — Neon City',
    description: 'Cyberpunk streets with rogue mercenaries and mechs.',
    lightColor: '#ff0055',
    fogColor: '#0f050b',
    groundColor: '#190812',
    accentColor: '#ff0055',
    maxEnemies: 9
  },
  LABORATORY: {
    id: 'LABORATORY',
    name: 'Level 4 — Bio Laboratory',
    description: 'Sterile containment zone overrun by bio-mutants.',
    lightColor: '#00ff66',
    fogColor: '#04120a',
    groundColor: '#06180e',
    accentColor: '#00ff66',
    maxEnemies: 10
  },
  INDUSTRIAL: {
    id: 'INDUSTRIAL',
    name: 'Level 5 — Industrial Zone',
    description: 'High-risk hazardous refinery. Prepare for Titan Boss assault.',
    lightColor: '#aa00ff',
    fogColor: '#0d0414',
    groundColor: '#14061e',
    accentColor: '#aa00ff',
    maxEnemies: 12
  }
};

export const GAME_CONSTANTS = {
  GAME_DURATION_SECONDS: 60,
  DEFAULT_SENSITIVITY: 1.5,
  MIN_SENSITIVITY: 0.5,
  MAX_SENSITIVITY: 3.5,
  ROOM_CODE_LENGTH: 6,
  BOT_RESPAWN_TIME_MS: 1800
} as const;
