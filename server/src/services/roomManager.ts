import { RoomState, GAME_CONSTANTS } from '@gunlink/shared';
import { redisStore } from './redisStore.js';

export class RoomManager {
  private socketToRoom = new Map<string, { roomCode: string; role: 'display' | 'controller' }>();

  generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < GAME_CONSTANTS.ROOM_CODE_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async createRoom(displaySocketId: string): Promise<RoomState> {
    let code = this.generateRoomCode();
    let existing = await redisStore.getRoom(code);
    
    // Ensure uniqueness
    let attempts = 0;
    while (existing && attempts < 10) {
      code = this.generateRoomCode();
      existing = await redisStore.getRoom(code);
      attempts++;
    }

    const roomState: RoomState = {
      code,
      displaySocketId,
      controllerSocketId: null,
      status: 'LOBBY',
      createdAt: Date.now()
    };

    await redisStore.setRoom(code, roomState);
    this.socketToRoom.set(displaySocketId, { roomCode: code, role: 'display' });
    
    return roomState;
  }

  async joinRoom(roomCode: string, controllerSocketId: string): Promise<{ success: boolean; room?: RoomState; error?: string }> {
    const codeUpper = roomCode.toUpperCase().trim();
    const room = await redisStore.getRoom(codeUpper);

    if (!room) {
      return { success: false, error: 'Room code not found' };
    }

    room.controllerSocketId = controllerSocketId;
    room.status = 'CONNECTED';
    await redisStore.setRoom(codeUpper, room);

    this.socketToRoom.set(controllerSocketId, { roomCode: codeUpper, role: 'controller' });

    return { success: true, room };
  }

  async handleDisconnect(socketId: string): Promise<{ room?: RoomState; role?: 'display' | 'controller' }> {
    const mapping = this.socketToRoom.get(socketId);
    if (!mapping) return {};

    this.socketToRoom.delete(socketId);
    const room = await redisStore.getRoom(mapping.roomCode);

    if (!room) return { role: mapping.role };

    if (mapping.role === 'display') {
      room.displaySocketId = null;
      if (!room.controllerSocketId) {
        await redisStore.deleteRoom(mapping.roomCode);
      } else {
        await redisStore.setRoom(mapping.roomCode, room);
      }
    } else if (mapping.role === 'controller') {
      room.controllerSocketId = null;
      room.status = 'LOBBY';
      await redisStore.setRoom(mapping.roomCode, room);
    }

    return { room, role: mapping.role };
  }

  getSocketRoom(socketId: string) {
    return this.socketToRoom.get(socketId);
  }
}

export const roomManager = new RoomManager();
