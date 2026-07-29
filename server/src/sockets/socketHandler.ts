import { Server as SocketIOServer, Socket } from 'socket.io';
import { SOCKET_EVENTS, OrientationData, LeaderboardEntry } from '@gunlink/shared';
import { roomManager } from '../services/roomManager.js';
import { supabaseService } from '../services/supabaseClient.js';

export function setupSocketHandlers(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Create Room (Display client)
    socket.on(SOCKET_EVENTS.ROOM_CREATE, async () => {
      try {
        const room = await roomManager.createRoom(socket.id);
        socket.join(room.code);
        socket.emit(SOCKET_EVENTS.ROOM_CREATED, { room });
        console.log(`[Room] Room created ${room.code} by display ${socket.id}`);
      } catch (err) {
        console.error('[Room] Error creating room:', err);
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Failed to create room' });
      }
    });

    // Join Room (Controller client)
    socket.on(SOCKET_EVENTS.ROOM_JOIN, async ({ roomCode }: { roomCode: string }) => {
      try {
        const result = await roomManager.joinRoom(roomCode, socket.id);
        if (!result.success || !result.room) {
          socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: result.error || 'Failed to join room' });
          return;
        }

        socket.join(result.room.code);

        // Notify Controller
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { room: result.room });

        // Notify Display that phone gun has connected!
        if (result.room.displaySocketId) {
          io.to(result.room.displaySocketId).emit(SOCKET_EVENTS.CONTROLLER_CONNECTED, {
            controllerSocketId: socket.id
          });
        }

        console.log(`[Room] Controller ${socket.id} joined room ${result.room.code}`);
      } catch (err) {
        console.error('[Room] Error joining room:', err);
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Failed to join room' });
      }
    });

    // Real-Time Gyro Orientation Relay (Controller -> Display)
    socket.on(SOCKET_EVENTS.ORIENTATION_UPDATE, (data: OrientationData) => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info && info.role === 'controller') {
        socket.to(info.roomCode).emit(SOCKET_EVENTS.ORIENTATION_UPDATE, data);
      }
    });

    // Trigger Pull (Controller -> Display)
    socket.on(SOCKET_EVENTS.TRIGGER_PULL, (data: { timestamp: number }) => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info && info.role === 'controller') {
        socket.to(info.roomCode).emit(SOCKET_EVENTS.TRIGGER_PULL, data);
      }
    });

    // Reload Weapon (Controller -> Display)
    socket.on(SOCKET_EVENTS.RELOAD, () => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info && info.role === 'controller') {
        socket.to(info.roomCode).emit(SOCKET_EVENTS.RELOAD);
      }
    });

    // Recenter Gyro (Controller -> Display)
    socket.on(SOCKET_EVENTS.RECENTER, () => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info && info.role === 'controller') {
        socket.to(info.roomCode).emit(SOCKET_EVENTS.RECENTER);
      }
    });

    // Sensitivity Update (Controller -> Display)
    socket.on(SOCKET_EVENTS.SENSITIVITY_UPDATE, (data: { sensitivity: number }) => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info && info.role === 'controller') {
        socket.to(info.roomCode).emit(SOCKET_EVENTS.SENSITIVITY_UPDATE, data);
      }
    });

    // Game Start Trigger (Display or Controller)
    socket.on(SOCKET_EVENTS.GAME_START, () => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info) {
        io.to(info.roomCode).emit(SOCKET_EVENTS.GAME_START);
      }
    });

    // Game Restart Trigger
    socket.on(SOCKET_EVENTS.GAME_RESTART, () => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info) {
        io.to(info.roomCode).emit(SOCKET_EVENTS.GAME_RESTART);
      }
    });

    // Game Over & Score Submission
    socket.on(SOCKET_EVENTS.GAME_OVER, async (scoreData: Omit<LeaderboardEntry, 'id' | 'createdAt'>) => {
      const info = roomManager.getSocketRoom(socket.id);
      if (info) {
        io.to(info.roomCode).emit(SOCKET_EVENTS.GAME_OVER, scoreData);

        // Save to Supabase leaderboard
        try {
          if (scoreData.score > 0) {
            await supabaseService.saveScore(scoreData);
          }
        } catch (err) {
          console.error('[Score] Failed to save score:', err);
        }
      }
    });

    // Ping / Pong for latency tracking
    socket.on(SOCKET_EVENTS.PING, (data: { timestamp: number }) => {
      socket.emit(SOCKET_EVENTS.PONG, { timestamp: data.timestamp, serverTime: Date.now() });
    });

    // Handle Disconnection
    socket.on('disconnect', async () => {
      const { room, role } = await roomManager.handleDisconnect(socket.id);
      if (room) {
        if (role === 'controller' && room.displaySocketId) {
          io.to(room.displaySocketId).emit(SOCKET_EVENTS.PLAYER_DISCONNECTED, { role: 'controller' });
        } else if (role === 'display' && room.controllerSocketId) {
          io.to(room.controllerSocketId).emit(SOCKET_EVENTS.PLAYER_DISCONNECTED, { role: 'display' });
        }
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
