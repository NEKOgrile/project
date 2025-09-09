import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async ensureUserColor(userId: string): Promise<string> {
    const color = this._generateColorFromId(userId);
    // Logic to assign the color to the user in the database can be added here
    return color;
  }

  private _generateColorFromId(id: string): string {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = `hsl(${hash % 360}, 100%, 50%)`;
    return color;
  }
}