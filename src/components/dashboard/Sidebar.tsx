import React from 'react';
import { Home, Calendar, BarChart3, Settings, X } from 'lucide-react';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { cn } from '../../utils/cn';

interface SidebarProps {
  user: User;
  currentView: 'home' | 'calendar' | 'statistics';
  onViewChange: (view: 'home' | 'calendar' | 'statistics') => void;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
  settings,
  className
}) => {
  const menuItems = [
    { id: 'home', icon: Home, label: t('home', settings.language) },
    { id: 'calendar', icon: Calendar, label: t('calendar', settings.language) },
    { id: 'statistics', icon: BarChart3, label: t('statistics', settings.language) },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 transform transition-transform duration-300 lg:relative lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Navigation</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id as typeof currentView);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-white border border-cyan-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;