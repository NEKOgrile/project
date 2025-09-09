import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ConnectSupabaseComponent } from './supabase/connect-supabase/connect-supabase.component';
import { SupabaseService } from './supabase/supabase.service';

@NgModule({
  declarations: [
    AppComponent,
    ConnectSupabaseComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SupabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }