// src/contexts/UsersContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

type UsersContextType = {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUser: (u: User) => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode; initialUser: User }> = ({ children, initialUser }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('users');
      return stored ? JSON.parse(stored) : [initialUser];
    } catch {
      return [initialUser];
    }
  });

  // Sauvegarde dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Failed to write users to localStorage', e);
    }
  }, [allUsers]);

  // Sync si autre onglet modifie localStorage
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'users') {
        setAllUsers(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Écoute events globaux (login / update depuis App)
  useEffect(() => {
    const onLogin = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as User | undefined;
      if (!detail) return;
      setAllUsers(prev => {
        const exists = prev.some(u => u.id === detail.id);
        return exists ? prev.map(u => (u.id === detail.id ? detail : u)) : [...prev, detail];
      });
    };

    const onUpdate = (ev: Event) => {
      const detail = (ev as CustomEvent).detail as User | undefined;
      if (!detail) return;
      setAllUsers(prev => prev.map(u => (u.id === detail.id ? detail : u)));
    };

    window.addEventListener('user:login', onLogin as EventListener);
    window.addEventListener('user:update', onUpdate as EventListener);

    return () => {
      window.removeEventListener('user:login', onLogin as EventListener);
      window.removeEventListener('user:update', onUpdate as EventListener);
    };
  }, []);

  const updateUser = (user: User) => {
    setAllUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      return exists ? prev.map(u => (u.id === user.id ? user : u)) : [...prev, user];
    });
  };

  return (
    <UsersContext.Provider value={{ allUsers, setAllUsers, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used inside UsersProvider');
  return ctx;
};
