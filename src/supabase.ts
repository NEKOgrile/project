// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { User } from './types';

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

// Fonctions utilitaires pour la gestion des utilisateurs
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }

    return {
      ...data,
      selections: data.available_date || []
    };
  } catch (err) {
    console.error('Erreur:', err);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: updates.username,
        email: updates.email,
        password: updates.password,
        available_date: updates.selections
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return null;
    }

    return {
      ...data,
      selections: data.available_date || []
    };
  } catch (err) {
    console.error('Erreur:', err);
    return null;
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Erreur:', err);
    return false;
  }
}

export async function checkEmailExists(email: string, excludeUserId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from('users')
      .select('id')
      .eq('email', email);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Erreur:', err);
    return false;
  }
}
