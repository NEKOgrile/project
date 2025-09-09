import { CalendarSlot } from '../types';
import { t } from './translations';

export const generateCalendarSlots = (month: number, year: number, language: 'fr' | 'en'): CalendarSlot[] => {
  const slots: CalendarSlot[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  
  // Get the first Monday of the week containing the 1st of the month
  let startDate = new Date(firstDayOfMonth);
  const dayOfWeek = startDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(startDate.getDate() + daysToMonday);
  
  // Generate 42 slots (6 weeks * 7 days) to fill the calendar grid
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dayNames = [
      'sunday', 'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday'
    ];
    
    const dayName = t(dayNames[currentDate.getDay()], language);
    
    slots.push({
      id: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      dayName,
      users: []
    });
  }
  
  return slots;
};

export const getMonthName = (month: number, language: 'fr' | 'en'): string => {
  const monthNames = {
    fr: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  };
  
  return monthNames[language][month - 1];
};