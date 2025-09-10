import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CalendarView from './CalendarView';
import StatsPanel from './StatsPanel';
import { User, AppSettings } from '../../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onNavigateToProfile,
  onNavigateToSettings,
  settings
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'calendar' | 'statistics'>('calendar');

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        settings={settings}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          user={user}
          onLogout={onLogout}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToSettings={onNavigateToSettings}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          settings={settings}
        />

        {/* Content Container */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <CalendarView
              user={user}
              settings={settings}
              currentView={currentView}
            />
          </div>

          {/* Stats Panel - Desktop only */}
          <div className="hidden lg:block w-80 border-l border-white/10">
            <StatsPanel
              user={user}
              settings={settings}
            />
          </div>
        </div>

        {/* Stats Panel - Mobile (bottom) */}
        <div className="lg:hidden border-t border-white/10">
          <StatsPanel
            user={user}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;