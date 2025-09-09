export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  available_date?: string[];
  selections: string[];
  createdAt: string;
}


export interface AppSettings {
  language: 'fr' | 'en';
  theme: 'blue-night' | 'anthracite';
}

export interface CalendarSlot {
  id: string;
  day: number;
  month: number;
  year: number;
  dayName: string;
  users: string[];
}

export interface Translation {
  [key: string]: string;
}