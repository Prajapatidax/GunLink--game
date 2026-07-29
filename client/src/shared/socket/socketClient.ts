import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS, OrientationData, LeaderboardEntry } from '@gunlink/shared';
import { useGameStore } from '../store/useGameStore';

class SocketClientService {
  private socket: Socket | null = null;
  private pingInterval: any = null;

  init(serverUrl?: string) {
    if (this.socket) return;

    // Default to relative origin or window location for proxying
    const targetUrl = serverUrl || (import.meta.env.VITE_SERVER_URL || window.location.origin);

    console.log(`[SocketClient] Connecting to server at: ${targetUrl}`);

    this.socket = io(targetUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    this.setupListeners();
    this.startPingTracker();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log(`[SocketClient] Connected with ID: ${this.socket?.id}`);
      useGameStore.getState().setSocketConnected(true);
    });

    this.socket.on('disconnect', () => {
      console.log('[SocketClient] Disconnected from server');
      useGameStore.getState().setSocketConnected(false);
    });

    this.socket.on(SOCKET_EVENTS.ROOM_CREATED, ({ room }) => {
      console.log('[SocketClient] Room created:', room.code);
      useGameStore.getState().setRoom(room);
    });

    this.socket.on(SOCKET_EVENTS.ROOM_JOINED, ({ room }) => {
      console.log('[SocketClient] Controller joined room:', room.code);
      useGameStore.getState().setRoom(room);
      useGameStore.getState().setControllerConnected(true);
    });

    this.socket.on(SOCKET_EVENTS.CONTROLLER_CONNECTED, () => {
      console.log('[SocketClient] Controller connected to display room!');
      useGameStore.getState().setControllerConnected(true);
    });

    this.socket.on(SOCKET_EVENTS.PLAYER_DISCONNECTED, ({ role }) => {
      console.warn(`[SocketClient] ${role} disconnected`);
      if (role === 'controller') {
        useGameStore.getState().setControllerConnected(false);
      }
    });

    this.socket.on(SOCKET_EVENTS.ORIENTATION_UPDATE, (data: OrientationData) => {
      useGameStore.getState().updateOrientation(data);
    });

    this.socket.on(SOCKET_EVENTS.TRIGGER_PULL, () => {
      useGameStore.getState().triggerShot();
    });

    this.socket.on(SOCKET_EVENTS.RELOAD, () => {
      useGameStore.getState().reloadWeapon();
    });

    this.socket.on(SOCKET_EVENTS.RECENTER, () => {
      useGameStore.getState().recenterGyro();
    });

    this.socket.on(SOCKET_EVENTS.SENSITIVITY_UPDATE, ({ sensitivity }) => {
      useGameStore.getState().setSensitivity(sensitivity);
    });

    this.socket.on(SOCKET_EVENTS.GAME_START, () => {
      useGameStore.getState().startGame();
    });

    this.socket.on(SOCKET_EVENTS.GAME_RESTART, () => {
      useGameStore.getState().restartGame();
    });

    this.socket.on(SOCKET_EVENTS.GAME_OVER, (scoreData: LeaderboardEntry) => {
      useGameStore.getState().endGame(scoreData);
    });

    this.socket.on(SOCKET_EVENTS.PONG, (data: { timestamp: number }) => {
      const latency = Date.now() - data.timestamp;
      useGameStore.getState().setLatency(latency);
    });
  }

  private startPingTracker() {
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit(SOCKET_EVENTS.PING, { timestamp: Date.now() });
      }
    }, 4000);
  }

  // Emitters
  createRoom() {
    this.socket?.emit(SOCKET_EVENTS.ROOM_CREATE);
  }

  joinRoom(roomCode: string) {
    this.socket?.emit(SOCKET_EVENTS.ROOM_JOIN, { roomCode });
  }

  sendOrientation(data: OrientationData) {
    this.socket?.emit(SOCKET_EVENTS.ORIENTATION_UPDATE, data);
  }

  sendTriggerPull() {
    this.socket?.emit(SOCKET_EVENTS.TRIGGER_PULL, { timestamp: Date.now() });
  }

  sendReload() {
    this.socket?.emit(SOCKET_EVENTS.RELOAD);
  }

  sendRecenter() {
    this.socket?.emit(SOCKET_EVENTS.RECENTER);
  }

  sendSensitivity(sensitivity: number) {
    this.socket?.emit(SOCKET_EVENTS.SENSITIVITY_UPDATE, { sensitivity });
  }

  sendGameStart() {
    this.socket?.emit(SOCKET_EVENTS.GAME_START);
  }

  sendGameRestart() {
    this.socket?.emit(SOCKET_EVENTS.GAME_RESTART);
  }

  sendGameOver(scoreData: Omit<LeaderboardEntry, 'id' | 'createdAt'>) {
    this.socket?.emit(SOCKET_EVENTS.GAME_OVER, scoreData);
  }
}

export const socketClient = new SocketClientService();
