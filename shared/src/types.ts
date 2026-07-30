export type WeaponId = 'PISTOL' | 'RIFLE' | 'SHOTGUN' | 'SNIPER' | 'SMG' | 'ROCKET' | 'LASER';

export type EnemyTypeId = 'ROBOT' | 'ZOMBIE' | 'ALIEN' | 'SOLDIER' | 'ANIMAL' | 'DRONE' | 'BOSS';

export type LevelId = 'TRAINING' | 'WAREHOUSE' | 'CITY' | 'LABORATORY' | 'INDUSTRIAL';

export type EnemyAIState = 'IDLE' | 'PATROL' | 'SEARCH' | 'ATTACK' | 'HIT' | 'DEAD' | 'RESPAWN';

export interface WeaponStats {
  id: WeaponId;
  name: string;
  damage: number;
  fireRateMs: number;
  magazineSize: number;
  reloadTimeMs: number;
  recoilIntensity: number;
  bulletSpeed: number;
  soundType: 'PISTOL' | 'RIFLE' | 'SHOTGUN' | 'SNIPER' | 'LASER';
  muzzleColor: string;
  headshotMultiplier: number;
}

export interface EnemyConfig {
  typeId: EnemyTypeId;
  name: string;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  detectionRadius: number;
  scoreReward: number;
  headOffset: number;
  boundingRadius: number;
}

export interface LevelConfig {
  id: LevelId;
  name: string;
  description: string;
  lightColor: string;
  fogColor: string;
  groundColor: string;
  accentColor: string;
  maxEnemies: number;
}

export interface OrientationData {
  alpha: number; // Z-axis rotation (0..360)
  beta: number;  // X-axis tilt (-180..180)
  gamma: number; // Y-axis tilt (-90..90)
  timestamp: number;
}

export interface ControllerSettings {
  sensitivity: number;
  vibrationEnabled: boolean;
  invertY: boolean;
  smoothingAlpha: number;
}

export interface PlayerSession {
  socketId: string;
  role: 'display' | 'controller';
  roomId: string;
  connectedAt: number;
  batteryLevel?: number;
  latencyMs?: number;
}

export interface RoomState {
  code: string;
  displaySocketId: string | null;
  controllerSocketId: string | null;
  status: 'LOBBY' | 'CONNECTED' | 'PLAYING' | 'ENDED';
  createdAt: number;
}

export interface BotData {
  id: string;
  type: EnemyTypeId;
  position: [number, number, number];
  rotation: number;
  state: EnemyAIState;
  health: number;
  maxHealth: number;
  speed: number;
}

export interface ShotData {
  id: string;
  weaponId: WeaponId;
  origin: [number, number, number];
  direction: [number, number, number];
  speed: number;
  timestamp: number;
}

export interface HitData {
  botId: string;
  damage: number;
  isHeadshot?: boolean;
  impactPoint: [number, number, number];
}

export interface GameScoreState {
  score: number;
  kills: number;
  multiplier: number;
  combo: number;
  shotsFired: number;
  shotsHit: number;
  accuracy: number;
  timeRemaining: number;
  currentLevel: LevelId;
  currentWeapon: WeaponId;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  comboMax: number;
  createdAt: string;
}
