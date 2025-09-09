import React from 'react';
import { Users, Calendar, CheckSquare } from 'lucide-react';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';

interface StatsPanelProps {
  user: User;
  settings: AppSettings;
  allUsers?: User[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ user, settings, allUsers = [] }) => {
  const totalSelections = allUsers.reduce((sum, u) => sum + (u.selections?.length || 0), 0);

  const stats = [
    {
      icon: Users,
      label: t('totalActiveUsers', settings.language),
      value: allUsers.length,
      color: 'text-cyan-400'
    },
    {
      icon: CheckSquare,
      label: t('selectedSlots', settings.language),
      value: totalSelections,
      color: 'text-teal-400'
    },
    {
      icon: Calendar,
      label: t('yourSelections', settings.language),
      value: user.selections?.length || 0,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-white/5 backdrop-blur-sm border-l border-white/10 lg:border-l lg:border-t-0 border-t">
      <h3 className="text-lg font-semibold text-white mb-4">
        {t('statistics', settings.language)}
      </h3>

      <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className={`p-2 bg-white/10 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="hidden lg:block">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>
              </div>
              
              <div className="lg:hidden mt-2">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-white/70 text-xs">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="hidden lg:block">
        <h4 className="text-white font-medium mb-3">Activité récente</h4>
        <div className="space-y-2 text-sm">
          {allUsers.slice(-3).map(u => (
            <div key={u.id} className="flex justify-between items-center text-white/70">
              <span>{u.username}</span>
              <span className="text-cyan-400">{u.selections?.length || 0}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatsPanel;