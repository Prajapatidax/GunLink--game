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

export type BotState = 'IDLE' | 'PATROL' | 'SEARCH' | 'HIT' | 'DEAD';

export interface BotData {
  id: string;
  position: [number, number, number];
  rotation: number;
  state: BotState;
  health: number;
  maxHealth: number;
  speed: number;
  type: 'SCOUT' | 'HEAVY' | 'DRONE';
  radius: number;
}

export interface ShotData {
  id: string;
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
  multiplier: number;
  combo: number;
  shotsFired: number;
  shotsHit: number;
  accuracy: number;
  timeRemaining: number;
  highScore: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  accuracy: number;
  comboMax: number;
  createdAt: string;
}
