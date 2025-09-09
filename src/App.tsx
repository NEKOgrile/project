import React, { useState, useEffect } from 'react';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Dashboard from './components/dashboard/Dashboard';
import ProfilePage from './components/profile/ProfilePage';
import SettingsPage from './components/settings/SettingsPage';
import { User, AppSettings } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'login' | 'register' | 'dashboard' | 'profile' | 'settings'>('login');
  const [settings, setSettings] = useState<AppSettings>({
    language: 'fr',
    theme: 'blue-night'
  });

  // Load user and settings from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedSettings = localStorage.getItem('appSettings');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
  }, [settings.theme]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Émettre un événement pour synchroniser avec les autres composants
    window.dispatchEvent(new CustomEvent('user:update', { detail: updatedUser }));
  };

  const navigateToPage = (page: typeof currentPage) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => navigateToPage('register')}
            settings={settings}
          />
        );
      case 'register':
        return (
          <RegisterPage
            onRegister={handleLogin}
            onNavigateToLogin={() => navigateToPage('login')}
            settings={settings}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser!}
            onLogout={handleLogout}
            onNavigateToProfile={() => navigateToPage('profile')}
            onNavigateToSettings={() => navigateToPage('settings')}
            settings={settings}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={currentUser!}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => navigateToPage('dashboard')}
            settings={settings}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => navigateToPage('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPage()}
    </div>
  );
}

export default App;