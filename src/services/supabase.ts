import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://safywvodxfioxppvnrug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZnl3dm9keGZpb3hwcHZucnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTcxNTQsImV4cCI6MjA5MTkzMzE1NH0.e6O3WLeCzXzmbDsAtx6s1Iv0SidgNB5KV9GMHp7qD9I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const BACKEND = 'https://aevi-backend.vercel.app';

// ── AUTH HELPERS ──

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://www.myaevi.app/reset-password.html',
  });
  return { error };
}

export async function verifyRecoveryOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
  return { data, error };
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

// ── JOURNAL TYPES & CONSTANTS ──

export interface JournalEntry {
  id: string;
  user_id?: string;
  content: string;
  source: 'manual' | 'chat';
  aevi_reflection?: string | null;
  created_at: string;
  updated_at: string;
}

// ── JOURNAL HELPERS ──

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as JournalEntry[]) || [];
}

export async function createJournalEntry(
  payload: Pick<JournalEntry, 'content' | 'source'> & { aevi_reflection?: string }
): Promise<JournalEntry> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([{ ...payload, user_id: user?.id }])
    .select()
    .single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function updateJournalEntry(
  id: string,
  payload: Partial<Pick<JournalEntry, 'content' | 'source' | 'aevi_reflection'>>
): Promise<JournalEntry> {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as JournalEntry;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── CONVERSATION MESSAGE HELPERS ──

export interface ConversationMessage {
  id: string;
  user_id?: string;
  role: 'user' | 'assistant' | 'divider';
  content: string;
  created_at: string;
}

export async function getConversationMessages(): Promise<ConversationMessage[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as ConversationMessage[]) || [];
}

// ── API HELPERS ──

export async function sendMessage(messages: { role: string; content: string }[]) {
  const session = await getSession();
  const token = session?.access_token;

  const res = await fetch(`${BACKEND}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('LIMIT_REACHED');
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export async function getMemories() {
  const session = await getSession();
  const token = session?.access_token;
  if (!token) return [];

  const res = await fetch(`${BACKEND}/api/memories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.memories || [];
}

/** Same as getMemories but throws on network/auth failure instead of swallowing it. */
export async function getMemoriesOrThrow(): Promise<{ key: string; value: string }[]> {
  const session = await getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${BACKEND}/api/memories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.memories || [];
}

export interface SubscriptionData {
  plan: 'free' | 'plus' | 'pro';
  status?: string;
  renewsAt?: string;
  cancelAt?: string;
  trialEndsAt?: string;
}

export const getSubscription = async (userId: string): Promise<SubscriptionData> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.log('Subscription fetch error:', error);
    return { plan: 'free', status: 'active' };
  }

  return data as SubscriptionData;
};

export async function restorePurchases(): Promise<{ restored: boolean; plan?: string }> {
  const session = await getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BACKEND}/api/subscription/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateProfile(fullName: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  return { data, error };
}

export async function clearMemories(): Promise<void> {
  const session = await getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BACKEND}/api/memories`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function deleteAccount(): Promise<void> {
  const session = await getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${BACKEND}/api/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function startCheckout(plan: 'plus' | 'pro') {
  const PRICES = {
    plus: 'price_1TOKMS48Tfwr0HiZgXAB9Ken',
    pro: 'price_1TOKO848Tfwr0HiZi4fiS0tO',
  };

  const session = await getSession();
  const token = session?.access_token;

  const res = await fetch(`${BACKEND}/api/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      priceId: PRICES[plan],
      successUrl: 'https://myaevi.app?upgraded=true',
      cancelUrl: 'https://myaevi.app',
    }),
  });

  const data = await res.json();
  return data.url;
}
