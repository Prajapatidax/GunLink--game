import { create } from 'zustand';
import {
  RoomState,
  OrientationData,
  GAME_CONSTANTS,
  LeaderboardEntry,
  WeaponId,
  LevelId,
  WEAPON_REGISTRY,
  LEVEL_REGISTRY
} from '@gunlink/shared';

export type GamePhase = 'LANDING' | 'LOBBY' | 'COUNTDOWN' | 'PLAYING' | 'ENDED';
export type ThemeMode = 'dark' | 'light';

interface GameStoreState {
  // Socket & Room
  isSocketConnected: boolean;
  room: RoomState | null;
  qrCodeUrl: string | null;
  isControllerConnected: boolean;
  latencyMs: number;

  // Game Lifecycle & Theme
  gamePhase: GamePhase;
  theme: ThemeMode;
  countdown: number;
  timeRemaining: number;
  currentLevel: LevelId;
  currentWeapon: WeaponId;

  // Phone Orientation & Aiming
  rawOrientation: OrientationData;
  calibratedOffset: { alpha: number; beta: number; gamma: number };
  aimPitchYaw: { pitch: number; yaw: number };
  sensitivity: number;

  // Weapon & Combat State
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  recoilTriggered: number;
  muzzleFlashTriggered: number;

  // Scoring & Stats
  score: number;
  kills: number;
  combo: number;
  maxCombo: number;
  shotsFired: number;
  shotsHit: number;
  lastHitTime: number;
  lastScoreData: LeaderboardEntry | null;

  // Sound & Dev Settings
  soundEnabled: boolean;
  fps: number;
  devMode: boolean;

  // Actions
  setSocketConnected: (connected: boolean) => void;
  setRoom: (room: RoomState) => void;
  setQrCodeUrl: (url: string) => void;
  setControllerConnected: (connected: boolean) => void;
  setLatency: (ms: number) => void;
  setGamePhase: (phase: GamePhase) => void;
  toggleTheme: () => void;

  updateOrientation: (data: OrientationData) => void;
  recenterGyro: () => void;
  setSensitivity: (sens: number) => void;

  selectWeapon: (weaponId: WeaponId) => void;
  selectLevel: (levelId: LevelId) => void;

  triggerShot: () => boolean;
  reloadWeapon: () => void;
  finishReload: () => void;

  registerHit: (botId: string, isHeadshot?: boolean) => void;
  tickGameTimer: () => void;
  startGame: () => void;
  restartGame: () => void;
  endGame: (scoreData?: LeaderboardEntry) => void;

  toggleSound: () => void;
  setFps: (fps: number) => void;
  toggleDevMode: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  // Socket & Room
  isSocketConnected: false,
  room: null,
  qrCodeUrl: null,
  isControllerConnected: false,
  latencyMs: 0,

  // Game Lifecycle & Theme
  gamePhase: 'LANDING',
  theme: 'dark',
  countdown: 3,
  timeRemaining: GAME_CONSTANTS.GAME_DURATION_SECONDS,
  currentLevel: 'TRAINING',
  currentWeapon: 'PISTOL',

  // Orientation
  rawOrientation: { alpha: 0, beta: 0, gamma: 0, timestamp: Date.now() },
  calibratedOffset: { alpha: 0, beta: 0, gamma: 0 },
  aimPitchYaw: { pitch: 0, yaw: 0 },
  sensitivity: GAME_CONSTANTS.DEFAULT_SENSITIVITY,

  // Weapon
  ammo: WEAPON_REGISTRY.PISTOL.magazineSize,
  maxAmmo: WEAPON_REGISTRY.PISTOL.magazineSize,
  isReloading: false,
  recoilTriggered: 0,
  muzzleFlashTriggered: 0,

  // Scoring
  score: 0,
  kills: 0,
  combo: 0,
  maxCombo: 0,
  shotsFired: 0,
  shotsHit: 0,
  lastHitTime: 0,
  lastScoreData: null,

  // Sound & Dev
  soundEnabled: true,
  fps: 60,
  devMode: false,

