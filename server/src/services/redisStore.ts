import { Redis } from '@upstash/redis';
import { RoomState } from '@gunlink/shared';

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
}

class RedisSessionStore {
  private redis: Redis | null = null;
  private memoryFallback = new InMemoryStore();
  public isUsingRedis = false;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
    const isProduction = process.env.NODE_ENV === 'production';

    const isValidUrl = Boolean(url && (url.startsWith('http://') || url.startsWith('https://')) && !url.includes('YOUR_UPSTASH'));

    if (isValidUrl && token && !token.includes('YOUR_UPSTASH')) {
      try {
        this.redis = new Redis({ url: url!, token });
        this.isUsingRedis = true;
        console.log('[Redis] ✅ Connected to Upstash Redis Session Cache');
      } catch (err) {
        console.error('[Redis] Connection failure:', err);
        if (isProduction) {
          throw new Error('PRODUCTION MANDATORY REQUIREMENT: Upstash Redis connection failed. Check UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
        }
      }
    } else {
      if (isProduction) {
        throw new Error(
          `PRODUCTION MANDATORY REQUIREMENT MISSING: UPSTASH_REDIS_REST_URL must be a valid URL (starting with https://) and UPSTASH_REDIS_REST_TOKEN must be set on Render. Received UPSTASH_REDIS_REST_URL="${url || ''}"`
        );
      }
      console.warn('[Redis] Upstash credentials not set or invalid. Running with local in-memory store (Development Mode).');
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
