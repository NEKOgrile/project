import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckSquare } from 'lucide-react';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { fetchAllUsers } from '../../supabase';

interface StatsPanelProps {
  user: User;
  settings: AppSettings;
  allUsers?: User[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ user, settings }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les utilisateurs depuis la base de données
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const users = await fetchAllUsers();
      setAllUsers(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  // Rafraîchir les données toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Écouter les changements de l'utilisateur actuel
  useEffect(() => {
    fetchUsers();
  }, [user.selections]);

  const currentUser = allUsers.find(u => u.id === user.id) || user;
  const totalSelections = allUsers.reduce((sum, u) => sum + (u.selections?.length || 0), 0);

  const stats = [
    {
      icon: Users,
      label: 'Utilisateurs actifs',
      value: allUsers.length,
      color: 'text-cyan-400'
    },
    {
      icon: CheckSquare,
      label: 'Créneaux sélectionnés',
      value: totalSelections,
      color: 'text-teal-400'
    },
    {
      icon: Calendar,
      label: 'Vos sélections',
      value: currentUser.selections?.length || 0,
      color: 'text-green-400'
    }
  ];

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-4 bg-white/5 backdrop-blur-sm border-l border-white/10 lg:border-l lg:border-t-0 border-t">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('statistics', settings.language)}
        </h3>
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="p-2 bg-white/10 rounded-lg animate-pulse">
                  <div className="w-5 h-5 bg-white/20 rounded"></div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-8 h-6 bg-white/20 rounded animate-pulse mb-1"></div>
                  <div className="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="lg:hidden mt-2">
                <div className="w-8 h-6 bg-white/20 rounded animate-pulse mb-1 mx-auto"></div>
                <div className="w-16 h-4 bg-white/20 rounded animate-pulse mx-auto"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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

      {/* Activité récente */}
      <Card className="hidden lg:block">
        <h4 className="text-white font-medium mb-3">Activité récente</h4>
        <div className="space-y-2 text-sm">
          {allUsers.slice(-3).reverse().map(u => (
            <div key={u.id} className="flex justify-between items-center text-white/70">
              <span className="truncate mr-2">{u.username}</span>
              <span className="text-cyan-400 flex-shrink-0">{u.selections?.length || 0}</span>
            </div>
          ))}
          {allUsers.length === 0 && (
            <div className="text-white/50 text-center py-2">
              Aucune activité récente
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StatsPanel;