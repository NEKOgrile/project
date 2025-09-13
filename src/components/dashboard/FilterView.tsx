import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Users, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { User, AppSettings } from '../../types';
import { fetchAllUsers } from '../../supabase';

interface FilterViewProps {
  user: User;
  settings: AppSettings;
  onBack: () => void;
}

const FilterView: React.FC<FilterViewProps> = ({
  user,
  settings,
  onBack
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
        // Par défaut, tous les utilisateurs sont sélectionnés
        setSelectedUsers(users.map(u => u.id));
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Sauvegarder les filtres dans localStorage
  useEffect(() => {
    if (selectedUsers.length > 0) {
      localStorage.setItem('userFilters', JSON.stringify(selectedUsers));
    }
  }, [selectedUsers]);

  // Charger les filtres depuis localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('userFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setSelectedUsers(filters);
      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
      }
    }
  }, []);

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(allUsers.map(u => u.id));
  };

  const deselectAll = () => {
    setSelectedUsers([]);
  };

  const resetFilters = () => {
    setSelectedUsers(allUsers.map(u => u.id));
    localStorage.removeItem('userFilters');
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-white">Filtres</h1>
          </div>
          
          <Card className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/20 rounded flex-1"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-white">Filtres utilisateurs</h1>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Users className="w-4 h-4" />
            <span>{selectedUsers.length}/{allUsers.length} sélectionnés</span>
          </div>
        </div>

        {/* Description */}
        <Card className="p-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium mb-2">Filtrage des sélections</h3>
              <p className="text-white/70 text-sm">
                Choisissez quels utilisateurs afficher dans le calendrier. 
                Seules les sélections des personnes cochées seront visibles.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={selectAll}
            className="flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            Tout sélectionner
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={deselectAll}
            className="flex items-center"
          >
            <EyeOff className="w-4 h-4 mr-2" />
            Tout désélectionner
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="flex items-center text-orange-400 hover:text-orange-300"
          >
            Réinitialiser
          </Button>
        </div>

        {/* Liste des utilisateurs */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Utilisateurs ({allUsers.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allUsers.map((u) => {
              const isSelected = selectedUsers.includes(u.id);
              const isCurrentUser = u.id === user.id;
              const selectionCount = u.selections?.length || 0;
              
              return (
                <div
                  key={u.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/15' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } ${isCurrentUser ? 'ring-2 ring-teal-500/50' : ''}`}
                  onClick={() => toggleUser(u.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleUser(u.id)}
                        className="w-5 h-5 text-cyan-500 bg-transparent border-2 border-white/30 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                      {isSelected && (
                        <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrentUser 
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-cyan-500 to-teal-500'
                      }`}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className={`font-medium ${
                          isSelected ? 'text-white' : 'text-white/70'
                        }`}>
                          {u.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full">
                              Vous
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50">
                          {selectionCount} sélection{selectionCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    isSelected ? 'text-cyan-400' : 'text-white/40'
                  }`}>
                    {isSelected ? 'Visible' : 'Masqué'}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Résumé */}
        <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">
                Filtres appliqués
              </div>
              <div className="text-white/70 text-sm">
                {selectedUsers.length === allUsers.length 
                  ? 'Tous les utilisateurs sont visibles'
                  : selectedUsers.length === 0
                  ? 'Aucun utilisateur sélectionné'
                  : `${selectedUsers.length} utilisateur${selectedUsers.length > 1 ? 's' : ''} sélectionné${selectedUsers.length > 1 ? 's' : ''}`
                }
              </div>
            </div>
            
            <Button 
              variant="primary" 
              onClick={onBack}
              className="flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir le calendrier
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FilterView;