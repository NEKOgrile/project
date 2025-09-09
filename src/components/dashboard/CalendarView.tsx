import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { User, AppSettings, CalendarSlot } from '../../types';
import { generateCalendarSlots, getMonthName } from '../../utils/calendar';
import { getUsers, saveUser } from '../../utils/storage';
import { t } from '../../utils/translations';
import { supabase } from '../../supabase';

interface CalendarViewProps {
  user: User;
  settings: AppSettings;
  currentView: 'home' | 'calendar' | 'statistics';
}

const CalendarView: React.FC<CalendarViewProps> = ({ user, settings, currentView }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>(() => user.selections || []);
  
  // allUsers est initialisé depuis le localStorage ou le user connecté
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [user];
  });

  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);

  // Recalcule le calendrier à chaque changement de mois ou d'allUsers
const refreshCalendar = (usersParam?: User[]) => {
  const usersToUse = usersParam || allUsers;

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const slots = generateCalendarSlots(month, year, settings.language);

  const slotsWithUsers = slots.map(slot => ({
    ...slot,
    users: usersToUse.filter(u => u.selections?.includes(slot.id)).map(u => u.id),
  }));

  setCalendarSlots(slotsWithUsers);
};


useEffect(() => {
  refreshCalendar();
}, [currentDate, settings.language]);


  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

const toggleAvailableDate = (date: string) => {
  const isSelected = selectedSlots.includes(date);
  const newSelections = isSelected
    ? selectedSlots.filter(d => d !== date)
    : [...selectedSlots, date];

  setSelectedSlots(newSelections);

  const updatedUser = { ...user, selections: newSelections };
  saveUser(updatedUser);
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  setAllUsers(prev => {
    const exists = prev.find(u => u.id === user.id);
    const newUsers = exists
      ? prev.map(u => u.id === user.id ? updatedUser : u)
      : [...prev, updatedUser];

    // Recalculer le calendrier immédiatement
    refreshCalendar(newUsers);

    return newUsers;
  });

  // Appel Supabase
  (async () => {
    if (isSelected) {
      await supabase.rpc('remove_available_date', { user_id: user.id, old_date: date });
    } else {
      await supabase.rpc('add_available_date', { user_id: user.id, new_date: date });
    }
  })();
};


  const toggleSlotSelection = (slotId: string) => toggleAvailableDate(slotId);

  // --- Rendu Accueil / Statistiques / Calendrier ---
  if (currentView === 'home') {
    return (
      <div className="p-6 space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('welcome', settings.language)}, {user.username}!
          </h2>
          <p className="text-white/70 text-lg">
            Sélectionnez vos créneaux disponibles dans le calendrier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-8">
            <Calendar className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Calendrier</h3>
            <p className="text-white/70">Gérez vos disponibilités</p>
          </Card>

          <Card className="text-center p-8">
            <div className="text-4xl font-bold text-teal-400 mb-2">{selectedSlots.length}</div>
            <p className="text-white/70">Créneaux sélectionnés</p>
          </Card>

          <Card className="text-center p-8">
            <div className="text-4xl font-bold text-cyan-400 mb-2">{allUsers.length}</div>
            <p className="text-white/70">Utilisateurs actifs</p>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'statistics') {
    const totalSelections = allUsers.reduce((sum, u) => sum + (u.selections?.length || 0), 0);
    const averageSelections = totalSelections / (allUsers.length || 1);

    return (
      <div className="p-6 space-y-8">
        <h2 className="text-3xl font-bold text-white">{t('statistics', settings.language)}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-cyan-400 mb-2">{allUsers.length}</div>
            <p className="text-white/70">Utilisateurs totaux</p>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-teal-400 mb-2">{totalSelections}</div>
            <p className="text-white/70">Sélections totales</p>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-green-400 mb-2">{averageSelections.toFixed(1)}</div>
            <p className="text-white/70">Moyenne par utilisateur</p>
          </Card>

          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-purple-400 mb-2">{selectedSlots.length}</div>
            <p className="text-white/70">Vos sélections</p>
          </Card>
        </div>
      </div>
    );
  }

  // --- Vue Calendrier ---
  return (
    <div className="p-6 space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {getMonthName(currentDate.getMonth() + 1, settings.language)} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="md" onClick={() => navigateMonth('prev')} className="flex items-center space-x-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Précédent</span>
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigateMonth('next')} className="flex items-center space-x-2">
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

      </div>

      <Card className="p-6 flex-1">
        <div className="grid grid-cols-7 gap-3 mb-6">
          {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(day => (
            <div key={day} className="text-center text-white/80 font-semibold text-sm p-3 bg-white/5 rounded-lg">
              {t(day, settings.language)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {calendarSlots.map(slot => {
            const isSelected = selectedSlots.includes(slot.id);
            const isCurrentMonth = slot.month === currentDate.getMonth() + 1;
            const hasUsers = slot.users.length > 0;
            const isToday = new Date().toDateString() === new Date(slot.year, slot.month -1, slot.day).toDateString();

            return (
              <Card
                key={slot.id}
                className={`min-h-[80px] lg:min-h-[100px] p-3 relative group cursor-pointer transition-all duration-300 ${!isCurrentMonth ? 'opacity-40':''} ${isToday ? 'ring-2 ring-yellow-400/50':''}`}
                selected={isSelected}
                onClick={() => isCurrentMonth && toggleSlotSelection(slot.id)}
                hover={isCurrentMonth}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-xl font-bold mb-2 ${isToday ? 'text-yellow-400':'text-white'}`}>{slot.day}</div>

                  {hasUsers && (
                    <div className="flex flex-wrap gap-1">
                      {slot.users.slice(0,3).map(uid => {
                        const userObj = allUsers.find(u=>u.id===uid);
                        const pseudo = userObj ? userObj.username : uid.substring(0,4);
                        return <span key={uid} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30 font-medium">{pseudo}</span>;
                      })}
                      {slot.users.length>3 && (
                        <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full border border-teal-500/30 font-medium">
                          +{slot.users.length-3}
                        </span>
                      )}
                    </div>
                  )}

                  {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>}
                </div>

                {hasUsers && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 whitespace-nowrap hidden lg:block pointer-events-none">
                    <div className="font-medium mb-1">{t('selectedBy', settings.language)}:</div>
                    <div>{slot.users.map(uid=>{
                      const userObj = allUsers.find(u=>u.id===uid);
                      return userObj ? userObj.username : uid.substring(0,4);
                    }).join(', ')}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;