  // Setters
  setSocketConnected: (connected) => set({ isSocketConnected: connected }),
  setRoom: (room) => set({ room }),
  setQrCodeUrl: (url) => set({ qrCodeUrl: url }),
  setControllerConnected: (connected) => set({ isControllerConnected: connected }),
  setLatency: (ms) => set({ latencyMs: ms }),
  setGamePhase: (phase) => set({ gamePhase: phase }),

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
    set({ theme: nextTheme });
  },

  updateOrientation: (data) => {
    const { calibratedOffset, sensitivity } = get();
    let rawYaw = data.alpha - calibratedOffset.alpha;
    if (rawYaw > 180) rawYaw -= 360;
    if (rawYaw < -180) rawYaw += 360;

    let rawPitch = data.beta - calibratedOffset.beta;
    if (rawPitch > 180) rawPitch -= 360;
    if (rawPitch < -180) rawPitch += 360;

    const yawRad = (rawYaw * (Math.PI / 180)) * sensitivity;
    const pitchRad = (rawPitch * (Math.PI / 180)) * sensitivity;
    const clampedPitch = Math.max(-1.2, Math.min(1.2, pitchRad));

    set({
      rawOrientation: data,
      aimPitchYaw: { pitch: clampedPitch, yaw: yawRad }
    });
  },

  recenterGyro: () => {
    const { rawOrientation } = get();
    set({
      calibratedOffset: {
        alpha: rawOrientation.alpha,
        beta: rawOrientation.beta,
        gamma: rawOrientation.gamma
      },
      aimPitchYaw: { pitch: 0, yaw: 0 }
    });
  },

  setSensitivity: (sens) => set({ sensitivity: sens }),

  selectWeapon: (weaponId) => {
    const stats = WEAPON_REGISTRY[weaponId] || WEAPON_REGISTRY.PISTOL;
    set({
      currentWeapon: weaponId,
      ammo: stats.magazineSize,
      maxAmmo: stats.magazineSize,
      isReloading: false
    });
  },

  selectLevel: (levelId) => {
    set({ currentLevel: levelId });
  },

  triggerShot: () => {
    const { ammo, isReloading, gamePhase } = get();
    if (isReloading || ammo <= 0 || gamePhase !== 'PLAYING') {
      return false;
    }

    const now = Date.now();
    set((state) => ({
      ammo: state.ammo - 1,
      shotsFired: state.shotsFired + 1,
      recoilTriggered: now,
      muzzleFlashTriggered: now
    }));

    if (get().ammo <= 0) {
      get().reloadWeapon();
    }

    return true;
  },

  reloadWeapon: () => {
    const { isReloading, ammo, maxAmmo, currentWeapon } = get();
    if (isReloading || ammo === maxAmmo) return;

    const stats = WEAPON_REGISTRY[currentWeapon] || WEAPON_REGISTRY.PISTOL;
    set({ isReloading: true });

    setTimeout(() => {
      get().finishReload();
    }, stats.reloadTimeMs);
  },

  finishReload: () => {
    const { currentWeapon } = get();
    const stats = WEAPON_REGISTRY[currentWeapon] || WEAPON_REGISTRY.PISTOL;
    set({
      ammo: stats.magazineSize,
      maxAmmo: stats.magazineSize,
      isReloading: false
    });
  },

  registerHit: (botId, isHeadshot = false) => {
    const now = Date.now();
    const { combo, lastHitTime } = get();

    const isComboActive = now - lastHitTime < 3000;
    const nextCombo = isComboActive ? combo + 1 : 1;
    const multiplier = Math.min(4, 1 + Math.floor(nextCombo / 3) * 0.5);

    const basePoints = 100;
    const headshotBonus = isHeadshot ? 2.0 : 1.0;
    const pointsGained = Math.round(basePoints * multiplier * headshotBonus);

    set((state) => ({
      score: state.score + pointsGained,
      kills: state.kills + 1,
      combo: nextCombo,
      maxCombo: Math.max(state.maxCombo, nextCombo),
      shotsHit: state.shotsHit + 1,
      lastHitTime: now
    }));
  },

  tickGameTimer: () => {
    const { timeRemaining, gamePhase } = get();
    if (gamePhase !== 'PLAYING') return;

    if (timeRemaining <= 1) {
      get().endGame();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  startGame: () => {
    const { currentWeapon } = get();
    const stats = WEAPON_REGISTRY[currentWeapon] || WEAPON_REGISTRY.PISTOL;

    set({
      gamePhase: 'PLAYING',
      timeRemaining: GAME_CONSTANTS.GAME_DURATION_SECONDS,
      score: 0,
      kills: 0,
      combo: 0,
      maxCombo: 0,
      shotsFired: 0,
      shotsHit: 0,
      ammo: stats.magazineSize,
      maxAmmo: stats.magazineSize,
      isReloading: false
    });
  },

  restartGame: () => {
    get().startGame();
  },

  endGame: (scoreData) => {
    const { score, shotsFired, shotsHit, maxCombo } = get();
    const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;

    const summary: LeaderboardEntry = scoreData || {
      id: Math.random().toString(36).substring(2, 9),
      playerName: 'PLAYER_1',
      score,
      accuracy,
      comboMax: maxCombo,
      createdAt: new Date().toISOString()
    };

    set({
      gamePhase: 'ENDED',
      lastScoreData: summary
    });
  },

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setFps: (fps) => set({ fps }),
  toggleDevMode: () => set((state) => ({ devMode: !state.devMode }))
}));
