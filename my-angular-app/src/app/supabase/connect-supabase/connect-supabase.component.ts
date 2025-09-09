import { Component } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-connect-supabase',
  templateUrl: './connect-supabase.component.html',
  styleUrls: ['./connect-supabase.component.scss']
})
export class ConnectSupabaseComponent {
  url: string = '';
  key: string = '';
  connectionStatus: string = '';

  constructor(private supabaseService: SupabaseService) {}

  connectToSupabase() {
    if (this.url && this.key) {
      this.supabaseService.initializeSupabase(this.url, this.key);
      this.connectionStatus = 'Connected to Supabase!';
    } else {
      this.connectionStatus = 'Please provide both URL and Key.';
    }
  }
}