import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckSquare } from 'lucide-react';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { t } from '../../utils/translations';
import { fetchAllUsers } from '../../supabase';

interface StatsPanelProps {
  user: User;
  settings: AppSettings;
  onUserUpdate?: (user: User) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ user, settings }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Récupérer les utilisateurs depuis la base de données
  const fetchUsers = async () => {
    try {
      const users = await fetchAllUsers();
      console.log('📊 StatsPanel - Données récupérées:', users.length, 'utilisateurs');
      
      // Trier par date de dernière activité (utilisateurs avec le plus de sélections récentes en premier)
      const sortedUsers = users.sort((a, b) => {
        const aSelections = a.selections?.length || 0;
        const bSelections = b.selections?.length || 0;
        if (aSelections !== bSelections) {
          return bSelections - aSelections; // Plus de sélections = plus récent
        }
        // Si même nombre de sélections, trier par date de création
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setAllUsers(sortedUsers);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  // Écouter les changements de l'utilisateur actuel pour rafraîchir immédiatement
  useEffect(() => {
    console.log('👤 StatsPanel - Utilisateur mis à jour, rafraîchissement...');
    fetchUsers();
  }, [user.selections, user.id]);

  // Rafraîchissement automatique toutes les 10 secondes (plus fréquent)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 StatsPanel - Rafraîchissement automatique...');
      fetchUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Écouter les événements de stockage pour synchroniser entre onglets
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser' || e.key === 'users') {
        console.log('💾 StatsPanel - Changement localStorage détecté');
        fetchUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
      label: 'Sélections totales',
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {t('statistics', settings.language)}
        </h3>
        <div className="text-xs text-white/50">
          Mis à jour il y a {Math.floor((Date.now() - lastUpdate) / 1000)}s
        </div>
      </div>

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

      {/* Activité récente - Affiche les utilisateurs triés par activité */}
      <Card className="hidden lg:block">
        <h4 className="text-white font-medium mb-3">Activité récente</h4>
        <div className="space-y-2 text-sm">
          {allUsers.slice(0, 5).map((u, index) => {
            const isCurrentUser = u.id === user.id;
            return (
              <div key={u.id} className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-cyan-500/10 border border-cyan-500/20' : ''
              }`}>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/70'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`truncate mr-2 ${
                    isCurrentUser ? 'text-cyan-300 font-medium' : 'text-white/70'
                  }`}>
                    {u.username}
                    {isCurrentUser && ' (vous)'}
                  </span>
                </div>
                <span className="text-cyan-400 flex-shrink-0 font-medium">
                  {u.selections?.length || 0}
                </span>
              </div>
            );
          })}
          {allUsers.length === 0 && (
            <div className="text-white/50 text-center py-2">
              Aucune activité récente
            </div>
          )}
        </div>
      </Card>

      {/* Indicateur de synchronisation */}
      <div className="hidden lg:block text-center">
        <div className="inline-flex items-center space-x-2 text-xs text-white/50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Synchronisé avec la base de données</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;