import { Redis } from '@upstash/redis';
import { RoomState } from '@gunlink/shared';

// Memory Fallback for Zero-Config Local Development
class InMemoryStore {
  private rooms = new Map<string, RoomState>();

  async setRoom(code: string, state: RoomState, ttlSeconds = 3600): Promise<void> {
    this.rooms.set(code, state);
  }

  async getRoom(code: string): Promise<RoomState | null> {
    return this.rooms.get(code) || null;
  }

  async deleteRoom(code: string): Promise<void> {
    this.rooms.delete(code);
  }

  async listRooms(): Promise<RoomState[]> {
    return Array.from(this.rooms.values());
  }
}

class RedisSessionStore {
  private redis: Redis | null = null;
  private memoryFallback = new InMemoryStore();
  public isUsingRedis = false;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token && !url.includes('YOUR_UPSTASH')) {
      try {
        this.redis = new Redis({ url, token });
        this.isUsingRedis = true;
        console.log('[Redis] Connected to Upstash Redis Service');
      } catch (err) {
        console.warn('[Redis] Connection error, using in-memory store:', err);
      }
    } else {
      console.log('[Redis] Upstash credentials not set. Running with In-Memory Session Cache.');
    }
  }

  async setRoom(code: string, state: RoomState, ttlSeconds = 3600): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(`room:${code}`, JSON.stringify(state), { ex: ttlSeconds });
        return;
      } catch (e) {
        console.error('[Redis] setRoom error:', e);
      }
    }
    await this.memoryFallback.setRoom(code, state, ttlSeconds);
  }

  async getRoom(code: string): Promise<RoomState | null> {
    if (this.redis) {
      try {
        const data = await this.redis.get<string | RoomState>(`room:${code}`);
        if (!data) return null;
        return typeof data === 'string' ? JSON.parse(data) : data;
      } catch (e) {
        console.error('[Redis] getRoom error:', e);
      }
    }
    return this.memoryFallback.getRoom(code);
  }

  async deleteRoom(code: string): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.del(`room:${code}`);
        return;
      } catch (e) {
        console.error('[Redis] deleteRoom error:', e);
      }
    }
    await this.memoryFallback.deleteRoom(code);
  }
}

export const redisStore = new RedisSessionStore();
