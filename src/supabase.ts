// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { User } from './types';

const SUPABASE_URL = 'https://tigfgvqiizitwxchhxbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZ2ZndnFpaXppdHd4Y2hoeGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTA4NjIsImV4cCI6MjA3MTg2Njg2Mn0.6kQsyzr4xzaQ_qKN9XLEpjYhnmUCv98fYPogWJnUhVI'; // garde ta clé
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Normalise une date en YYYY-MM-DD
function normalizeDate(value: string | Date) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function mapUserFromDB(u: any): User {
  const dates = Array.isArray(u.available_date)
    ? u.available_date.map((d: any) => (typeof d === 'string' ? d : normalizeDate(d)))
    : [];

  console.log("📦 mapUserFromDB - utilisateur:", u.username, "dates dispo:", dates);

  return {
    id: u.id,
    username: u.username,
    email: u.email ?? '',
    password: u.password ?? '',
    available_date: dates,
    selections: dates,
    createdAt: u.createdat ?? (u.created_at ?? new Date().toISOString()),
  };
}

export async function fetchAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, password, available_date, createdat');

  if (error) {
    console.error('fetchAllUsers error:', error);
    throw error;
  }

  return (data || []).map(mapUserFromDB);
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, password, available_date, createdat')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('getUserById error:', error);
    return null;
  }

  return mapUserFromDB(data);
}

export async function addAvailableDate(userId: string, date: string) {
  const newDate = normalizeDate(date);
  const { data, error } = await supabase
    .from('users')
    .select('available_date')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('addAvailableDate - read error:', error);
    throw error;
  }

  const dates = Array.isArray(data?.available_date) ? data.available_date.map((d: any) => String(d)) : [];
  if (dates.includes(newDate)) return dates;

  const updated = [...dates, newDate];
  const { error: updateError } = await supabase
    .from('users')
    .update({ available_date: updated })
    .eq('id', userId);

  if (updateError) {
    console.error('addAvailableDate - update error:', updateError);
    throw updateError;
  }

  return updated;
}

export async function removeAvailableDate(userId: string, date: string) {
  const removeDate = normalizeDate(date);
  const { data, error } = await supabase
    .from('users')
    .select('available_date')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('removeAvailableDate - read error:', error);
    throw error;
  }

  const dates = Array.isArray(data?.available_date) ? data.available_date.map((d: any) => String(d)) : [];
  const updated = dates.filter(d => d !== removeDate);

  const { error: updateError } = await supabase
    .from('users')
    .update({ available_date: updated })
    .eq('id', userId);

  if (updateError) {
    console.error('removeAvailableDate - update error:', updateError);
    throw updateError;
  }

  return updated;
}
