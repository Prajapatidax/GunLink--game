import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from '@gunlink/shared';

class SupabaseService {
  private client: SupabaseClient | null = null;
  private memoryLeaderboard: LeaderboardEntry[] = [
    { id: '1', playerName: 'CYBER_ACE', score: 4500, accuracy: 88.5, comboMax: 14, createdAt: new Date().toISOString() },
    { id: '2', playerName: 'PHANTOM_AIM', score: 3820, accuracy: 82.0, comboMax: 11, createdAt: new Date().toISOString() },
    { id: '3', playerName: 'NEON_TRIGGER', score: 2900, accuracy: 75.4, comboMax: 8, createdAt: new Date().toISOString() }
  ];

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (url && key && !url.includes('YOUR_SUPABASE')) {
      try {
        this.client = createClient(url, key);
        console.log('[Supabase] Connected to PostgreSQL Database Service');
      } catch (err) {
        console.warn('[Supabase] Connection error, using in-memory leaderboard:', err);
      }
    } else {
      console.log('[Supabase] Supabase credentials not set. Running with In-Memory Leaderboard.');
    }
  }

  async saveScore(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>): Promise<LeaderboardEntry> {
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };

    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('leaderboard')
          .insert([newEntry])
          .select()
          .single();
        
        if (!error && data) {
          return data as LeaderboardEntry;
        }
        console.error('[Supabase] Insert error:', error);
      } catch (err) {
        console.error('[Supabase] Save score error:', err);
      }
    }

    this.memoryLeaderboard.push(newEntry);
    this.memoryLeaderboard.sort((a, b) => b.score - a.score);
    this.memoryLeaderboard = this.memoryLeaderboard.slice(0, 50);
    return newEntry;
  }

  async getTopScores(limit = 10): Promise<LeaderboardEntry[]> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data) {
          return data as LeaderboardEntry[];
        }
      } catch (err) {
        console.error('[Supabase] getTopScores error:', err);
      }
    }

    return this.memoryLeaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const supabaseService = new SupabaseService();
