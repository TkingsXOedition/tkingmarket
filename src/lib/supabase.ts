import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DeviceAttempt {
  id?: number;
  device_id: string;
  attempts: number;
  blocked_until?: string | null;
  last_attempt: string;
  created_at?: string;
}

export interface MarketData {
  id?: number;
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap?: number;
  last_updated: string;
}

export interface TechnicalIndicator {
  id?: number;
  symbol: string;
  rsi: number;
  macd: number;
  moving_average_20: number;
  volume_ratio: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  buyer_volume_percent: number;
  seller_volume_percent: number;
  last_updated: string;
}