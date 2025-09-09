// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Ces valeurs viennent de ton projet Supabase
const SUPABASE_URL = 'https://tigfgvqiizitwxchhxbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpZ2ZndnFpaXppdHd4Y2hoeGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTA4NjIsImV4cCI6MjA3MTg2Njg2Mn0.6kQsyzr4xzaQ_qKN9XLEpjYhnmUCv98fYPogWJnUhVI'; // ⚠️ Anon key (fourni dans ton projet)

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function addAvailableDate(userId: string, date: string) {
  // Récupère l'utilisateur
  const { data: user, error } = await supabase
    .from('users')
    .select('available_date')
    .eq('id', userId)
    .single();

  if (error) throw error;

  // Ajoute la nouvelle date (évite les doublons)
  const dates = user?.available_date || [];
  if (dates.includes(date)) return dates;

  const newDates = [...dates, date];

  // Met à jour en BDD
  const { error: updateError } = await supabase
    .from('users')
    .update({ available_date: newDates })
    .eq('id', userId);

  if (updateError) throw updateError;

  return newDates;
}
