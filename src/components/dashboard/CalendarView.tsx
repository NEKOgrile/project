import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Users, Filter } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { User, AppSettings, CalendarSlot } from "../../types";
import { generateCalendarSlots, getMonthName } from "../../utils/calendar";
import { t } from "../../utils/translations";
import {
  fetchAllUsers,
  addAvailableDate,
  removeAvailableDate,
} from "../../supabase";

interface CalendarViewProps {
  user: User;
  settings: AppSettings;
  currentView: "home" | "calendar" | "statistics";
  onNavigateToFilter?: () => void;
}

// Normalise une date au format YYYY-MM-DD
function normalizeDate(value: string | Date) {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  user,
  settings,
  currentView,
  onNavigateToFilter,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [longPressSlot, setLongPressSlot] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [userFilters, setUserFilters] = useState<string[]>([]);
  const [mostPopularDate, setMostPopularDate] = useState<string | null>(null);

  // Charger les filtres depuis localStorage au démarrage
  useEffect(() => {
    const savedFilters = localStorage.getItem('userFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setUserFilters(filters);
      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
      }
    }
  }, []);

  // Sauvegarder les filtres dans localStorage
  useEffect(() => {
    if (userFilters.length > 0) {
      localStorage.setItem('userFilters', JSON.stringify(userFilters));
    }
  }, [userFilters]);

  // --- Fetch utilisateurs depuis Supabase ---
  const fetchUsersFromDB = async () => {
    try {
      const dbUsers = await fetchAllUsers();

      // On normalise les dates
      const normalized = dbUsers.map((u) => ({
        ...u,
        selections: (u.selections || []).map((s) => normalizeDate(s)),
      }));

      setAllUsers(normalized);

      const currentUser = normalized.find((u) => u.id === user.id);
      setSelectedSlots(currentUser?.selections || []);
      
      // Initialiser les filtres avec tous les utilisateurs
      if (userFilters.length === 0) {
        setUserFilters(normalized.map(u => u.id));
      }
    } catch (err) {
      console.error("Erreur fetchAllUsers:", err);
    }
  };

  // --- Mise à jour des utilisateurs filtrés ---
  useEffect(() => {
    const filtered = allUsers.filter(u => userFilters.includes(u.id));
    setFilteredUsers(filtered);
  }, [allUsers, userFilters]);

  // --- Calcul de la date la plus populaire ---
  useEffect(() => {
    const dateCounts: Record<string, number> = {};
    
    // Compter les sélections par date (en utilisant les utilisateurs filtrés)
    filteredUsers.forEach(u => {
      u.selections.forEach(date => {
        dateCounts[date] = (dateCounts[date] || 0) + 1;
      });
    });

    // Trouver la date avec le plus de sélections
    let maxCount = 0;
    let popularDate = null;
    
    Object.entries(dateCounts).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count;
        popularDate = date;
      }
    });

    // Mettre en évidence seulement si significativement plus populaire (3+ sélections)
    setMostPopularDate(maxCount >= 3 ? popularDate : null);
  }, [filteredUsers]);

  // --- Génération du calendrier avec assignation des users ---
  const refreshCalendar = () => {
    const usersToUse = filteredUsers;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const slots = generateCalendarSlots(month, year, settings.language);

    const slotsWithUsers: CalendarSlot[] = slots.map((slot) => {
      const slotId = normalizeDate(
        new Date(slot.year, slot.month - 1, slot.day)
      );
      const usersIds = usersToUse
        .filter((u) => u.selections?.includes(slotId))
        .map((u) => u.id);

      return {
        ...slot,
        id: slotId,
        users: usersIds,
      };
    });

    setCalendarSlots(slotsWithUsers);
  };

  // --- Lifecycle ---
  useEffect(() => {
    fetchUsersFromDB();
  }, []);

  useEffect(() => {
    refreshCalendar();
  }, [currentDate, settings.language, filteredUsers, allUsers]);

  // --- Gestion des filtres utilisateurs ---
  const toggleUserFilter = (userId: string) => {
    setUserFilters(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setUserFilters(allUsers.map(u => u.id));
  };

  const deselectAllUsers = () => {
    setUserFilters([]);
  };

  // --- Navigation calendrier ---
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1));
      return newDate;
    });
  };

  const toggleAvailableDate = async (dateId: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const normalized = normalizeDate(dateId);
    const isSelected = selectedSlots.includes(normalized);

    // ⚡ Optimistic UI pour tes propres sélections
    setSelectedSlots((prev) =>
      isSelected ? prev.filter((d) => d !== normalized) : [...prev, normalized]
    );

    // ⚡ Optimistic UI pour allUsers
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              selections: isSelected
                ? u.selections.filter((d) => d !== normalized)
                : [...u.selections, normalized],
            }
          : u
      )
    );

    try {
      if (isSelected) {
        await removeAvailableDate(user.id, normalized);
      } else {
        await addAvailableDate(user.id, normalized);
      }

      // synchro silencieuse
      fetchUsersFromDB();
    } catch (err) {
      console.error("toggleAvailableDate error:", err);

      // rollback rapide si erreur
      setSelectedSlots((prev) =>
        isSelected
          ? [...prev, normalized]
          : prev.filter((d) => d !== normalized)
      );

      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                selections: isSelected
                  ? [...u.selections, normalized]
                  : u.selections.filter((d) => d !== normalized),
              }
            : u
        )
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSlotSelection = (slotId: string) => toggleAvailableDate(slotId);

  // Gestion de l'appui prolongé
  const handleTouchStart = (slotId: string, usersCount: number) => {
    if (usersCount === 0) return; // Pas d'action si personne n'a cliqué    
    const timer = setTimeout(() => {
      setLongPressSlot(slotId);
    }, 500); // 500ms pour déclencher l'appui prolongé
    
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const closeLongPress = () => {
    setLongPressSlot(null);
  };
  // Fonction pour raccourcir les jours sur mobile
  const getDayLabel = (day: string, isMobile: boolean = false) => {
    const dayTranslation = t(day, settings.language);
    if (isMobile) {
      // Raccourcir à 3 caractères max sur mobile
      return dayTranslation.substring(0, 3);
    }
    return dayTranslation;
  };

  // --- HOME VIEW ---
  if (currentView === "home") {
    return (
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            {t("welcome", settings.language)}, {user.username}!
          </h2>
          <p className="text-white/70 text-base sm:text-lg">
            Sélectionnez vos créneaux disponibles dans le calendrier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="text-center p-6 sm:p-8">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
              Calendrier
            </h3>
            <p className="text-white/70">Gérez vos disponibilités</p>
          </Card>

          <Card className="text-center p-6 sm:p-8">
            <div className="text-3xl sm:text-4xl font-bold text-teal-400 mb-2">
              {selectedSlots.length}
            </div>
            <p className="text-white/70">Créneaux sélectionnés</p>
          </Card>

          <Card className="text-center p-6 sm:p-8">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
              {allUsers.length}
            </div>
            <p className="text-white/70">Utilisateurs actifs</p>
          </Card>
        </div>
      </div>
    );
  }

  // --- STATISTICS VIEW ---
  if (currentView === "statistics") {
    const totalSelections = allUsers.reduce(
      (sum, u) => sum + (u.selections?.length || 0),
      0
    );
    const averageSelections = totalSelections / (allUsers.length || 1);

    return (
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {t("statistics", settings.language)}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="text-center p-4 sm:p-6">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3 sm:mb-4" />
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">
              {allUsers.length}
            </div>
            <p className="text-white/70 text-sm sm:text-base">Utilisateurs totaux</p>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-teal-400 mb-2">
              {totalSelections}
            </div>
            <p className="text-white/70 text-sm sm:text-base">Sélections totales</p>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
              {averageSelections.toFixed(1)}
            </div>
            <p className="text-white/70 text-sm sm:text-base">Moyenne par utilisateur</p>
          </Card>

          <Card className="text-center p-4 sm:p-6">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">
              {selectedSlots.length}
            </div>
            <p className="text-white/70 text-sm sm:text-base">Vos sélections</p>
          </Card>
        </div>
      </div>
    );
  }

  // --- CALENDAR VIEW ---
  // Calculer les semaines pour uniformiser les hauteurs
  const weeks: CalendarSlot[][] = [];
  for (let i = 0; i < calendarSlots.length; i += 7) {
    weeks.push(calendarSlots.slice(i, i + 7));
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 h-full">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold text-white">
          {getMonthName(currentDate.getMonth() + 1, settings.language)}{" "}
          {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="flex items-center px-3 py-2 text-sm whitespace-nowrap min-w-0"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline ml-1 flex-shrink-0">Précédent</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="flex items-center px-3 py-2 text-sm whitespace-nowrap min-w-0"
          >
            <span className="hidden sm:inline mr-1 flex-shrink-0">Suivant</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </Button>
        </div>
      </div>

      <Card className="p-3 sm:p-6 flex-1">
        {/* En-têtes des jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-4 sm:mb-6">
          {[
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].map((day) => (
            <div
              key={day}
              className="text-center text-white/80 font-semibold p-1 sm:p-2 lg:p-3 bg-white/5 rounded-lg"
            >
              <span className="text-xs sm:text-sm block sm:hidden">
                {getDayLabel(day, true)}
              </span>
              <span className="text-sm hidden sm:block">
                {getDayLabel(day, false)}
              </span>
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="space-y-1 sm:space-y-2 lg:space-y-3">
          {weeks.map((week, weekIndex) => {
            // Calculer si cette semaine a des utilisateurs pour déterminer la hauteur
            const weekHasUsers = week.some(slot => {
              const usersForSlot = allUsers.filter((u) => u.selections.includes(slot.id));
              return usersForSlot.length > 0;
            });
            
            // Hauteur dynamique selon le contenu de la semaine
            const weekHeight = weekHasUsers 
              ? "min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]" 
              : "min-h-[60px] sm:min-h-[80px] lg:min-h-[100px]";

            return (
              <div key={weekIndex} className={`grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 ${weekHeight}`}>
                {week.map((slot) => {
                  const isSelected = selectedSlots.includes(slot.id);
                  const isCurrentMonth = slot.month === currentDate.getMonth() + 1;
                  const isToday =
                    new Date().toDateString() ===
                    new Date(slot.year, slot.month - 1, slot.day).toDateString();
                  const isMostPopular = mostPopularDate === slot.id;

                  // ⚡ recalcul immédiat des utilisateurs pour ce slot
                  const usersForSlot = filteredUsers.filter((u) =>
                    u.selections.includes(slot.id)
                  );

                  const handleSlotClick = () => {
                    if (isCurrentMonth) {
                      toggleSlotSelection(slot.id);
                    }
                  };

                  return (
                    <div
                      key={slot.id}
                      className="relative h-full"
                      onTouchStart={() => handleTouchStart(slot.id, usersForSlot.length)}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                    >
                      <Card
                        className={`h-full p-2 sm:p-2 lg:p-3 relative group cursor-pointer transition-all duration-300 ${
                          !isCurrentMonth ? "opacity-40" : ""
                        } ${isToday ? "ring-2 ring-yellow-400/50" : ""} ${
                          isMostPopular ? "ring-4 ring-orange-500 shadow-lg shadow-orange-500/50 bg-orange-500/10" : ""
                        }`}
                        selected={isSelected}
                        onClick={handleSlotClick}
                        hover={isCurrentMonth}
                      >
                        <div className="flex flex-col h-full">
                          {/* Numéro du jour */}
                          <div
                            className={`text-sm sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 ${
                              isToday ? "text-yellow-400" : 
                              isMostPopular ? "text-orange-400" : "text-white"
                            }`}
                          >
                            {slot.day}
                            {isMostPopular && (
                              <span className="ml-1 text-orange-400 text-xs">🔥</span>
                            )}
                          </div>

                          {/* Affichage des utilisateurs */}
                          <div className="flex-1 flex flex-col justify-start">
                            {usersForSlot.length > 0 ? (
                              <>
                                {/* Sur mobile : affichage très simplifié */}
                                <div className="sm:hidden">
                                  <div className="flex items-center justify-center">
                                    <span className="text-xs bg-cyan-500/30 text-cyan-200 px-2 py-1 rounded-full font-medium">
                                      {usersForSlot.length}👤
                                    </span>
                                  </div>
                                </div>

                                {/* Sur tablette et desktop : affichage détaillé */}
                                <div className="hidden sm:flex flex-wrap gap-1">
                                  {usersForSlot.slice(0, window.innerWidth >= 1024 ? 3 : 2).map((u) => (
                                    <span
                                      key={u.id}
                                      className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30 font-medium max-w-full truncate"
                                    >
                                      {u.username.length > (window.innerWidth >= 1024 ? 8 : 6) 
                                        ? u.username.substring(0, window.innerWidth >= 1024 ? 8 : 6) + '...'
                                        : u.username
                                      }
                                    </span>
                                  ))}
                                  {usersForSlot.length > (window.innerWidth >= 1024 ? 3 : 2) && (
                                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full border border-teal-500/30 font-medium">
                                      +{usersForSlot.length - (window.innerWidth >= 1024 ? 3 : 2)}
                                    </span>
                                  )}
                                </div>
                              </>
                            ) : (
                              // Espace réservé pour maintenir la hauteur uniforme
                              <div className="flex-1"></div>
                            )}
                          </div>

                          {/* Indicateur de sélection */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                          )}
                        </div>

                        {/* Tooltip pour desktop uniquement */}
                        {usersForSlot.length > 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-black/95 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden lg:block pointer-events-none max-w-xs whitespace-nowrap">
                            {/* Ligne titre : X personnes ont cliqué */}
                            <div className="font-medium mb-2">
                              {usersForSlot.length} {usersForSlot.length === 1 ? "personne a" : "personnes ont"} cliqué :
                            </div>

                            {/* Pseudos sur lignes séparées */}
                            <div className="flex flex-col gap-1">
                              {usersForSlot.map((u) => (
                                <div key={u.id} className="whitespace-normal">{u.username}</div>
                              ))}
                            </div>

                            {/* Flèche du tooltip */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95"></div>
                          </div>
                        )}
                      </Card>

                      {/* Popup d'appui prolongé pour mobile */}
{longPressSlot === slot.id && (
  <div className="sm:hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeLongPress}>
    <div 
      className="bg-gray-800 rounded-lg p-4 m-4 max-w-xs w-full shadow-xl border border-gray-600"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-center mb-3">
        <div className="text-lg font-bold text-white mb-1">
          {slot.day} {getMonthName(slot.month, settings.language)}
        </div>
        <div className="text-sm text-gray-300">
          {usersForSlot.length} {usersForSlot.length === 1 ? "personne" : "personnes"}
        </div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {usersForSlot.map((u) => (
          <div key={u.id} className="bg-cyan-500/20 text-cyan-300 px-3 py-2 rounded-lg text-center border border-cyan-500/30">
            {u.username}
          </div>
        ))}
      </div>
      <button 
        onClick={closeLongPress}
        className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
)}

                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;